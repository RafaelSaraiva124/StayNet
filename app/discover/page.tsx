import React from "react";
import { HotelCard } from "@/components/hotels/hotelcard";
import { getHotels } from "@/lib/actions/hotel.action";
import HotelFilters from "@/components/hotels/hotel-filters";
import { Search } from "lucide-react";

interface SearchParams {
  search?: string;
  city?: string;
  country?: string;
}

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const hotels = await getHotels();
  const params = await searchParams;

  if (hotels.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Hotéis</h1>
          <p className="text-muted-foreground">
            Ainda não há hotéis disponíveis.
          </p>
        </div>
      </div>
    );
  }

  const searchTerm = params.search?.toLowerCase() || "";
  const selectedCity = params.city || "all";
  const selectedCountry = params.country || "all";

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      searchTerm === "" ||
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.city.toLowerCase().includes(searchTerm) ||
      hotel.country?.toLowerCase().includes(searchTerm) ||
      hotel.description?.toLowerCase().includes(searchTerm);

    const matchesCity = selectedCity === "all" || hotel.city === selectedCity;
    const matchesCountry =
      selectedCountry === "all" || hotel.country === selectedCountry;

    return matchesSearch && matchesCity && matchesCountry;
  });

  const cities = Array.from(new Set(hotels.map((h) => h.city))).sort();
  const countries = Array.from(
    new Set(hotels.map((h) => h.country).filter(Boolean)),
  ).sort() as string[];

  const hasActiveFilters =
    searchTerm !== "" || selectedCity !== "all" || selectedCountry !== "all";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Descubra o seu Hotel Ideal
          </h1>
          <p className="text-muted-foreground">
            {hotels.length}{" "}
            {hotels.length === 1 ? "hotel disponível" : "hotéis disponíveis"}
          </p>
        </div>

        <HotelFilters
          cities={cities}
          countries={countries}
          totalHotels={hotels.length}
          filteredCount={filteredHotels.length}
          hasActiveFilters={hasActiveFilters}
        />

        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum hotel encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os seus filtros de pesquisa
            </p>
            {hasActiveFilters && (
              <a
                href="/discover"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Limpar todos os filtros
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
