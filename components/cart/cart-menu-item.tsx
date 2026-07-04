"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { getCartCount } from "@/lib/cart";

export function CartMenuItem() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setItemCount(getCartCount());
    };

    updateCount();

    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  return (
    <SidebarMenuButton asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart />
        <span>Carrinho</span>
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
          >
            {itemCount}
          </Badge>
        )}
      </Link>
    </SidebarMenuButton>
  );
}
