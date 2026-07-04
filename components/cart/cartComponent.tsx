"use client";

import * as React from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CreditCard,
  Calendar,
  BedDouble,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { removeFromCart, clearCart, getCartTotal } from "@/lib/cart";
import { createCheckoutSessionMultiple } from "@/lib/actions/checkout.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface CartComponentProps {
  cartItems: CartItem[];
  onRefresh: () => void;
}

export function CartComponent({ cartItems, onRefresh }: CartComponentProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    onRefresh();
  };

  const handleClearCart = () => {
    clearCart();
    onRefresh();
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createCheckoutSessionMultiple(cartItems);

      if (!result.success) {
        throw new Error(result.error || "Erro ao criar sessão de pagamento");
      }

      if (!result.url) {
        throw new Error("URL de pagamento não retornada");
      }

      window.location.href = result.url;
    } catch (err) {
      console.error("Erro no checkout:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao processar pagamento",
      );
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Carrinho Vazio</CardTitle>
            <CardDescription>
              Ainda não adicionou nenhuma reserva ao carrinho
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push("/discover")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explorar Hotéis
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Carrinho de Reservas</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "itens"} no
              carrinho
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Tudo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpar Carrinho?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem a certeza que deseja remover todas as reservas do carrinho?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearCart}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, Limpar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{item.hotelName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4" />
                    {item.roomType === "Single"
                      ? "Quarto Individual"
                      : "Quarto Duplo"}
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover item?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deseja remover {item.hotelName} do carrinho?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    <strong>Check-in:</strong>{" "}
                    {new Date(item.checkInDate).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    <strong>Check-out:</strong>{" "}
                    {new Date(item.checkOutDate).toLocaleDateString("pt-PT")}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    {item.nights} noite{item.nights > 1 ? "s" : ""}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    €{item.totalPrice}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 text-destructive">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Erro ao processar pagamento
                </p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.hotelName}</span>
              <span>€{item.totalPrice}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">€{total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/discover")}
            disabled={isProcessing}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar a Procurar
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />A processar...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Finalizar · €{total.toFixed(2)}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Pagamento 100% seguro via Stripe
        </p>
        <p className="text-xs text-muted-foreground">
          Confirmação imediata por email após o pagamento
        </p>
      </div>
    </div>
  );
}
