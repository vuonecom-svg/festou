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
  ready: boolean; // já implementado e funcional?
};

export type NavGroup = {
  titulo?: string;
  itens: NavItem[];
};

// Menu agrupado por área. `ready:false` = módulo planejado ("Em breve").
export const NAV_GROUPS: NavGroup[] = [
  {
    itens: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, ready: true },
      { href: "/agenda", label: "Agenda", icon: Calendar, ready: true },
    ],
  },
  {
    titulo: "Comercial",
    itens: [
      { href: "/orcamentos", label: "Orçamentos", icon: FileText, ready: true },
      { href: "/pedidos", label: "Locações", icon: ShoppingCart, ready: true },
      { href: "/clientes", label: "Clientes", icon: Users, ready: true },
      { href: "/crm", label: "CRM", icon: Filter, ready: false },
    ],
  },
  {
    titulo: "Catálogo",
    itens: [
      { href: "/brinquedos", label: "Brinquedos", icon: Package, ready: true },
      { href: "/combos", label: "Combos", icon: Boxes, ready: false },
    ],
  },
  {
    titulo: "Gestão",
    itens: [
      { href: "/relatorios", label: "Relatórios", icon: BarChart3, ready: true },
      { href: "/financeiro", label: "Financeiro", icon: Wallet, ready: false },
      { href: "/contratos", label: "Contratos", icon: FileSignature, ready: false },
      { href: "/configuracoes", label: "Configurações", icon: Settings, ready: false },
    ],
  },
  {
    titulo: "Operação de rua",
    itens: [
      { href: "/equipe", label: "Equipe", icon: HardHat, ready: false },
      { href: "/rotas", label: "Rotas", icon: Truck, ready: false },
      { href: "/manutencao", label: "Manutenção", icon: Wrench, ready: false },
    ],
  },
];

// Lista plana (usada, por ex., pela topbar para achar o título da rota atual).
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.itens);
