"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartComponent } from "@/components/cart/cartComponent";
import { Loader2 } from "lucide-react";
import { getCart } from "@/lib/cart";

function CartContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setIsLoading(false);

    if (items.length === 0) {
    }
  }, []);

  const handleRefresh = () => {
    setCartItems(getCart());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">A carregar carrinho...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <CartComponent cartItems={cartItems} onRefresh={handleRefresh} />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">A carregar carrinho...</p>
          </div>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
