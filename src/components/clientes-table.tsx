"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MessageCircle, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { CLIENTE_TAGS, type ClienteTag } from "@/lib/clientes-shared";
import type { Cliente } from "@/lib/data/clientes";

const FILTROS: { value: ClienteTag | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "recorrente", label: "Recorrentes" },
  { value: "escola", label: "Escolas" },
  { value: "condominio", label: "Condomínios" },
  { value: "empresa", label: "Empresas" },
  { value: "particular", label: "Particulares" },
];

export function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<ClienteTag | "todos">("todos");

  const filtrados = useMemo(() => {
    const termo = q.toLowerCase().trim();
    return clientes.filter((c) => {
      const okTag = tag === "todos" || c.tags.includes(tag);
      const okBusca =
        !termo ||
        c.nome.toLowerCase().includes(termo) ||
        c.doc.toLowerCase().includes(termo) ||
        c.telefone.includes(termo) ||
        c.whatsapp.includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.cidade.toLowerCase().includes(termo);
      return okTag && okBusca;
    });
  }, [clientes, q, tag]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, documento, telefone, cidade…"
            className="w-full h-10 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTag(f.value)}
              className={
                "h-10 px-3 rounded-lg text-sm border transition-colors " +
                (tag === f.value
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
          Nenhum cliente encontrado com esses filtros.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium px-4 py-3">Cliente</th>
                  <th className="font-medium px-4 py-3">Contato</th>
                  <th className="font-medium px-4 py-3">Cidade</th>
                  <th className="font-medium px-4 py-3">Tags</th>
                  <th className="font-medium px-4 py-3 text-right">Eventos</th>
                  <th className="font-medium px-4 py-3 text-right">Total gasto</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background/60">
                    <td className="px-4 py-3">
                      <Link href={`/clientes/${c.id}`} className="font-medium hover:text-primary">
                        {c.nome}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        {c.doc && <span>{c.doc}</span>}
                        {c.avaliacao != null && (
                          <span className="inline-flex items-center gap-0.5 text-amber-500">
                            <Star size={12} className="fill-amber-400 stroke-amber-400" />
                            {c.avaliacao}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span>{c.telefone || "—"}</span>
                        {c.whatsapp && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <MessageCircle size={12} /> {c.whatsapp}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {c.cidade ? (
                        <span className="inline-flex items-center gap-1 text-foreground/80">
                          <MapPin size={13} className="text-muted" /> {c.cidade}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.length === 0 && <span className="text-muted">—</span>}
                        {c.tags.map((t) => (
                          <Badge key={t} className={CLIENTE_TAGS[t].badge}>
                            {CLIENTE_TAGS[t].label}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.qtdEventos}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatBRL(c.totalGasto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
