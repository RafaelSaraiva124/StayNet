"use client";

import React from "react";

interface PartnerBookingsListProps {
  bookings: Booking[];
}

export function PartnerBookingsList({ bookings }: PartnerBookingsListProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Confirmed":
        return {
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          label: "Confirmado",
        };

      case "Pending":
        return {
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          label: "Pendente",
        };

      case "Cancelled":
        return {
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          label: "Cancelado",
        };

      case "Completed":
        return {
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          label: "Concluído",
        };

      default:
        return {
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
          label: "Desconhecido",
        };
    }
  };

  if (bookings.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhuma reserva encontrada.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <div
          key={booking.bookingId}
          className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">
              {booking.hotelName}
            </h3>
            <span
              className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${
                getStatusStyles(booking.status).className
              }`}
            >
              {getStatusStyles(booking.status).label}
            </span>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="text-muted-foreground">
                <strong className="text-foreground">Cliente:</strong>{" "}
                {booking.userFullName}
              </div>
              <div className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong>{" "}
                {booking.userEmail}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="text-muted-foreground">
                <strong className="text-foreground">Check-in:</strong>{" "}
                {booking.checkIn}
              </div>
              <div className="text-muted-foreground">
                <strong className="text-foreground">Check-out:</strong>{" "}
                {booking.checkOut}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="text-muted-foreground">
                <strong className="text-foreground">Quarto:</strong>{" "}
                {booking.roomType === "Single" ? "Individual" : "Duplo"}
              </div>
              <div className="text-muted-foreground">
                <strong className="text-foreground">Preço Total:</strong> €
                {booking.totalPrice}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
