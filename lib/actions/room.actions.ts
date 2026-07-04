"use server";

import { db } from "@/database/drizzle";
import { rooms } from "@/database/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

function validatePrice(price: string | number): number {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (!Number.isFinite(numPrice) || numPrice <= 0) {
    throw new Error("Preço inválido");
  }
  return numPrice;
}

function validateTotalRooms(total: number): number {
  if (!Number.isInteger(total) || total < 0) {
    throw new Error("Número de quartos inválido");
  }
  return total;
}

export async function configureHotelRooms(data: CreateHotelRoomsInput) {
  try {
    const roomsToInsert = [];

    if (data.singleRoom && data.singleRoom.totalRooms > 0) {
      const price = validatePrice(data.singleRoom.pricePerNight);
      const total = validateTotalRooms(data.singleRoom.totalRooms);

      roomsToInsert.push({
        hotelId: data.hotelId,
        roomType: "Single" as const,
        pricePerNight: price.toFixed(2),
        totalRooms: total,
        description: data.singleRoom.description,
      });
    }

    if (data.doubleRoom && data.doubleRoom.totalRooms > 0) {
      const price = validatePrice(data.doubleRoom.pricePerNight);
      const total = validateTotalRooms(data.doubleRoom.totalRooms);

      roomsToInsert.push({
        hotelId: data.hotelId,
        roomType: "Double" as const,
        pricePerNight: price.toFixed(2),
        totalRooms: total,
        description: data.doubleRoom.description,
      });
    }

    if (roomsToInsert.length === 0) {
      return {
        success: false,
        error: "É obrigatório configurar pelo menos um tipo de quarto",
      };
    }

    const existingRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.hotelId, data.hotelId));

    if (existingRooms.length > 0) {
      for (const room of roomsToInsert) {
        const existing = existingRooms.find(
          (r) => r.roomType === room.roomType,
        );

        if (existing) {
          await db
            .update(rooms)
            .set({
              pricePerNight: room.pricePerNight,
              totalRooms: room.totalRooms,
              description: room.description,
              updatedAt: new Date(),
            })
            .where(eq(rooms.id, existing.id));
        } else {
          await db.insert(rooms).values(room);
        }
      }

      const providedTypes = roomsToInsert.map((r) => r.roomType);
      const typesToRemove = existingRooms
        .filter((r) => !providedTypes.includes(r.roomType))
        .map((r) => r.id);

      if (typesToRemove.length > 0) {
        for (const id of typesToRemove) {
          await db.delete(rooms).where(eq(rooms.id, id));
        }
      }
    } else {
      await db.insert(rooms).values(roomsToInsert);
    }

    revalidatePath(`/hotels/${data.hotelId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao configurar quartos:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro ao configurar quartos",
    };
  }
}
