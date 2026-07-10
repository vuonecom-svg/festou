"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { MobileNav } from "@/components/mobile-nav";

export function Topbar() {
  const pathname = usePathname();
  const title =
    NAV_ITEMS.find(
      (i) => pathname === i.href || pathname.startsWith(i.href + "/")
    )?.label ?? "FesFlow";

  return (
    <header className="h-16 shrink-0 bg-surface border-b border-border flex items-center gap-3 px-4 md:px-6">
      <MobileNav />

      <h1 className="font-semibold text-lg">{title}</h1>

      <div className="ml-auto h-9 w-9 rounded-full bg-primary-soft text-primary grid place-items-center text-sm font-semibold">
        F
      </div>
    </header>
  );
}
