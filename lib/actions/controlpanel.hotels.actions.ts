"use server";

import { db } from "@/database/drizzle";
import { hotels, rooms, bookings, users } from "@/database/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";

export async function deleteHotel(hotelId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const hotel = await db
    .select({ id: hotels.id })
    .from(hotels)
    .where(and(eq(hotels.id, hotelId), eq(hotels.ownerId, session.user.id)))
    .limit(1);

  if (!hotel.length) {
    return {
      success: false,
      error: "Hotel não encontrado",
    };
  }

  const activeBookings = await db
    .select({ id: bookings.id })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(
      and(
        eq(rooms.hotelId, hotelId),
        inArray(bookings.status, ["Pending", "Confirmed"]),
      ),
    )
    .limit(1);

  if (activeBookings.length > 0) {
    return {
      success: false,
      error: "Não é possível apagar o hotel: existem reservas ativas",
    };
  }

  await db.delete(hotels).where(eq(hotels.id, hotelId));

  return { success: true };
}

export async function getPartnerActiveStays() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const data = await db
    .select({
      bookingId: bookings.id,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      roomType: rooms.roomType,
      hotelName: hotels.name,
      guestName: users.fullName,
      guestEmail: users.email,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
    .innerJoin(users, eq(bookings.userId, users.id))
    .where(
      and(
        eq(hotels.ownerId, session.user.id),
        eq(bookings.status, "Confirmed"),
        eq(bookings.checkedIn, true),
      ),
    );

  return { success: true, bookings: data };
}

export async function checkInBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  await db
    .update(bookings)
    .set({
      checkedIn: true,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  return { success: true };
}

export async function checkOutBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  await db
    .update(bookings)
    .set({
      status: "Completed",
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  return { success: true };
}

export async function getPartnerPendingCheckIns() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const data = await db
    .select({
      bookingId: bookings.id,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      roomType: rooms.roomType,
      hotelName: hotels.name,
      guestName: users.fullName,
      guestEmail: users.email,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
    .innerJoin(users, eq(bookings.userId, users.id))
    .where(
      and(
        eq(hotels.ownerId, session.user.id),
        eq(bookings.status, "Confirmed"),
        eq(bookings.checkedIn, false),
      ),
    );

  return { success: true, bookings: data };
}

export async function getAllPartnerGuests() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const data = await db
    .select({
      guestName: users.fullName,
      guestEmail: users.email,
      hotelName: hotels.name,
      isStaying: bookings.checkedIn,
      status: bookings.status,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
    .innerJoin(users, eq(bookings.userId, users.id))
    .where(
      and(
        eq(hotels.ownerId, session.user.id),
        inArray(bookings.status, ["Confirmed", "Completed"]),
      ),
    )
    .orderBy(desc(bookings.createdAt));

  const guests = data.map((g) => ({
    guestName: g.guestName,
    guestEmail: g.guestEmail,
    hotelName: g.hotelName,
    isStaying: g.isStaying && g.status === "Confirmed",
  }));

  return { success: true, guests };
}
