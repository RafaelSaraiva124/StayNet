import React from "react";
import { GuestsList } from "@/components/controlpanel/guestsList";

const Page = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-left">
        Lista de Hóspedes
      </h1>
      <GuestsList />
    </div>
  );
};
export default Page;
