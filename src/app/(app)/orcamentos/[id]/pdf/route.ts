import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getOrcamento } from "@/lib/data/orcamentos";
import { getCliente } from "@/lib/data/clientes";
import { getEmpresa } from "@/lib/data/empresa";
import { OrcamentoDoc } from "@/lib/pdf/orcamento-doc";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orcamento = await getOrcamento(id);
  if (!orcamento) return new Response("Orçamento não encontrado", { status: 404 });

  const [cliente, empresa] = await Promise.all([
    getCliente(orcamento.clienteId),
    getEmpresa(),
  ]);

  // Cast: tipos do @react-pdf x React 19 divergem nominalmente (elemento é válido).
  const doc = createElement(OrcamentoDoc, { empresa, orcamento, cliente }) as Parameters<
    typeof renderToBuffer
  >[0];
  const buffer = await renderToBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="orcamento-${orcamento.numero}.pdf"`,
    },
  });
}
