"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  approveApplication,
  rejectApplication,
  getPendingApplications,
} from "@/lib/actions/partnerApplication.actions";

export function AdminPartnerApplications() {
  const [applications, setApplications] = React.useState<PartnerApplication[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getPendingApplications();

      const formatted =
        res?.map((app) => ({
          ...app,
          createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
        })) || [];

      setApplications(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar candidaturas");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveApplication(id);
      toast.success("Candidatura aprovada!");
      fetchApplications();
    } catch {
      toast.error("Erro ao aprovar candidatura");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectApplication(id);
      toast.success("Candidatura rejeitada!");
      fetchApplications();
    } catch {
      toast.error("Erro ao rejeitar candidatura");
    }
  };

  if (loading) return <p>A carregar...</p>;
  if (!applications.length) return <p>Não há candidaturas pendentes.</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      {applications.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle>{app.hotelName}</CardTitle>
            <CardDescription>
              Candidato: {app.userFullName} ({app.userEmail})
            </CardDescription>
            <CardDescription>
              Submetida em: {app.createdAt.toLocaleDateString("pt-PT")}
            </CardDescription>
          </CardHeader>

          <CardContent>{app.description}</CardContent>

          <CardFooter className="flex gap-2 justify-end">
            <Button size="sm" onClick={() => handleApprove(app.id)}>
              Aprovar
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReject(app.id)}
            >
              Rejeitar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
