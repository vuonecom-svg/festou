import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getPedido } from "@/lib/data/pedidos";
import { getOrcamento } from "@/lib/data/orcamentos";
import { getCliente } from "@/lib/data/clientes";
import { getEmpresa } from "@/lib/data/empresa";
import { ReciboDoc } from "@/lib/pdf/recibo-doc";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pedido = await getPedido(id);
  if (!pedido) return new Response("Pedido não encontrado", { status: 404 });

  const orcamento = pedido.orcamentoId ? await getOrcamento(pedido.orcamentoId) : null;
  const [cliente, empresa] = await Promise.all([
    orcamento ? getCliente(orcamento.clienteId) : Promise.resolve(null),
    getEmpresa(),
  ]);

  const doc = createElement(ReciboDoc, {
    empresa, pedido, cliente, dataEventoISO: pedido.dataEvento,
  }) as Parameters<typeof renderToBuffer>[0];
  const buffer = await renderToBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="recibo-${pedido.numero}.pdf"`,
    },
  });
}
