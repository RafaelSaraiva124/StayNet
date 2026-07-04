import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Footer from "@/components/footer"

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (session) redirect("/discover");
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={"/logo.png"} alt={"logo"} width={125} height={125} />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-700 hover:text-[var(--brand2)] transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#aboutus"
                className="text-gray-700 hover:text-[var(--brand2)] transition-colors"
              >
                Sobre Nós
              </a>
              <a
                href="#partners"
                className="text-gray-700 hover:text-[var(--brand2)] transition-colors"
              >
                Parceiros
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <button className="hidden sm:block px-4 py-2 text-gray-700 hover:text-[var(--brand2)] transition-colors">
                  Entrar
                </button>
              </Link>
              <Link href="/sign-up" passHref>
                <button className="px-4 py-2 bg-[var(--brand2)] text-white rounded-lg hover:bg-[var(--brandhover2)] transition-colors font-medium">
                  Começar{" "}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;
