import React from "react";
import { BookingChart } from "@/components/controlpanel/chartinicio";

const Page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {" "}
        Pagina de Controlo de Parceiro
      </h1>
      <BookingChart />
    </div>
  );
};
export default Page;
