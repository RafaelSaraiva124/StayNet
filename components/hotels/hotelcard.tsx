import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

export function HotelCard({ hotel }: { hotel: HotelCardProps }) {
  return (
    <Link href={`/discover/${hotel.id}`} className="group">
      <Card className="relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 h-80">
        <div className="absolute inset-0">
          {hotel.images.length > 0 ? (
            <Image
              src={hotel.images[0].url}
              alt={`Imagem do ${hotel.name}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <h3 className="capitalize text-xl font-bold mb-2 line-clamp-2 group-hover:text-[var(--brand2)] transition-colors">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-white/90">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="capitalize line-clamp-1">
              {hotel.city}, {hotel.country}
            </span>
          </div>

          {hotel.description && (
            <p className="text-sm text-white/80 line-clamp-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {hotel.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
