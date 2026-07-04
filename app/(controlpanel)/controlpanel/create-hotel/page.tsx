import React from "react";
import { CreateHotelForm } from "@/components/hotels/hotelForm";

const Page = () => {
  return (
    <div className="w-full max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-left">
          Novo Hotel
        </h1>
        <p className="mt-1 text-sm md:text-base text-muted-foreground">
          Adiciona o teu hotel à plataforma e torna-o visível para os clientes.
        </p>
      </div>

      <CreateHotelForm />
    </div>
  );
};

export default Page;
