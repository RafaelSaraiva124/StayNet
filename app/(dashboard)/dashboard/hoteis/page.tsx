import React from "react";
import { HotelsList } from "@/components/dashboard/adminHotelsList";

const Page = () => {
  return (
    <div>
      <h1 className="font-medium text-2xl pb-6">Lista de hoteis</h1>
      <HotelsList />
    </div>
  );
};
export default Page;
