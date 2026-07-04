"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Token não encontrado</h2>
          <p className="text-muted-foreground">
            Este link é inválido ou está incompleto.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              Página Inicial
            </Button>
            <Button
              onClick={() => router.push("/recover-password")}
              className="flex-1 bg-brand"
            >
              Recuperar Password
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
