import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite/favoriteButton";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    city: string;
    country: string;
    description?: string;
    imageUrl?: string;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        {hotel.imageUrl ? (
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute top-2 right-2">
          <FavoriteButton hotelId={hotel.id} variant="icon" />
        </div>
      </div>

      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {hotel.city}, {hotel.country}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {hotel.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {hotel.description}
          </p>
        )}

        <FavoriteButton
          hotelId={hotel.id}
          variant="default"
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
