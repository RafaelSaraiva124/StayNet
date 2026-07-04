"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyEmailToken } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token não encontrado");
      return;
    }

    const verify = async () => {
      const result = await verifyEmailToken(token);

      if (result.success) {
        setStatus("success");
        setMessage("Email verificado com sucesso!");
      } else {
        setStatus("error");
        setMessage(result.error || "Erro ao verificar email");
      }
    };

    verify();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Image
          src="/logo.png"
          alt="logo"
          width={122}
          height={122}
          className="mb-6"
        />
        <Loader2 className="h-16 w-16 animate-spin text-brand mb-4" />
        <p className="text-lg font-medium">A verificar o seu email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
        <Image
          src="/logo.png"
          alt="logo"
          width={122}
          height={122}
          className="mb-6"
        />
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">
          Erro na Verificação
        </h1>
        <p className="text-center text-muted-foreground mb-6">{message}</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full mb-6">
          <p className="text-sm text-amber-800">
            Se o link expirou, terá de se registar novamente.
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1"
          >
            Página Inicial
          </Button>
          <Button
            onClick={() => router.push("/sign-up")}
            className="flex-1 bg-brand"
          >
            Registar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <Image
        src="/logo.png"
        alt="logo"
        width={122}
        height={122}
        className="mb-6"
      />
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-green-600 mb-2">
        Email Verificado!
      </h1>
      <p className="text-center text-muted-foreground mb-6">{message}</p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full mb-6 space-y-2">
        <p className="text-sm text-green-800">✓ A sua conta foi ativada</p>
        <p className="text-sm text-green-800">✓ Já pode fazer login</p>
      </div>

      <Button
        onClick={() => router.push("/sign-in")}
        className="w-full bg-brand"
        size="lg"
      >
        Fazer Login
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
