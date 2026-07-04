"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmBookingPayment } from "@/lib/actions/checkout.actions";
import { clearCart } from "@/lib/cart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [bookingId, setBookingId] = useState<string | undefined>();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      return;
    }

    const confirmPayment = async () => {
      try {
        const result = await confirmBookingPayment(sessionId);

        if (result.paid) {
          setStatus("success");
          setBookingId(result.bookingId);

          clearCart();
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
            <CardTitle>Confirmando Pagamento</CardTitle>
            <CardDescription>
              Por favor, aguarde enquanto processamos sua reserva...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <CardTitle>Erro ao Confirmar Pagamento</CardTitle>
            <CardDescription>
              Houve um problema ao processar sua reserva. Entre em contato com o
              suporte.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/cart")}>
              Voltar ao Carrinho
            </Button>
            <Button onClick={() => router.push("/discover")}>
              Explorar Hotéis
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua reserva foi confirmada com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          {bookingId && (
            <p className="text-sm text-muted-foreground">
              ID da Reserva: <span className="font-mono">{bookingId}</span>
            </p>
          )}
          <p className="text-sm">
            Você receberá um email de confirmação em breve.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => router.push("/discover/bookings")}
          >
            Ver Minhas Reservas
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/discover")}
          >
            Explorar Mais Hotéis
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
