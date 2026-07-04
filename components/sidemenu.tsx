import Link from "next/link";
import { Session } from "next-auth";
import { ChevronUp, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/theme/theme-toggle";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { sideMenuConfig } from "./side-menu.config";
import { CartMenuItem } from "@/components/cart/cart-menu-item";

export type SideMenuVariant = keyof typeof sideMenuConfig;

type SideMenuProps = {
  session: Session | null;
  variant: SideMenuVariant;
};

export function SideMenu({ session, variant }: SideMenuProps) {
  const config = sideMenuConfig[variant];

  return (
    <Sidebar className={config.colorClass}>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex w-full items-center justify-between px-2">
            <SidebarGroupLabel>{config.label}</SidebarGroupLabel>
            <ModeToggle />
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {config.menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.title === "Carrinho" ? (
                    <CartMenuItem />
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {config.help.length > 0 && (
            <>
              <SidebarGroupLabel>Ajuda</SidebarGroupLabel>
              <SidebarMenu>
                {config.help.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {session && (
                    <span className="capitalize">{session.user?.name}</span>
                  )}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top">
                <DropdownMenuItem asChild>
                  <Link href="/discover/my-account">Conta</Link>
                </DropdownMenuItem>
                <SignOutButton variant="dropdown" />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
