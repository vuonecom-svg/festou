// Provisionamento de acesso a partir do pagamento (Kiwify → webhook).
// Pagou → cria empresa + usuário + convite por e-mail (define senha).
// Cancelou/atrasou → bloqueia o acesso.

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://fesflow.com.br";

export async function provisionarAcesso(input: {
  email: string;
  nome?: string;
  ciclo?: string;
  gatewayRef?: string;
}): Promise<{ empresaId: string; novo: boolean }> {
  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error("E-mail ausente no webhook.");

  // Idempotência: a Kiwify REENVIA webhooks e pode entregar o mesmo evento em
  // paralelo. Um advisory lock por e-mail serializa o provisionamento, então
  // dois eventos simultâneos nunca criam duas empresas para o mesmo cliente.
  const res = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${email})::int8)`;

    const existente = await tx.usuario.findFirst({ where: { email } });
    if (existente) {
      // Já existe (renovação / reenvio) — apenas reativa.
      await tx.usuario.updateMany({ where: { email }, data: { ativo: true } });
      await tx.empresa.update({
        where: { id: existente.empresaId },
        data: { statusAssinatura: "ativa" },
      });
      return { empresaId: existente.empresaId, novo: false, usuarioId: null as string | null };
    }

    // Novo cliente: cria a empresa isolada dele + o usuário admin.
    const empresa = await tx.empresa.create({
      data: {
        nome: input.nome?.trim() || "Minha Locadora",
        statusAssinatura: "ativa",
        trialAte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    const usuario = await tx.usuario.create({
      data: {
        empresaId: empresa.id,
        authUserId: null,
        nome: input.nome?.trim() || "Responsável",
        email,
        papel: "admin",
        ativo: true,
      },
    });
    return { empresaId: empresa.id, novo: true, usuarioId: usuario.id };
  });

  // Convite por e-mail só para cliente NOVO — fora da transação (é chamada HTTP).
  if (res.novo && res.usuarioId) {
    try {
      const admin = supabaseAdmin();
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${APP_URL}/definir-senha`,
        data: { empresaId: res.empresaId, nome: input.nome ?? "", ciclo: input.ciclo ?? "" },
      });
      if (error) console.error("Supabase invite error:", error.message);
      const authUserId = data?.user?.id ?? null;
      if (authUserId) {
        await prisma.usuario.update({ where: { id: res.usuarioId }, data: { authUserId } });
        // empresa_id em app_metadata: é o claim que o RLS usa (usuário não edita).
        await admin.auth.admin.updateUserById(authUserId, {
          app_metadata: { empresa_id: res.empresaId },
        });
      }
    } catch (e) {
      console.error("Falha ao convidar usuário:", (e as Error).message);
    }
  }

  return { empresaId: res.empresaId, novo: res.novo };
}

export async function bloquearAcesso(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const u = await prisma.usuario.findFirst({ where: { email: e } });
  if (!u) return;
  await prisma.usuario.updateMany({ where: { email: e }, data: { ativo: false } });
  await prisma.empresa.update({
    where: { id: u.empresaId },
    data: { statusAssinatura: "cancelada" },
  });
}
