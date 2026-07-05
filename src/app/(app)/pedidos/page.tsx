import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { listPedidos, pedidoStats, PEDIDO_FIN, PEDIDO_OP } from "@/lib/data/pedidos";
import { formatBRL } from "@/lib/utils";

export default async function PedidosPage() {
  const [pedidos, stats] = await Promise.all([listPedidos(), pedidoStats()]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Locações / Pedidos</h1>
        <p className="text-sm text-muted">
          {stats.total} pedidos · {formatBRL(stats.aReceber)} a receber · {formatBRL(stats.faturamento)} em locações
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3">
            <ShoppingCart size={26} />
          </span>
          <p className="font-medium">Nenhum pedido ainda</p>
          <p className="text-sm text-muted mt-1">
            Aprove um orçamento e clique em <strong>Converter em pedido</strong> — a reserva é criada aqui.
          </p>
          <div className="mt-4">
            <Link href="/orcamentos" className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-10 px-4 bg-primary text-primary-fg hover:bg-primary/90">
              Ir para Orçamentos
            </Link>
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
                  <th className="font-medium px-4 py-3">Financeiro</th>
                  <th className="font-medium px-4 py-3">Operação</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background/60">
                    <td className="px-4 py-3 tabular-nums">
                      <Link href={`/pedidos/${p.id}`} className="font-medium hover:text-primary">#{p.numero}</Link>
                    </td>
                    <td className="px-4 py-3">{p.clienteNome}</td>
                    <td className="px-4 py-3">
                      {p.dataEvento ? format(parseISO(p.dataEvento + "T00:00"), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(p.total)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatBRL(p.valorRestante)}</td>
                    <td className="px-4 py-3"><Badge className={PEDIDO_FIN[p.statusFinanceiro].badge}>{PEDIDO_FIN[p.statusFinanceiro].label}</Badge></td>
                    <td className="px-4 py-3"><Badge className={PEDIDO_OP[p.statusOperacional].badge}>{PEDIDO_OP[p.statusOperacional].label}</Badge></td>
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
