"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { handleSignOut } from "@/lib/actions/auth";
import { useTransition } from "react";
import { LogOut } from "lucide-react";

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

interface SignOutButtonProps {
  variant?: "default" | "dropdown";
  className?: string;
}

export function SignOutButton({
  variant = "default",
  className,
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await handleSignOut();
    });
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem
        onClick={handleClick}
        disabled={isPending}
        className={`text-red-500 cursor-pointer focus:text-red-600 ${className}`}
      >
        {isPending ? "A sair..." : "Terminar Sessão"}
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      variant="default"
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      <LogOut className="text-red-500 cursor-pointer focus:text-red-600" />
      {isPending ? "A sair..." : "Terminar sessão"}
    </Button>
  );
}