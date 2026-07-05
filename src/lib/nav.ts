import {
  LayoutDashboard,
  Calendar,
  FileText,
  ShoppingCart,
  Users,
  Package,
  Boxes,
  HardHat,
  Truck,
  Wrench,
  Wallet,
  Filter,
  FileSignature,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  fase?: "mvp" | "v2" | "v3";
};

// Menu lateral do Festou (item 8 do planejamento).
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, fase: "mvp" },
  { href: "/agenda", label: "Agenda", icon: Calendar, fase: "mvp" },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText, fase: "mvp" },
  { href: "/pedidos", label: "Locações", icon: ShoppingCart, fase: "mvp" },
  { href: "/clientes", label: "Clientes", icon: Users, fase: "mvp" },
  { href: "/brinquedos", label: "Brinquedos", icon: Package, fase: "mvp" },
  { href: "/combos", label: "Combos", icon: Boxes, fase: "v2" },
  { href: "/equipe", label: "Equipe", icon: HardHat, fase: "v2" },
  { href: "/rotas", label: "Rotas", icon: Truck, fase: "v2" },
  { href: "/manutencao", label: "Manutenção", icon: Wrench, fase: "v2" },
  { href: "/financeiro", label: "Financeiro", icon: Wallet, fase: "mvp" },
  { href: "/crm", label: "CRM", icon: Filter, fase: "v2" },
  { href: "/contratos", label: "Contratos", icon: FileSignature, fase: "mvp" },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3, fase: "mvp" },
  { href: "/configuracoes", label: "Configurações", icon: Settings, fase: "mvp" },
];
