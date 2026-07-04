import { getPartnerBookings } from "@/lib/actions/booking.actions";
import { PartnerBookingsList } from "@/components/controlpanel/partnerBookingList";

export default async function OwnerBookingsPage() {
  const result = await getPartnerBookings();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Erro</h1>
        <p className="text-red-600">{result.error}</p>
      </div>
    );
  }

  const bookings = result.bookings || [];

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-left">
          Reservas dos Meus Hotéis
        </h1>
        <p className="text-gray-600">Ainda não há reservas nos seus hotéis.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-left pb-6">
        Reservas dos Meus Hotéis
      </h1>
      <PartnerBookingsList bookings={bookings} />
    </div>
  );
}
