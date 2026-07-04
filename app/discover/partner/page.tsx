import React from "react";
import { PartnerApplicationForm } from "@/components/partner/createPartnerApplication";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen w-full p-5 bg-background text-foreground">
      <div className="max-w-2xl w-full mb-8">
        <h1 className="text-4xl font-bold mb-2">Torne-se Parceiro StayNet</h1>
      </div>

      <div className="w-full items-center max-w-2xl">
        <PartnerApplicationForm />
      </div>
    </div>
  );
};

export default Page;
