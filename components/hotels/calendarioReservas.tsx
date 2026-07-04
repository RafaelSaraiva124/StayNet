"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { getUnavailableDates } from "@/lib/actions/booking.actions";

interface CalendarioProps {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  roomId: string;
}

export function Calendario({
  dateRange,
  setDateRange,
  roomId,
}: CalendarioProps) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    dateRange?.from || today,
  );
  const [unavailableDates, setUnavailableDates] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (!roomId) return;

      setIsLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      const checkIn = firstDay.toISOString().split("T")[0];
      const checkOut = lastDay.toISOString().split("T")[0];

      const result = await getUnavailableDates(roomId, checkIn, checkOut);

      if (result.success && result.unavailableDates) {
        setUnavailableDates(result.unavailableDates);
      } else {
        setUnavailableDates([]);
      }

      setIsLoading(false);
    };

    fetchUnavailableDates();
  }, [roomId, currentMonth]);

  const isDayUnavailable = React.useCallback(
    (date: Date): boolean => {
      const dateStr = date.toISOString().split("T")[0];
      return unavailableDates.includes(dateStr);
    },
    [unavailableDates],
  );

  const modifiers = React.useMemo(
    () => ({
      available: (date: Date) => date >= today && !isDayUnavailable(date),
      unavailable: (date: Date) => date >= today && isDayUnavailable(date),
    }),
    [today, isDayUnavailable],
  );

  const modifiersClassNames = {
    available: "bg-green-100 text-green-900 hover:bg-green-200 font-semibold",
    unavailable:
      "bg-red-100 text-red-900 hover:bg-red-200 line-through opacity-50",
  };

  return (
    <div className="flex flex-col gap-2">
      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          A carregar disponibilidade...
        </div>
      )}
      <div className="flex justify-center">
        <Calendar
          mode="range"
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
          disabled={(date) => date < today || isDayUnavailable(date)}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
