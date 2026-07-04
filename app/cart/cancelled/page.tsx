"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
          <CardDescription>
            Você cancelou o processo de pagamento. Seus itens ainda estão no
            carrinho.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Não se preocupe, você pode tentar novamente quando quiser.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => router.push("/cart")}>
            Voltar ao Carrinho
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/discover")}
          >
            Continuar Explorando
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
