"use client";

import { Search, Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const title =
    NAV_ITEMS.find(
      (i) => pathname === i.href || pathname.startsWith(i.href + "/")
    )?.label ?? "Festou";

  return (
    <header className="h-16 shrink-0 bg-surface border-b border-border flex items-center gap-4 px-4 md:px-6">
      <button className="md:hidden text-muted" aria-label="Menu">
        <Menu size={22} />
      </button>

      <h1 className="font-semibold text-lg hidden sm:block">{title}</h1>

      <div className="flex-1 max-w-md ml-auto md:ml-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            placeholder="Buscar cliente, pedido, brinquedo…"
            className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <button className="relative text-muted hover:text-foreground" aria-label="Notificações">
        <Bell size={20} />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-fg text-[10px] grid place-items-center">
          3
        </span>
      </button>

      <div className="h-9 w-9 rounded-full bg-primary-soft text-primary grid place-items-center text-sm font-semibold">
        F
      </div>
    </header>
  );
}
