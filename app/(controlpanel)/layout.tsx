import "@/app/globals.css";
import React, { ReactNode } from "react";
import { auth } from "@/auth";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideMenu } from "@/components/sidemenu";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <SidebarProvider>
      <SideMenu session={session} variant="controlpanel" />
      <main className="flex min-h-screen flex-1 flex-col bg-background">
        <div>
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger />
          </div>
          <div className="flex-1 h-full w-full p-10">{children}</div>
          <Footer />
        </div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
};

export default Layout;
