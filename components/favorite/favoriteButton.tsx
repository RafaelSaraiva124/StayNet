"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  toggleFavorite,
  checkIsFavorite,
} from "@/lib/actions/favorites.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  hotelId: string;
  variant?: "default" | "icon";
  className?: string;
}

interface FavoriteButtonProps {
  hotelId: string;
  variant?: "default" | "icon";
  className?: string;
}

export function FavoriteButton({
  hotelId,
  variant = "default",
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const result = await checkIsFavorite(hotelId);
      if (result.success && result.isFavorite !== undefined) {
        setIsFavorite(result.isFavorite);
      }
    }
    checkFavorite();
  }, [hotelId]);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleFavorite(hotelId);

    if (result.success && result.isFavorite !== undefined) {
      setIsFavorite(result.isFavorite);
      toast.success(
        result.isFavorite
          ? "Adicionado aos favoritos"
          : "Removido dos favoritos",
      );
    } else {
      toast.error(result.error || "Erro ao processar favorito");
    }

    setIsLoading(false);
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "rounded-full hover:bg-white/80 transition-colors",
          className,
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-600 hover:text-red-500",
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className={className}
    >
      <Heart className={cn("mr-2 h-4 w-4", isFavorite && "fill-current")} />
      {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
    </Button>
  );
}
