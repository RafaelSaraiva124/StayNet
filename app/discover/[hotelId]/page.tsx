import { getHotelById } from "@/lib/actions/hotel.action";
import { ImageSlider } from "@/components/hotels/imageslider";
import { ReservasCard } from "@/components/hotels/reservasCard";
import dynamic from "next/dynamic";
import { FavoriteButton } from "@/components/favorite/favoriteButton";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <p className="text-sm text-muted-foreground">A carregar mapa…</p>
  ),
});

export default async function HotelDetailsPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          Hotel não encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="capitalize text-3xl md:text-4xl font-bold mb-2 text-foreground">
          {hotel.name}
        </h1>
        <p className="capitalize text-muted-foreground text-lg">
          {hotel.city}, {hotel.country}
        </p>
      </div>

      <div className="mb-8">
        <ImageSlider images={hotel.images} hotelName={hotel.name} />
      </div>

      {hotel.description && (
        <div className="flex mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Sobre o hotel
            </h2>
            <p className="capitalize text-muted-foreground leading-relaxed">
              {hotel.description}
            </p>
          </div>

          <FavoriteButton
            className="with-30px"
            hotelId={hotel.id}
            variant="icon"
          />
        </div>
      )}
      <div>
        <ReservasCard hotel={hotel} />
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Contactos
        </h2>
        <div className="space-y-2">
          <p className="text-foreground">
            <span className="font-medium">Morada:</span>{" "}
            <p className="capitalize text-small text-muted-foreground leading-relaxed">
              {hotel.address}
            </p>
            <div className="flex justify-center mt-4 h-64 w-full rounded-lg overflow-hidden border-border">
              <Map location={hotel.address} />
            </div>
          </p>
          <p className="text-foreground">
            <span className="font-medium">Email:</span>{" "}
            <a
              href={`mailto:${hotel.email}`}
              className="text-primary hover:underline"
            >
              {hotel.email}
            </a>
          </p>
          {hotel.phone && (
            <p className="text-foreground">
              <span className="font-medium">Telefone:</span>{" "}
              <a
                href={`tel:${hotel.phone}`}
                className="text-primary hover:underline"
              >
                {hotel.phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
