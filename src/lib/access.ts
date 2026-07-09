// Provisionamento de acesso a partir do pagamento (Kiwify → webhook).
// Pagou → cria empresa + usuário + convite por e-mail (define senha).
// Cancelou/atrasou → bloqueia o acesso.

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://festou-chi.vercel.app";

export async function provisionarAcesso(input: {
  email: string;
  nome?: string;
  ciclo?: string;
  gatewayRef?: string;
}): Promise<{ empresaId: string; novo: boolean }> {
  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error("E-mail ausente no webhook.");

  // Já existe? Apenas reativa (renovação / pagamento em dia).
  const existente = await prisma.usuario.findFirst({ where: { email } });
  if (existente) {
    await prisma.usuario.updateMany({ where: { email }, data: { ativo: true } });
    await prisma.empresa.update({
      where: { id: existente.empresaId },
      data: { statusAssinatura: "ativa" },
    });
    return { empresaId: existente.empresaId, novo: false };
  }

  // Novo cliente: cria a empresa isolada dele.
  const empresa = await prisma.empresa.create({
    data: {
      nome: input.nome?.trim() || "Minha Locadora",
      statusAssinatura: "ativa",
      trialAte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Convida o usuário no Supabase (cria conta + envia e-mail para definir senha).
  let authUserId: string | null = null;
  try {
    const admin = supabaseAdmin();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${APP_URL}/definir-senha`,
      data: { empresaId: empresa.id, nome: input.nome ?? "", ciclo: input.ciclo ?? "" },
    });
    if (error) console.error("Supabase invite error:", error.message);
    authUserId = data?.user?.id ?? null;
  } catch (e) {
    console.error("Falha ao convidar usuário:", (e as Error).message);
  }

  await prisma.usuario.create({
    data: {
      empresaId: empresa.id,
      authUserId,
      nome: input.nome?.trim() || "Responsável",
      email,
      papel: "admin",
      ativo: true,
    },
  });

  return { empresaId: empresa.id, novo: true };
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
