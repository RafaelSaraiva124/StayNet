import { getUserFavorites } from "@/lib/actions/favorites.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite/favoriteButton";
import { MapPin, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function FavoritesList() {
  const result = await getUserFavorites();

  if (!result.success || !result.favorites) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {result.error || "Erro ao carregar favoritos"}
        </p>
      </div>
    );
  }

  if (result.favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Ainda não tem favoritos</h3>
        <p className="text-muted-foreground">
          Adicione hotéis aos favoritos para vê-los aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {result.favorites.map((favorite) => (
        <Card key={favorite.favoriteId} className="overflow-hidden group">
          <div className="relative h-48 w-full overflow-hidden">
            {favorite.imageUrl ? (
              <Image
                src={favorite.imageUrl}
                alt={favorite.hotelName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Heart className="h-16 w-16 text-gray-300" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <FavoriteButton hotelId={favorite.hotelId} variant="icon" />
            </div>
          </div>

          <CardHeader>
            <CardTitle className="line-clamp-1">{favorite.hotelName}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">
                {favorite.hotelCity}, {favorite.hotelCountry}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {favorite.hotelDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {favorite.hotelDescription}
              </p>
            )}
            <Link
              href={`/discover/${favorite.hotelId}`}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ver detalhes
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
