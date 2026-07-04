"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedDouble, BedSingle, Loader2, ShoppingCart } from "lucide-react";
import { Calendario } from "./calendarioReservas";
import {
  calculateBookingPrice,
  checkRoomAvailability,
} from "@/lib/actions/booking.actions";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

export function ReservasCard({ hotel }: ReservasCardProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedTab, setSelectedTab] = React.useState<"single" | "double">(
    hotel.singleRoom ? "single" : "double",
  );
  const [isBooking, setIsBooking] = React.useState(false);
  const [priceInfo, setPriceInfo] = React.useState<{
    nights: number;
    total: string;
  } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchPrice = async () => {
      if (!dateRange?.from || !dateRange?.to) {
        setPriceInfo(null);
        return;
      }

      const currentRoom =
        selectedTab === "single" ? hotel.singleRoom : hotel.doubleRoom;
      if (!currentRoom?.id) return;

      const checkIn = dateRange.from.toISOString().split("T")[0];
      const checkOut = dateRange.to.toISOString().split("T")[0];

      const result = await calculateBookingPrice(
        currentRoom.id,
        checkIn,
        checkOut,
      );

      if (
        result.success &&
        result.nights !== undefined &&
        result.total !== undefined
      ) {
        setPriceInfo({
          nights: result.nights,
          total: result.total,
        });
      } else {
        setPriceInfo(null);
      }
    };

    fetchPrice();
  }, [dateRange, selectedTab, hotel.singleRoom?.id, hotel.doubleRoom?.id]);

  const handleAddToCart = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor, selecione as datas");
      return;
    }

    const currentRoom =
      selectedTab === "single" ? hotel.singleRoom : hotel.doubleRoom;

    if (!currentRoom?.id || !priceInfo) {
      toast.error("Quarto não encontrado");
      return;
    }

    setIsBooking(true);

    try {
      const checkIn = dateRange.from.toISOString().split("T")[0];
      const checkOut = dateRange.to.toISOString().split("T")[0];

      const availability = await checkRoomAvailability(
        currentRoom.id,
        checkIn,
        checkOut,
      );

      if (!availability.available) {
        toast.error("Este quarto está indisponível para as datas selecionadas");
        setIsBooking(false);
        return;
      }

      addToCart({
        roomId: currentRoom.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: priceInfo.total,
        nights: priceInfo.nights,
        roomType: currentRoom.roomType,
        hotelName: hotel.name,
        hotelId: hotel.id,
      });

      toast.success(`${hotel.name} foi adicionado ao carrinho!`, {
        description: `${priceInfo.nights} noite(s) • €${priceInfo.total}`,
      });

      setDateRange(undefined);
      setPriceInfo(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar ao carrinho");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => {
        setSelectedTab(value as "single" | "double");
        setDateRange(undefined);
        setPriceInfo(null);
      }}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        {hotel.singleRoom && (
          <TabsTrigger value="single">
            <BedSingle className="mr-2 h-4 w-4" />
            Individual
          </TabsTrigger>
        )}
        {hotel.doubleRoom && (
          <TabsTrigger value="double">
            <BedDouble className="mr-2 h-4 w-4" />
            Duplo
          </TabsTrigger>
        )}
      </TabsList>

      {["single", "double"].map((tab) => {
        const currentRoom =
          tab === "single" ? hotel.singleRoom : hotel.doubleRoom;
        if (!currentRoom) return null;

        return (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "single" ? "Quarto Individual" : "Quarto Duplo"}
                </CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    €{currentRoom.pricePerNight}
                  </span>
                  <span className="text-sm"> por noite</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Descrição do quarto
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {currentRoom.description || "Sem descrição disponível."}
                      </p>
                    </div>

                    {priceInfo && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium">
                          {priceInfo.nights} noite
                          {priceInfo.nights > 1 ? "s" : ""}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          Total: €{priceInfo.total}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-center lg:justify-end">
                    <Calendario
                      roomId={currentRoom.id}
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handleAddToCart}
                  disabled={!dateRange?.from || !dateRange?.to || isBooking}
                  className="w-full"
                  size="lg"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                      processar...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
