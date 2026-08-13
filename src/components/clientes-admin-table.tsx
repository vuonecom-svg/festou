"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpDown, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatBRL } from "@/lib/utils";
import type { ClienteAdmin } from "@/lib/data/admin-clientes";

type Ordenar = "acesso" | "faturamento" | "pedidos" | "criado" | "nome";

const STATUS: Record<string, { label: string; cls: string }> = {
  ativa: { label: "Ativa", cls: "bg-emerald-100 text-emerald-700" },
  trial: { label: "Trial", cls: "bg-sky-100 text-sky-700" },
  inadimplente: { label: "Inadimplente", cls: "bg-amber-100 text-amber-700" },
  cancelada: { label: "Cancelada", cls: "bg-rose-100 text-rose-700" },
};

function quando(iso: string | null): { txt: string; frio: boolean } {
  if (!iso) return { txt: "nunca acessou", frio: true };
  const d = parseISO(iso);
  const dias = (Date.now() - d.getTime()) / 86400000;
  return { txt: "há " + formatDistanceToNow(d, { locale: ptBR }), frio: dias > 14 };
}

export function ClientesAdminTable({ clientes }: { clientes: ClienteAdmin[] }) {
  const [q, setQ] = useState("");
  const [ord, setOrd] = useState<Ordenar>("acesso");

  const lista = useMemo(() => {
    const termo = q.toLowerCase().trim();
    const filtrados = clientes.filter(
      (c) =>
        !termo ||
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.cidade.toLowerCase().includes(termo) ||
        c.telefone.includes(termo)
    );
    const val = (c: ClienteAdmin): number => {
      if (ord === "faturamento") return c.faturamento;
      if (ord === "pedidos") return c.pedidos;
      if (ord === "criado") return new Date(c.criadoEm).getTime();
      if (ord === "acesso") return c.ultimoAcesso ? new Date(c.ultimoAcesso).getTime() : 0;
      return 0;
    };
    if (ord === "nome") return [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome));
    return [...filtrados].sort((a, b) => val(b) - val(a));
  }, [clientes, q, ord]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, e-mail, cidade ou telefone…"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <ArrowUpDown size={14} className="text-muted" />
          <select value={ord} onChange={(e) => setOrd(e.target.value as Ordenar)} className="h-10 rounded-lg border border-border bg-surface px-2 text-sm">
            <option value="acesso">Último acesso</option>
            <option value="faturamento">Faturamento</option>
            <option value="pedidos">Nº de locações</option>
            <option value="criado">Mais recentes</option>
            <option value="nome">Nome (A–Z)</option>
          </select>
        </div>
        <span className="text-sm text-muted">{lista.length} cliente(s)</span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="font-medium px-4 py-2.5">Cliente</th>
              <th className="font-medium px-4 py-2.5">Contato</th>
              <th className="font-medium px-4 py-2.5">Status</th>
              <th className="font-medium px-4 py-2.5">Último acesso</th>
              <th className="font-medium px-4 py-2.5 text-center">Atividade</th>
              <th className="font-medium px-4 py-2.5 text-right">Faturamento</th>
              <th className="font-medium px-4 py-2.5">Desde</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((c) => {
              const st = STATUS[c.status] ?? { label: c.status, cls: "bg-slate-100 text-slate-700" };
              const acc = quando(c.ultimoAcesso);
              const wa = c.telefone.replace(/\D/g, "");
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.nome}</p>
                    <p className="text-xs text-muted">{c.cidade || "—"}{!c.temLogin && <span className="ml-1 text-amber-600">· sem login</span>}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{c.email || "—"}</p>
                    {c.telefone ? (
                      <a href={`https://wa.me/55${wa}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1">
                        {c.telefone} <ExternalLink size={11} />
                      </a>
                    ) : <span className="text-xs text-muted">sem telefone</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={"text-xs font-medium px-2 py-0.5 rounded-full " + st.cls}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={"text-xs " + (acc.frio ? "text-rose-600" : "text-foreground/80")}>{acc.txt}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-muted">
                    {c.brinquedos} itens · {c.clientes} cli · <strong className="text-foreground">{c.pedidos}</strong> loc · {c.orcamentos} orç
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatBRL(c.faturamento)}</td>
                  <td className="px-4 py-3 text-xs text-muted">{format(parseISO(c.criadoEm), "dd/MM/yy")}</td>
                </tr>
              );
            })}
            {lista.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
