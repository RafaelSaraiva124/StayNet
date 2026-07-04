"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getAllPartners,
  removePartner,
} from "@/lib/actions/partnerApplication.actions";

export function PartnersList() {
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await getAllPartners();
      if (res.success && res.partners) {
        const formatted = res.partners.map((p) => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : null,
        }));
        setPartners(formatted);
      } else {
        toast.error(res.error || "Erro ao carregar parceiros");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar parceiros");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPartners();
  }, []);

  const handleRemove = async (userId: string) => {
    try {
      const res = await removePartner(userId);
      if (res.success) {
        toast.success("Parceiro removido com sucesso!");
        fetchPartners();
      } else {
        toast.error(res.error || "Erro ao remover parceiro");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover parceiro");
    }
  };

  if (loading) return <p>A carregar lista de parceiros...</p>;
  if (!partners.length) return <p>Não existem parceiros registados.</p>;

  return (
    <div className="space-y-4">
      {partners.map((partner) => (
        <Card
          key={partner.id}
          className="flex flex-row justify-between items-center p-4 max-w-2xl"
        >
          <div>
            <CardHeader className="p-0">
              <CardTitle className="capitalize whitespace-nowrap">
                {partner.fullName}
              </CardTitle>
              <CardDescription>{partner.email}</CardDescription>
            </CardHeader>
          </div>

          <div className="flex flex-col items-end gap-2">
            <CardContent className="p-0 text-right">
              Registo:{" "}
              {partner.createdAt
                ? partner.createdAt.toLocaleDateString("pt-PT")
                : "Desconhecido"}
            </CardContent>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemove(partner.id)}
            >
              Remover
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
