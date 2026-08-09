"use client";

import { createContext, useContext } from "react";
import { getNicho, termosDo, type Termos } from "@/lib/nichos";

const TermosCtx = createContext<Termos>(termosDo(undefined));

// Provê o vocabulário do ramo para toda a árvore de componentes de tela.
export function NichoProvider({
  nichoKey,
  children,
}: {
  nichoKey?: string | null;
  children: React.ReactNode;
}) {
  return <TermosCtx.Provider value={termosDo(getNicho(nichoKey))}>{children}</TermosCtx.Provider>;
}

export function useTermos(): Termos {
  return useContext(TermosCtx);
}

// Helpers de capitalização (item singular).
export function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
