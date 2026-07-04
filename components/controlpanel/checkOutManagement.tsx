"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import {
  getPartnerActiveStays,
  checkOutBooking,
} from "@/lib/actions/controlpanel.hotels.actions";
import { toast } from "sonner";

interface Booking {
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  hotelName: string;
  guestName: string;
  guestEmail: string;
}

export function CheckOutManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    const result = await getPartnerActiveStays();
    if (result.success && result.bookings) {
      setBookings(result.bookings);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCheckOut = async (bookingId: string) => {
    setProcessingId(bookingId);
    const result = await checkOutBooking(bookingId);
    if (result.success) {
      toast.success("Check-out realizado com sucesso!");
      loadBookings();
    } else {
      toast.error(result.error || "Erro ao fazer check-out");
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check-outs Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-outs Pendentes ({bookings.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum check-out pendente
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="border rounded-lg p-4 space-y-3"
              >
                <div>
                  <p className="font-semibold">{booking.hotelName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.roomType === "Single" ? "Individual" : "Duplo"}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-sm font-medium">Hóspede</p>
                  <p className="font-semibold">{booking.guestName}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.guestEmail}
                  </p>
                </div>

                <div className="text-sm">
                  <p>
                    Check-in:{" "}
                    {new Date(booking.checkInDate).toLocaleDateString("pt-PT")}
                  </p>
                  <p>
                    Check-out:{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString("pt-PT")}
                  </p>
                </div>

                <Button
                  onClick={() => handleCheckOut(booking.bookingId)}
                  disabled={processingId === booking.bookingId}
                  className="w-full"
                  variant="destructive"
                >
                  {processingId === booking.bookingId ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Fazer Check-out
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
