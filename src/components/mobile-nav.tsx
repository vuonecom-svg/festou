"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { NAV_GROUPS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { sairAction } from "@/app/entrar/actions";

// Navegação mobile: hambúrguer + drawer lateral (a sidebar fixa é hidden md:flex).
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fecha ao trocar de rota.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        className="md:hidden text-muted -ml-1 p-1"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-sidebar text-sidebar-fg flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <BrandMark size={30} />
                <span className="font-semibold text-white text-lg tracking-wide">FesFlow</span>
              </Link>
              <button aria-label="Fechar" onClick={() => setOpen(false)} className="text-sidebar-fg/70 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {NAV_GROUPS.map((grupo, gi) => (
                <div key={gi} className="space-y-0.5">
                  {grupo.titulo && (
                    <p className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-fg/40">
                      {grupo.titulo}
                    </p>
                  )}
                  {grupo.itens.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
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

            <div className="px-3 py-3 border-t border-white/10">
              <form action={sairAction}>
                <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-fg/70 hover:bg-white/5 hover:text-white transition-colors">
                  <LogOut size={18} /> Sair
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
