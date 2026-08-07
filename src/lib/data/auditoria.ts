import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type LinhaAuditoria = {
  id: string;
  acao: string;
  usuarioNome: string;
  dados: string;
  criadoEm: string;
};

export const ACAO_LABEL: Record<string, string> = {
  provisionar_acesso: "Acesso provisionado",
  reativar_acesso: "Acesso reativado",
  bloquear_acesso: "Acesso bloqueado",
  registrar_pagamento: "Pagamento registrado",
  excluir_pedido: "Locação excluída",
  excluir_orcamento: "Orçamento excluído",
  excluir_brinquedo: "Brinquedo excluído",
};

export async function listAuditoria(): Promise<LinhaAuditoria[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.auditLog.findMany({
    where: { empresaId },
    include: { usuario: { select: { nome: true } } },
    orderBy: { criadoEm: "desc" },
    take: 100,
  });
  return rows.map((r) => ({
    id: r.id,
    acao: r.acao,
    usuarioNome: r.usuario?.nome ?? "Sistema",
    dados: r.dadosDepois ? JSON.stringify(r.dadosDepois) : "",
    criadoEm: r.criadoEm.toISOString(),
  }));
}
