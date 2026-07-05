"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BRINQUEDO_STATUS } from "@/lib/status";
import { formatBRL } from "@/lib/utils";
import type { Brinquedo, BrinquedoStatus } from "@/lib/data/brinquedos";

const FILTROS: { value: BrinquedoStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "alugado", label: "Alugados" },
  { value: "manutencao", label: "Manutenção" },
  { value: "limpeza", label: "Limpeza" },
  { value: "inativo", label: "Inativos" },
];

export function BrinquedosGrid({ brinquedos }: { brinquedos: Brinquedo[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BrinquedoStatus | "todos">("todos");

  const filtrados = useMemo(() => {
    const termo = q.toLowerCase().trim();
    return brinquedos.filter((b) => {
      const okStatus = status === "todos" || b.status === status;
      const okBusca =
        !termo ||
        b.nome.toLowerCase().includes(termo) ||
        b.codigoInterno.toLowerCase().includes(termo) ||
        b.categoriaNome.toLowerCase().includes(termo);
      return okStatus && okBusca;
    });
  }, [brinquedos, q, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, código, categoria…"
            className="w-full h-10 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={
                "h-10 px-3 rounded-lg text-sm border transition-colors " +
                (status === f.value
                  ? "bg-primary text-primary-fg border-primary"
                  : "border-border bg-surface hover:bg-background text-foreground/70")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          Nenhum brinquedo encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((b) => {
            const st = BRINQUEDO_STATUS[b.status];
            return (
              <Link
                key={b.id}
                href={`/brinquedos/${b.id}`}
                className="card overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-soft to-background grid place-items-center relative">
                  {b.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.fotoUrl} alt={b.nome} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={40} className="text-primary/40" />
                  )}
                  <Badge className={"absolute top-2 right-2 " + st.badge}>{st.label}</Badge>
                </div>
                <div className="p-3.5">
                  <p className="font-medium leading-tight truncate group-hover:text-primary">{b.nome}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {b.codigoInterno}
                    {b.categoriaNome ? ` · ${b.categoriaNome}` : ""}
                  </p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-semibold">{formatBRL(b.valorDiaria)}</span>
                    <span className="text-xs text-muted">/ diária</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
