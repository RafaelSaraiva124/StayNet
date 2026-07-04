import {
  Calendar,
  Home,
  HeartPlus,
  Info,
  HeartHandshake,
  LayoutDashboard,
  Building2,
  FileText,
  ShoppingCart,
} from "lucide-react";

export const sideMenuConfig = {
  discover: {
    label: "StayNet",
    colorClass: "bg-background",
    menu: [
      { title: "Início", url: "/discover", icon: Home },
      { title: "Carrinho", url: "/cart", icon: ShoppingCart },
      { title: "Minhas Reservas", url: "/discover/bookings", icon: Calendar },
      { title: "Favoritos", url: "/discover/favorites", icon: HeartPlus },
      {
        title: "Torne-se Parceiro",
        url: "/discover/partner",
        icon: HeartHandshake,
      },
    ],
    help: [{ title: "Quem nós somos", url: "/discover/about", icon: Info }],
  },

  controlpanel: {
    label: "Painel de Parceiros",
    colorClass: "text-blue-400",
    menu: [
      { title: "Visão Geral", url: "/controlpanel", icon: LayoutDashboard },
      {
        title: "Adicionar Hotel",
        url: "/controlpanel/create-hotel",
        icon: Building2,
      },
      { title: "Hoteis", url: "/controlpanel/hotel-list", icon: FileText },
      {
        title: "Reservas",
        url: "/controlpanel/hotel-bookings",
        icon: Calendar,
      },
      { title: "Hóspedes", url: "/controlpanel/guest-list", icon: FileText },
      {
        title: "Check-in/out",
        url: "/controlpanel/check-in-out",
        icon: FileText,
      },
    ],
    help: [],
  },
  dashboard: {
    label: "Painel de Administrador",
    colorClass: "text-blue-400",
    menu: [
      { title: "Visão Geral", url: "/dashboard", icon: LayoutDashboard },
      {
        title: "Parceiros",
        url: "/dashboard/partners",
        icon: HeartHandshake,
      },
      {
        title: "Hoteis",
        url: "/dashboard/hoteis",
        icon: Building2,
      },
    ],
    help: [],
  },
} as const;
