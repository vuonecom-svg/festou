import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { getEmpresa } from "@/lib/data/empresa";
import { programacaoPeriodo } from "@/lib/data/programacao";
import { ProgramacaoDoc } from "@/lib/pdf/programacao-doc";

export const runtime = "nodejs";

const DIA_RE = /^\d{4}-\d{2}-\d{2}$/;

function diaValido(s: string): boolean {
  if (!DIA_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  const ano = d.getUTCFullYear();
  return !isNaN(d.getTime()) && ano >= 1990 && ano <= 2100;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const de = url.searchParams.get("de") ?? "";
  const ate = url.searchParams.get("ate") ?? de;

  if (!diaValido(de) || !diaValido(ate) || ate < de) {
    return new Response("Período inválido. Use ?de=AAAA-MM-DD&ate=AAAA-MM-DD.", { status: 400 });
  }
  // Teto de 92 dias — relatório operacional, não histórico.
  const dias = (new Date(ate + "T00:00:00Z").getTime() - new Date(de + "T00:00:00Z").getTime()) / 86_400_000;
  if (dias > 92) return new Response("Período máximo: 92 dias.", { status: 400 });

  const [empresa, prog] = await Promise.all([getEmpresa(), programacaoPeriodo(de, ate)]);

  const doc = createElement(ProgramacaoDoc, { empresa, prog }) as Parameters<typeof renderToBuffer>[0];
  const buffer = await renderToBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="programacao-${de}-a-${ate}.pdf"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
