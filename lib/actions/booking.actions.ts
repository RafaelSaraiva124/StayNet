"use server";

import { db } from "@/database/drizzle";
import { rooms, bookings, hotels, users } from "@/database/schema";
import { eq, and, or, lt, gt, inArray, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
) {
  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);

  if (!room[0]) {
    return { available: false, room: null };
  }

  const totalRooms = room[0].totalRooms;

  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        or(eq(bookings.status, "Confirmed"), eq(bookings.status, "Pending")),
        and(
          lt(bookings.checkInDate, checkOut),
          gt(bookings.checkOutDate, checkIn),
        ),
      ),
    );

  const bookedRooms = existingBookings.length;
  const availableRooms = totalRooms - bookedRooms;

  return {
    available: availableRooms > 0,
    availableRooms,
    totalRooms,
    room: room[0],
  };
}

export async function getUnavailableDates(
  roomId: string,
  startDate: string,
  endDate: string,
) {
  try {
    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room[0]) {
      return { success: false, error: "Quarto não encontrado" };
    }

    const totalRooms = room[0].totalRooms;

    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          or(eq(bookings.status, "Confirmed"), eq(bookings.status, "Pending")),
          and(
            lt(bookings.checkInDate, endDate),
            gt(bookings.checkOutDate, startDate),
          ),
        ),
      );

    const dateCounts = new Map<string, number>();

    existingBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      const current = new Date(checkIn);
      while (current < checkOut) {
        const dateStr = current.toISOString().split("T")[0];
        dateCounts.set(dateStr, (dateCounts.get(dateStr) || 0) + 1);
        current.setDate(current.getDate() + 1);
      }
    });

    const unavailableDates: string[] = [];
    dateCounts.forEach((count, date) => {
      if (count >= totalRooms) {
        unavailableDates.push(date);
      }
    });

    return {
      success: true,
      unavailableDates,
      totalRooms,
    };
  } catch (error) {
    console.error("Erro ao buscar datas indisponíveis:", error);
    return {
      success: false,
      error: "Erro ao buscar datas indisponíveis",
    };
  }
}

export async function calculateBookingPrice(
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
) {
  try {
    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room[0]) {
      return { success: false, error: "Quarto não encontrado" };
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return { success: false, error: "Datas inválidas" };
    }

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const pricePerNight = parseFloat(room[0].pricePerNight);
    const total = nights * pricePerNight;

    return {
      success: true,
      nights,
      pricePerNight,
      total: total.toFixed(2),
    };
  } catch (error) {
    console.error("Erro ao calcular preço:", error);
    return { success: false, error: "Erro ao calcular preço" };
  }
}

export async function getUserBookings() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utilizador não autenticado",
      };
    }

    const userBookings = await db
      .select({
        booking: bookings,
        room: rooms,
        hotel: {
          id: hotels.id,
          name: hotels.name,
          city: hotels.city,
          country: hotels.country,
        },
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
      .where(eq(bookings.userId, session.user.id))
      .orderBy(desc(bookings.createdAt));

    return {
      success: true,
      bookings: userBookings,
    };
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return {
      success: false,
      error: "Erro ao buscar reservas do utilizador",
    };
  }
}

export async function getPartnerBookings() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utilizador não autenticado",
      };
    }

    const userId = session.user.id;

    const partnerHotels = await db
      .select({
        id: hotels.id,
        name: hotels.name,
      })
      .from(hotels)
      .where(eq(hotels.ownerId, userId));

    if (!partnerHotels.length) {
      return { success: true, bookings: [] };
    }

    const hotelIds = partnerHotels.map((h) => h.id);

    const bookingsList = await db
      .select({
        bookingId: bookings.id,
        checkIn: bookings.checkInDate,
        checkOut: bookings.checkOutDate,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        roomId: rooms.id,
        roomType: rooms.roomType,
        hotelId: hotels.id,
        hotelName: hotels.name,
        userFullName: users.fullName,
        userEmail: users.email,
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(hotels, eq(rooms.hotelId, hotels.id))
      .innerJoin(users, eq(bookings.userId, users.id))
      .where(inArray(hotels.id, hotelIds))
      .orderBy(desc(bookings.checkInDate));

    return { success: true, bookings: bookingsList };
  } catch (error) {
    console.error("Erro ao buscar reservas do parceiro:", error);
    return { success: false, error: "Erro ao buscar reservas do parceiro" };
  }
}
