"use server";

import { db } from "@/database/drizzle";
import { hotels, bookings, users } from "@/database/schema";
import { and, eq, or, count } from "drizzle-orm";
import { auth } from "@/auth";

export async function removeHotelAdmin(hotelId: string) {
  try {
    const activeBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, hotelId),
          or(eq(bookings.status, "Pending"), eq(bookings.status, "Confirmed")),
        ),
      );

    if (activeBookings.length > 0) {
      return {
        success: false,
        error: "Não é possível remover o hotel. Existem reservas ativas.",
      };
    }

    await db.delete(hotels).where(eq(hotels.id, hotelId));

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao remover hotel:", error);
    return {
      success: false,
      error: error?.message || "Erro ao remover o hotel",
    };
  }
}

export async function getDashboardStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utilizador não autenticado",
      };
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user[0] || user[0].role !== "Admin") {
      return {
        success: false,
        error: "Acesso não autorizado",
      };
    }

    const normalUsers = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "User"));

    const partners = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "Partner"));

    const totalHotels = await db.select({ count: count() }).from(hotels);

    //
    const activeBookings = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        or(eq(bookings.status, "Confirmed"), eq(bookings.status, "Pending")),
      );

    return {
      success: true,
      stats: {
        totalUsers: normalUsers[0].count,
        totalPartners: partners[0].count,
        totalHotels: totalHotels[0].count,
        activeBookings: activeBookings[0].count,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return {
      success: false,
      error: "Erro ao buscar estatísticas do dashboard",
    };
  }
}
