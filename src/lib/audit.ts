// Trilha de auditoria (best-effort): grava quem fez o quê. NUNCA quebra a ação
// principal se a gravação falhar (log é secundário).
import { prisma } from "./prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function auditar(input: {
  empresaId: string;
  usuarioId?: string | null;
  entidade: string;
  entidadeId: string;
  acao: string;
  dados?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        empresaId: input.empresaId,
        usuarioId: input.usuarioId ?? null,
        entidade: input.entidade,
        entidadeId: input.entidadeId,
        acao: input.acao,
        dadosDepois: input.dados,
      },
    });
  } catch (e) {
    console.error("auditar falhou:", (e as Error).message);
  }
}
