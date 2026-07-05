import Link from "next/link";
import { format, parseISO } from "date-fns";
import { FileSignature, FileText, FileDown } from "lucide-react";
import { listPedidos } from "@/lib/data/pedidos";
import { formatBRL } from "@/lib/utils";

export default async function ContratosPage() {
  const pedidos = await listPedidos();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Contratos e documentos</h1>
        <p className="text-sm text-muted">
          Gere o contrato de locação e o orçamento em PDF de cada pedido, prontos para enviar ao cliente.
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3">
            <FileSignature size={26} />
          </span>
          <p className="font-medium">Nenhum contrato ainda</p>
          <p className="text-sm text-muted mt-1">
            Confirme um orçamento em pedido para gerar o contrato de locação.
          </p>
          <Link href="/orcamentos" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-primary-fg font-medium hover:bg-primary/90">
            Ir para Orçamentos
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium px-4 py-3">Pedido</th>
                  <th className="font-medium px-4 py-3">Cliente</th>
                  <th className="font-medium px-4 py-3">Evento</th>
                  <th className="font-medium px-4 py-3 text-right">Valor</th>
                  <th className="font-medium px-4 py-3 text-right">Documentos</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background/60">
                    <td className="px-4 py-3">
                      <Link href={`/pedidos/${p.id}`} className="font-medium hover:text-primary">#{p.numero}</Link>
                    </td>
                    <td className="px-4 py-3">{p.clienteNome}</td>
                    <td className="px-4 py-3 text-muted">
                      {p.dataEvento ? format(parseISO(p.dataEvento + "T00:00"), "dd/MM/yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatBRL(p.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/pedidos/${p.id}/contrato`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 h-8 text-xs font-medium hover:bg-background">
                          <FileSignature size={14} /> Contrato
                        </a>
                        {p.orcamentoId && (
                          <a href={`/orcamentos/${p.orcamentoId}/pdf`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 h-8 text-xs font-medium hover:bg-background">
                            <FileText size={14} /> Orçamento
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted flex items-center gap-1.5">
        <FileDown size={13} /> Dica: você também gera esses PDFs direto na tela de cada pedido.
      </p>
    </div>
  );
}
