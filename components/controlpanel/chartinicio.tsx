"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getPartnerBookings } from "@/lib/actions/booking.actions";

const chartConfig = {
  reservations: {
    label: "Reservas",
  },
  single: {
    label: "Quartos Individuais",
    color: "#4f46e5", // azul
  },
  double: {
    label: "Quartos Duplos",
    color: "#f97316", // laranja
  },
} satisfies ChartConfig;

interface BookingChartData {
  date: string;
  single: number;
  double: number;
}

export function BookingChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<BookingChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const result = await getPartnerBookings();

        if (result.success && result.bookings) {
          const bookingsByDate = new Map<
            string,
            { single: number; double: number }
          >();

          result.bookings.forEach((booking) => {
            const checkInDate = new Date(booking.checkIn);
            const dateStr = checkInDate.toISOString().split("T")[0];

            if (!bookingsByDate.has(dateStr)) {
              bookingsByDate.set(dateStr, { single: 0, double: 0 });
            }

            const current = bookingsByDate.get(dateStr)!;
            if (booking.roomType === "Single") {
              current.single += 1;
            } else if (booking.roomType === "Double") {
              current.double += 1;
            }
          });

          const sortedData = Array.from(bookingsByDate.entries())
            .map(([date, counts]) => ({
              date,
              single: counts.single,
              double: counts.double,
            }))
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );

          setChartData(sortedData);
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    const lastDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  const totalBookings = React.useMemo(() => {
    return filteredData.reduce(
      (sum, item) => sum + item.single + item.double,
      0,
    );
  }, [filteredData]);

  if (isLoading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Reservas por Tipo de Quarto</CardTitle>
            <CardDescription>A carregar dados...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-muted-foreground">A carregar...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Reservas por Tipo de Quarto</CardTitle>
            <CardDescription>Sem dados disponíveis</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-muted-foreground">
              Ainda não existem reservas para mostrar
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Reservas por Tipo de Quarto</CardTitle>
          <CardDescription>
            {totalBookings} {totalBookings === 1 ? "reserva" : "reservas"} nos
            últimos{" "}
            {timeRange === "90d"
              ? "3 meses"
              : timeRange === "30d"
                ? "30 dias"
                : "7 dias"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSingle" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.single.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.single.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDouble" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.double.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.double.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-PT", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-PT", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="double"
              type="natural"
              fill="url(#fillDouble)"
              stroke={chartConfig.double.color}
              strokeWidth={2}
            />
            <Area
              dataKey="single"
              type="natural"
              fill="url(#fillSingle)"
              stroke={chartConfig.single.color}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
