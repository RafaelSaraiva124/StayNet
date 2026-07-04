import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, MapPin, BedDouble, Clock } from "lucide-react";
import Link from "next/link";

type Props = {
  bookings: any[];
};

export default function MyBookingsList({ bookings }: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const calculateNights = (checkIn: string, checkOut: string) =>
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    );

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: any }> = {
      Confirmed: { label: "Confirmada", variant: "default" },
      Pending: { label: "Pendente", variant: "secondary" },
      Cancelled: { label: "Cancelada", variant: "destructive" },
    };

    const cfg = map[status] ?? {
      label: status,
      variant: "secondary",
    };

    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  if (bookings.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">As Minhas Reservas</h1>
          <p className="text-muted-foreground mt-2">
            Gerir as suas reservas de hotel
          </p>
        </div>

        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma Reserva</h2>
          <p className="text-muted-foreground mb-6">
            Ainda não tem reservas. Explore os nossos hotéis!
          </p>

          <Button asChild>
            <Link href="/discover">
              <Calendar className="mr-2 h-4 w-4" />
              Explorar Hotéis
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const upcoming = bookings.filter(
    ({ booking }) => new Date(booking.checkInDate) >= new Date(),
  );

  const past = bookings.filter(
    ({ booking }) => new Date(booking.checkInDate) < new Date(),
  );

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">As Minhas Reservas</h1>
          <p className="text-muted-foreground mt-1">
            {bookings.length} {bookings.length === 1 ? "reserva" : "reservas"}
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/discover">Nova Reserva</Link>
        </Button>
      </div>

      {upcoming.length > 0 && <Section title="Próximas" bookings={upcoming} />}

      {past.length > 0 && <Section title="Histórico" bookings={past} muted />}
    </div>
  );

  function Section({
    title,
    bookings,
    muted,
  }: {
    title: string;
    bookings: any[];
    muted?: boolean;
  }) {
    return (
      <div className={muted ? "opacity-60" : "mb-12"}>
        <h2 className="text-xl font-semibold mb-4">
          {title} ({bookings.length})
        </h2>

        <div className="space-y-4">
          {bookings.map(({ booking, room, hotel }) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {hotel.city}, {hotel.country}
                    </CardDescription>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <Info icon={Calendar} label="Check-in">
                      {formatDate(booking.checkInDate)}
                    </Info>
                    <Info icon={Calendar} label="Check-out">
                      {formatDate(booking.checkOutDate)}
                    </Info>
                    <Info icon={Clock} label="Duração">
                      {calculateNights(
                        booking.checkInDate,
                        booking.checkOutDate,
                      )}{" "}
                      noites
                    </Info>
                  </div>

                  <div className="space-y-2">
                    <Info icon={BedDouble} label="Quarto">
                      {room.roomType === "Single" ? "Individual" : "Duplo"}
                    </Info>

                    <p>
                      <strong>Preço por noite:</strong> €{room.pricePerNight}
                    </p>

                    <p className="text-lg font-bold text-primary">
                      €{booking.totalPrice}
                    </p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="pt-2 border-t">
                    <p className="font-medium mb-1">Pedidos Especiais:</p>
                    <p className="text-muted-foreground">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="text-xs text-muted-foreground">
                Reserva #{booking.id.slice(0, 8)}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function Info({
    icon: Icon,
    label,
    children,
  }: {
    icon: any;
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{label}:</span>
        <span>{children}</span>
      </div>
    );
  }
}
