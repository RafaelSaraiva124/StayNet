import React from "react";
import { CheckInManagement } from "@/components/controlpanel/checkInManagement";
import { CheckOutManagement } from "@/components/controlpanel/checkOutManagement";

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CheckInManagement />
      <CheckOutManagement />
    </div>
  );
};
export default Page;
