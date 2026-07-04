"use server";

import { db } from "@/database/drizzle";
import { favorites, hotels, hotelImages } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(hotelId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utilizador não autenticado",
      };
    }

    const userId = session.user.id;

    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.hotelId, hotelId)))
      .limit(1);

    if (existingFavorite.length > 0) {
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.hotelId, hotelId)),
        );

      revalidatePath("/favorites");
      return {
        success: true,
        isFavorite: false,
        message: "Removido dos favoritos",
      };
    } else {
      await db.insert(favorites).values({
        userId,
        hotelId,
      });

      revalidatePath("/favorites");
      return {
        success: true,
        isFavorite: true,
        message: "Adicionado aos favoritos",
      };
    }
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
    return {
      success: false,
      error: "Erro ao processar favorito",
    };
  }
}

export async function checkIsFavorite(hotelId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, isFavorite: false };
    }

    const userId = session.user.id;

    const favorite = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.hotelId, hotelId)))
      .limit(1);

    return {
      success: true,
      isFavorite: favorite.length > 0,
    };
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    return {
      success: false,
      error: "Erro ao verificar favorito",
    };
  }
}

export async function getUserFavorites() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Utilizador não autenticado",
      };
    }

    const userId = session.user.id;

    const userFavorites = await db
      .select({
        favoriteId: favorites.id,
        hotelId: hotels.id,
        hotelName: hotels.name,
        hotelDescription: hotels.description,
        hotelCity: hotels.city,
        hotelCountry: hotels.country,
        hotelAddress: hotels.address,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(hotels, eq(favorites.hotelId, hotels.id))
      .where(eq(favorites.userId, userId))
      .orderBy(favorites.createdAt);

    const favoritesWithImages = await Promise.all(
      userFavorites.map(async (fav) => {
        const images = await db
          .select({
            url: hotelImages.url,
            order: hotelImages.order,
          })
          .from(hotelImages)
          .where(eq(hotelImages.hotelId, fav.hotelId))
          .orderBy(hotelImages.order)
          .limit(1);

        return {
          ...fav,
          imageUrl: images[0]?.url || null,
        };
      }),
    );

    return {
      success: true,
      favorites: favoritesWithImages,
    };
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return {
      success: false,
      error: "Erro ao buscar favoritos do utilizador",
    };
  }
}
