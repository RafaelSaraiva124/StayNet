import React from "react";
import { AdminPartnerApplications } from "@/components/partner/dashboardPartnerApplications";
import { PartnersList } from "@/components/partner/partnerList";

const Page = () => {
  return (
    <div>
      <div className="pb-15">
        <h1 className="font-medium text-2xl pb-6">
          Lista de candidaturas pendentes
        </h1>
        <AdminPartnerApplications />
      </div>

      <div>
        <h1 className="font-medium text-2xl pb-6">
          Lista de Parceiros registados
        </h1>

        <PartnersList />
      </div>
    </div>
  );
};
export default Page;
