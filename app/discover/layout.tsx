import "@/app/globals.css";
import React, { ReactNode } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideMenu } from "@/components/sidemenu";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import Footer from "@/components/footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <SidebarProvider>
      <SideMenu session={session} variant="discover" />
      <main className="flex min-h-screen flex-1 flex-col bg-background">
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
        </div>
        <div className="flex-1 w-full p-5">{children}</div>
        <Footer />
      </main>
      <Toaster />
    </SidebarProvider>
  );
};

export default Layout;
