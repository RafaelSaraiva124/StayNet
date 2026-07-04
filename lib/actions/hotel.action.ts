"use server";

import { db } from "@/database/drizzle";
import { hotelImages, hotels, rooms } from "@/database/schema";
import { revalidatePath } from "next/cache";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { configureHotelRooms } from "./room.actions";
import { auth } from "@/auth";

export async function getHotels() {
  try {
    const hotelsList = await db.select().from(hotels);

    if (hotelsList.length === 0) return [];

    const hotelIds = hotelsList.map((h) => h.id);

    const images = await db
      .select()
      .from(hotelImages)
      .where(inArray(hotelImages.hotelId, hotelIds))
      .orderBy(asc(hotelImages.order));

    const imagesByHotelId = new Map<string, typeof images>();

    for (const img of images) {
      const arr = imagesByHotelId.get(img.hotelId) ?? [];
      arr.push(img);
      imagesByHotelId.set(img.hotelId, arr);
    }
    return hotelsList.map((hotel) => ({
      ...hotel,
      images: imagesByHotelId.get(hotel.id) ?? [],
    }));
  } catch (error) {
    console.error("Erro ao listar hotéis:", error);
    throw new Error("Não foi possível carregar os hotéis");
  }
}

function isCloudinaryUrl(url: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  return url.includes(`res.cloudinary.com/${cloudName}/`);
}

function isValidPublicId(id: string) {
  return /^[a-zA-Z0-9/_-]+$/.test(id);
}

export async function createHotel(data: CreateHotelInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const images = Array.isArray(data.images) ? data.images : [];

    for (const img of images) {
      if (!img?.url || !isCloudinaryUrl(img.url)) {
        return { success: false, error: "URL de imagem inválida." };
      }
      if (!img?.publicId || !isValidPublicId(img.publicId)) {
        return { success: false, error: "Public ID inválido." };
      }
    }

    const inserted = await db
      .insert(hotels)
      .values({
        ownerId: session.user.id,
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country ?? "Portugal",
        email: data.email,
        phone: data.phone,
      })
      .returning({ id: hotels.id });

    const hotelId = inserted[0]?.id;
    if (!hotelId) {
      return { success: false, error: "Falha ao criar hotel." };
    }

    if (images.length > 0) {
      await db.insert(hotelImages).values(
        images.map((img, i) => ({
          hotelId,
          url: img.url,
          publicId: img.publicId,
          order: Number.isFinite(img.order) ? (img.order as number) : i,
        })),
      );
    }

    const roomsConfig: any = { hotelId };

    if (
      data.singleRoomTotal &&
      data.singleRoomTotal > 0 &&
      data.singleRoomPrice
    ) {
      roomsConfig.singleRoom = {
        roomType: "Single",
        pricePerNight: data.singleRoomPrice,
        totalRooms: data.singleRoomTotal,
        description: data.singleRoomDescription,
      };
    }

    if (
      data.doubleRoomTotal &&
      data.doubleRoomTotal > 0 &&
      data.doubleRoomPrice
    ) {
      roomsConfig.doubleRoom = {
        roomType: "Double",
        pricePerNight: data.doubleRoomPrice,
        totalRooms: data.doubleRoomTotal,
        description: data.doubleRoomDescription,
      };
    }

    if (roomsConfig.singleRoom || roomsConfig.doubleRoom) {
      await configureHotelRooms(roomsConfig);
    }

    revalidatePath("/discover");

    return { success: true };
  } catch (error) {
    console.error("Erro ao criar hotel:", error);
    return { success: false, error: "Não foi possível criar o hotel" };
  }
}

export async function getHotelById(id: string) {
  try {
    const hotel = await db
      .select()
      .from(hotels)
      .where(eq(hotels.id, id))
      .limit(1);

    if (!hotel[0]) return null;

    const images = await db
      .select()
      .from(hotelImages)
      .where(eq(hotelImages.hotelId, id))
      .orderBy(asc(hotelImages.order));

    const hotelRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.hotelId, id));

    return {
      ...hotel[0],
      images,
      singleRoom: hotelRooms.find((r) => r.roomType === "Single") || null,
      doubleRoom: hotelRooms.find((r) => r.roomType === "Double") || null,
    };
  } catch (error) {
    console.error("Erro ao buscar hotel:", error);
    return null;
  }
}

export async function getUserHotels() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utilizador não autenticado");
  }

  return await db
    .select({
      id: hotels.id,
      name: hotels.name,
      city: hotels.city,
      country: hotels.country,
    })
    .from(hotels)
    .where(eq(hotels.ownerId, session.user.id))
    .orderBy(desc(hotels.createdAt));
}
