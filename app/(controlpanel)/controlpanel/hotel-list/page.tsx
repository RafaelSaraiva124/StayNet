import { UserHotelsList } from "@/components/controlpanel/PartnerHotelsList";
import { getUserHotels } from "@/lib/actions/hotel.action";

export default async function ControlPanelHotels() {
  const hotels = await getUserHotels();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-left pb-6">
        Os meus hotéis
      </h2>
      <UserHotelsList hotels={hotels} />
    </section>
  );
}
