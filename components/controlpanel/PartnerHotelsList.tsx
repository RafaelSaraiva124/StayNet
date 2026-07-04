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
import { deleteHotel } from "@/lib/actions/controlpanel.hotels.actions";

type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string | null;
};

export function UserHotelsList({ hotels }: { hotels: Hotel[] }) {
  const [items, setItems] = React.useState(hotels);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleDelete = async (hotelId: string) => {
    if (!confirm("Tens a certeza que queres apagar este hotel?")) return;

    setLoadingId(hotelId);

    const res = await deleteHotel(hotelId);

    if (res.success) {
      toast.success("Hotel removido com sucesso");
      setItems((prev) => prev.filter((h) => h.id !== hotelId));
    } else {
      toast.error(res.error || "Não foi possível remover o hotel");
    }

    setLoadingId(null);
  };

  if (!items.length) {
    return <p className="text-muted-foreground">Ainda não tens hotéis.</p>;
  }

  return (
    <div className="w-full space-y-3 lg:max-w-3xl lg:mr-auto">
      {items.map((hotel) => (
        <Card
          key={hotel.id}
          className="
            flex flex-col gap-3 p-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <CardHeader className="p-0">
            <CardTitle className="text-base capitalize whitespace-nowrap">
              {hotel.name}
            </CardTitle>
            <CardDescription className="capitalize whitespace-nowrap">
              {hotel.city}, {hotel.country}
            </CardDescription>
          </CardHeader>

          <Button
            variant="destructive"
            size="sm"
            disabled={loadingId === hotel.id}
            onClick={() => handleDelete(hotel.id)}
            className="w-full sm:w-auto"
          >
            {loadingId === hotel.id ? "A remover..." : "Remover"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
