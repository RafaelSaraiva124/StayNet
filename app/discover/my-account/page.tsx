import React from "react";
import { User2 } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/auth";
import Link from "next/link";

const Page = async () => {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-full max-w-xl rounded-3xl border bg-background p-10 shadow-xl text-center bg-muted/40">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <User2 className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-semibold tracking-tight">
          A minha conta
        </h1>

        <p className="mb-8 text-sm text-muted-foreground">
          Gerir sessão e informações da conta
        </p>

        <div className="mb-10 flex flex-col items-center gap-2">
          <p className="text-lg font-medium capitalize text-foreground">
            {session?.user?.name}
          </p>

          <Link
            href="/recover-password"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Alterar palavra-passe
          </Link>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Page;
