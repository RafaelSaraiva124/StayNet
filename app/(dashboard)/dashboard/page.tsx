import React from "react";
import { DashboardStats } from "@/components/dashboard/dashboardMetrics";

const Page = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das estatísticas da plataforma
        </p>
      </div>

      <DashboardStats />
    </div>
  );
};
export default Page;
