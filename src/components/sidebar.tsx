"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-sidebar text-sidebar-fg">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary text-primary-fg">
          <PartyPopper size={20} />
        </span>
        <div className="leading-tight">
          <p className="font-semibold text-white text-lg">Festou</p>
          <p className="text-[11px] text-sidebar-fg/70">Gestão de locação</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-active text-white font-medium"
                  : "hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.fase && item.fase !== "mvp" && (
                <span className="text-[9px] uppercase tracking-wide text-sidebar-fg/40">
                  {item.fase}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 text-[11px] text-sidebar-fg/50">
        Festou · MVP v0.1
      </div>
    </aside>
  );
}
