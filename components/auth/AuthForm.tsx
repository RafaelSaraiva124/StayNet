"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import React, { useState } from "react";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, CheckCircle } from "lucide-react";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{
    success: boolean;
    error?: string;
    pendingVerification?: boolean;
  }>;
  type: "SIGN_UP" | "SIGN_IN" | "RECOVER_PASSWORD";
}

const TITLES = {
  SIGN_IN: "Bem-vindo(a)",
  SIGN_UP: "Criar Conta",
  RECOVER_PASSWORD: "Recuperar Password",
};

const BUTTON_TEXT = {
  SIGN_IN: "Iniciar Sessão",
  SIGN_UP: "Criar Conta",
  RECOVER_PASSWORD: "Enviar Link de Recuperação",
};

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [recoverSuccess, setRecoverSuccess] = useState(false);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const router = useRouter();

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success && result.pendingVerification) {
      setPendingVerification(true);
      setUserEmail((data as any).email);
    } else if (result.success && type === "RECOVER_PASSWORD") {
      setRecoverSuccess(true);
      setUserEmail((data as any).email);
    } else if (result.success) {
      toast.success("Sessão iniciada com sucesso");
      router.push("/discover");
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  if (pendingVerification || recoverSuccess) {
    const title = pendingVerification
      ? "Verifique o seu Email"
      : "Email Enviado!";
    const subtitle = pendingVerification
      ? "Enviámos um link de verificação para:"
      : "Se existir uma conta associada a:";

    return (
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <Image
          src="/logo.png"
          alt="logo"
          width={96}
          height={96}
          className="mx-auto"
        />

        <CheckCircle className="mx-auto h-14 w-14 text-primary" />

        <h2 className="text-2xl font-semibold">{title}</h2>

        <div className="rounded-lg border bg-muted p-4">
          <Mail className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <p className="mt-1 text-sm font-medium">{userEmail}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          O link expira em breve. Verifique também a pasta de spam.
        </p>

        <Button variant="outline" onClick={() => router.push("/sign-in")}>
          Voltar ao Login
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border bg-card p-8 shadow-sm">
      <Image
        src="/logo.png"
        alt="logo"
        width={96}
        height={96}
        className="mx-auto"
      />

      <h2 className="text-center text-2xl font-semibold">{TITLES[type]}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>

                  <FormControl>
                    <Input
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      className="h-11 px-4"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {type === "RECOVER_PASSWORD" && (
            <div className="rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
              Receberá um email com um link seguro para redefinir a sua
              password.
            </div>
          )}

          <Button className="h-11 w-full" type="submit">
            {BUTTON_TEXT[type]}
          </Button>
        </form>
      </Form>

      {type === "SIGN_IN" && (
        <>
          <p className="text-center text-sm">
            Ainda não tens conta?{" "}
            <Link
              className="font-medium text-brand hover:underline"
              href="/sign-up"
            >
              Cria uma aqui
            </Link>
          </p>

          <Link
            className="text-center text-sm text-muted-foreground hover:underline"
            href="/recover-password"
          >
            Esqueceu-se da palavra-passe?
          </Link>
        </>
      )}

      {type !== "SIGN_IN" && (
        <p className="text-center text-sm">
          Já tens conta?{" "}
          <Link
            className="font-medium text-brand hover:underline"
            href="/sign-in"
          >
            Iniciar sessão
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
