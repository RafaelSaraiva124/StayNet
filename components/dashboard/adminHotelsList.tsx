"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getHotels } from "@/lib/actions/hotel.action";
import { removeHotelAdmin } from "@/lib/actions/dashboard.actions";

type HotelWithImages = Awaited<ReturnType<typeof getHotels>>[number];

export function HotelsList() {
  const [hotels, setHotels] = React.useState<HotelWithImages[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getHotels();
      setHotels(data);
    } catch {
      toast.error("Erro ao carregar hotéis");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (hotelId: string) => {
    if (!confirm("Tens a certeza que queres remover este hotel?")) return;

    const res = await removeHotelAdmin(hotelId);

    if (res.success) {
      toast.success("Hotel removido com sucesso");
      setHotels((prev) => prev.filter((h) => h.id !== hotelId));
    } else {
      toast.error(res.error || "Erro ao remover hotel");
    }
  };

  if (loading) return <p>A carregar hotéis...</p>;
  if (!hotels.length) return <p>Não existem hotéis.</p>;

  return (
    <div className="space-y-4 max-w-2xl w-full">
      {hotels.map((hotel) => (
        <Card
          key={hotel.id}
          className="flex flex-col sm:flex-row items-start justify-between p-4 w-full"
        >
          <div>
            <CardHeader className="p-0">
              <CardTitle className="capitalize whitespace-nowrap text-lg">
                {hotel.name}
              </CardTitle>
              <CardDescription className="capitalize whitespace-nowrap text-sm">
                {hotel.city}, {hotel.country}
              </CardDescription>
            </CardHeader>
          </div>

          <Button
            variant="destructive"
            className="self-center mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto"
            onClick={() => handleDelete(hotel.id)}
          >
            Remover
          </Button>
        </Card>
      ))}
    </div>
  );
}
