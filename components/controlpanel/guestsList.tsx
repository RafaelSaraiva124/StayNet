"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getAllPartnerGuests } from "@/lib/actions/controlpanel.hotels.actions";

interface Guest {
  guestName: string;
  guestEmail: string;
  hotelName: string;
  isStaying: boolean;
}

export function GuestsList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuests = async () => {
      const result = await getAllPartnerGuests();
      if (result.success && result.guests) {
        setGuests(result.guests);
      }
      setLoading(false);
    };
    loadGuests();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Hóspedes ({guests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {guests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum hóspede
          </p>
        ) : (
          <div className="space-y-3">
            {guests.map((guest, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{guest.guestName}</p>
                  <p className="text-sm text-muted-foreground">
                    {guest.guestEmail}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hotel: {guest.hotelName}
                  </p>
                </div>
                <Badge variant={guest.isStaying ? "default" : "secondary"}>
                  {guest.isStaying ? "Hospedado" : "Não Hospedado"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
