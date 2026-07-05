import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listOrcamentos, orcamentoStats, ORC_STATUS } from "@/lib/data/orcamentos";
import { formatBRL } from "@/lib/utils";

export default async function OrcamentosPage() {
  const [orcamentos, stats] = await Promise.all([listOrcamentos(), orcamentoStats()]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Orçamentos</h1>
          <p className="text-sm text-muted">
            {stats.total} no total · {stats.abertos} abertos · {stats.convertidos} convertidos
          </p>
        </div>
        <ButtonLink href="/orcamentos/novo">
          <Plus size={18} /> Novo orçamento
        </ButtonLink>
      </div>

      {orcamentos.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3">
            <FileText size={26} />
          </span>
          <p className="font-medium">Nenhum orçamento ainda</p>
          <p className="text-sm text-muted mt-1">Crie o primeiro e veja a disponibilidade dos brinquedos ao vivo.</p>
          <div className="mt-4">
            <ButtonLink href="/orcamentos/novo"><Plus size={18} /> Novo orçamento</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium px-4 py-3">Nº</th>
                  <th className="font-medium px-4 py-3">Cliente</th>
                  <th className="font-medium px-4 py-3">Evento</th>
                  <th className="font-medium px-4 py-3 text-right">Total</th>
                  <th className="font-medium px-4 py-3 text-right">Restante</th>
                  <th className="font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-background/60">
                    <td className="px-4 py-3 tabular-nums">
                      <Link href={`/orcamentos/${o.id}`} className="font-medium hover:text-primary">#{o.numero}</Link>
                    </td>
                    <td className="px-4 py-3">{o.clienteNome}</td>
                    <td className="px-4 py-3">
                      {o.dataEvento ? format(parseISO(o.dataEvento + "T00:00"), "dd/MM/yyyy") : "—"}
                      {o.horaEntrega ? ` · ${o.horaEntrega}` : ""}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(o.total)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatBRL(o.valorRestante)}</td>
                    <td className="px-4 py-3"><Badge className={ORC_STATUS[o.status].badge}>{ORC_STATUS[o.status].label}</Badge></td>
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
