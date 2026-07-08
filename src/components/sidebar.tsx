"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-sidebar text-sidebar-fg">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
        <BrandMark size={34} />
        <div className="leading-tight">
          <p className="font-semibold text-white text-lg tracking-wide">FesFlow</p>
          <p className="text-[10px] text-sidebar-fg/60 uppercase tracking-wider">Locações de festa</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV_GROUPS.map((grupo, gi) => (
          <div key={gi} className="space-y-0.5">
            {grupo.titulo && (
              <p className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-fg/40">
                {grupo.titulo}
              </p>
            )}
            {grupo.itens.map((item) => {
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
                      : item.ready
                        ? "hover:bg-white/5 hover:text-white"
                        : "text-sidebar-fg/45 hover:bg-white/5"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {!item.ready && (
                    <span className="text-[9px] uppercase tracking-wide rounded-full bg-white/10 text-sidebar-fg/60 px-1.5 py-0.5">
                      em breve
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 text-[11px] text-sidebar-fg/50">
        FesFlow · v0.1
      </div>
    </aside>
  );
}
