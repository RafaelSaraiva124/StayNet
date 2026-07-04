import { getUserBookings } from "@/lib/actions/booking.actions";
import { redirect } from "next/navigation";
import MyBookingsList from "@/components/mybookings/myBookingsList";

export default async function MyBookingsPage() {
  const result = await getUserBookings();

  if (!result.success) {
    redirect("/discover");
  }

  return <MyBookingsList bookings={result.bookings || []} />;
}
