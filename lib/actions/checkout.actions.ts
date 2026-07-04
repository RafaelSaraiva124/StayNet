"use server";

import { db } from "@/database/drizzle";
import { rooms, bookings, hotels } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import Stripe from "stripe";
import { createTemporaryHold, getActiveHolds, releaseHold } from "@/lib/redis";
import { checkRoomAvailability } from "./booking.actions";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSessionMultiple(
  items: CheckoutData[],
): Promise<CheckoutSessionResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return {
        success: false,
        error: "Você precisa estar autenticado para fazer uma reserva",
      };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const holdIds: string[] = [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const itemsMetadata: Record<string, any> = {};

    for (let i = 0; i < items.length; i++) {
      const data = items[i];

      const availability = await checkRoomAvailability(
        data.roomId,
        data.checkInDate,
        data.checkOutDate,
      );

      if (!availability.available || !availability.room) {
        for (const holdId of holdIds) {
          await releaseHold(holdId);
        }
        return {
          success: false,
          error: `${data.hotelName} não está disponível para as datas selecionadas`,
        };
      }

      const activeHolds = await getActiveHolds(
        data.roomId,
        data.checkInDate,
        data.checkOutDate,
      );

      const totalAvailable = (availability.availableRooms || 0) - activeHolds;

      if (totalAvailable <= 0) {
        for (const holdId of holdIds) {
          await releaseHold(holdId);
        }
        return {
          success: false,
          error: `${data.hotelName} temporariamente reservado. Tente novamente em alguns minutos.`,
        };
      }

      const holdId = await createTemporaryHold(
        data.roomId,
        data.checkInDate,
        data.checkOutDate,
        userId,
      );
      holdIds.push(holdId);

      const hotel = await db
        .select({ name: hotels.name })
        .from(hotels)
        .innerJoin(rooms, eq(rooms.hotelId, hotels.id))
        .where(eq(rooms.id, data.roomId))
        .limit(1);

      const hotelName = hotel[0]?.name || data.hotelName || "Hotel";

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${hotelName} - ${
              data.roomType === "Single" ? "Quarto Individual" : "Quarto Duplo"
            }`,
            description: `${data.nights} noite${data.nights > 1 ? "s" : ""} (${new Date(
              data.checkInDate,
            ).toLocaleDateString("pt-PT")} - ${new Date(
              data.checkOutDate,
            ).toLocaleDateString("pt-PT")})`,
          },
          unit_amount: Math.round(parseFloat(data.totalPrice) * 100),
        },
        quantity: 1,
      });

      itemsMetadata[`item_${i}_roomId`] = data.roomId;
      itemsMetadata[`item_${i}_checkIn`] = data.checkInDate;
      itemsMetadata[`item_${i}_checkOut`] = data.checkOutDate;
      itemsMetadata[`item_${i}_specialRequests`] = data.specialRequests || "";
      itemsMetadata[`item_${i}_holdId`] = holdId;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart/cancelled`,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        userId,
        itemCount: items.length.toString(),
        holdIds: holdIds.join(","),
        ...itemsMetadata,
      },
      expires_at: Math.floor(Date.now() / 1000) + 1800,
    });

    return {
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url || undefined,
      holdId: holdIds.join(","),
    };
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro ao criar sessão de pagamento",
    };
  }
}

export async function confirmBookingPayment(
  sessionId: string,
): Promise<PaymentStatus> {
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      return { paid: false };
    }

    const metadata = checkoutSession.metadata;
    if (!metadata) {
      throw new Error("sessão não encontrada");
    }

    const itemCount = parseInt(metadata.itemCount || "1");

    const bookingIds: string[] = [];

    for (let i = 0; i < itemCount; i++) {
      const roomId = metadata[`item_${i}_roomId`];
      const checkIn = metadata[`item_${i}_checkIn`];
      const checkOut = metadata[`item_${i}_checkOut`];
      const holdId = metadata[`item_${i}_holdId`];

      if (!roomId || !checkIn || !checkOut) {
        console.error(`Item ${i} incompleto no metadata`);
        continue;
      }

      const existingBooking = await db
        .select()
        .from(bookings)
        .where(eq(bookings.stripeSessionId, sessionId))
        .limit(1);

      if (existingBooking.length === 0) {
        const totalAmount = checkoutSession.amount_total! / 100;
        const itemPrice = (totalAmount / itemCount).toFixed(2);

        const bookingResult = await db
          .insert(bookings)
          .values({
            userId: metadata.userId,
            roomId: roomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice: itemPrice,
            status: "Confirmed",
            stripeSessionId: sessionId,
            stripePaymentIntentId: checkoutSession.payment_intent as string,
            paidAt: new Date(),
          })
          .returning();

        bookingIds.push(bookingResult[0].id);
      } else {
        bookingIds.push(existingBooking[0].id);
      }

      if (holdId) {
        await releaseHold(holdId);
      }
    }

    if (metadata.holdIds) {
      const holdIds = metadata.holdIds.split(",");
      for (const holdId of holdIds) {
        await releaseHold(holdId);
      }
    }

    revalidatePath("/discover/bookings");

    return {
      paid: true,
      bookingId: bookingIds[0],
      status: "Confirmed",
    };
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    return { paid: false };
  }
}
