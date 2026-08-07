// Provisionamento de acesso a partir do pagamento (Kiwify → webhook).
// Pagou → cria empresa + usuário + convite por e-mail (define senha).
// Cancelou/atrasou → bloqueia o acesso.

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auditar } from "@/lib/audit";
import { enviarEmailBoasVindas } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://fesflow.com.br";

// Senha temporária legível (sem caracteres ambíguos: 0/O/1/l/I).
function gerarSenhaTemp(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(10);
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[bytes[i] % chars.length];
  return s;
}

// Provisiona o login com SENHA TEMPORÁRIA e envia o e-mail bonito de boas-vindas
// (SendGrid direto), marcando trocarSenha=true (força a troca no 1º acesso).
// Fallback: se o SendGrid falhar (sem SENDGRID_API_KEY), envia link de definição
// de senha pelo SMTP do Supabase — assim o cliente nunca fica sem acesso.
async function garantirAuthEEmail(
  usuarioId: string, empresaId: string, email: string, nome: string
): Promise<void> {
  const admin = supabaseAdmin();
  const senhaTemp = gerarSenhaTemp();

  // Cria o usuário com a senha temporária (e-mail já confirmado).
  let authUserId: string | null = null;
  const criado = await admin.auth.admin.createUser({ email, password: senhaTemp, email_confirm: true });
  if (criado.data?.user) {
    authUserId = criado.data.user.id;
  } else {
    // Já existe no Auth: recupera o id e redefine a senha temporária.
    const rec = await admin.auth.admin.generateLink({ type: "recovery", email });
    authUserId = rec.data?.user?.id ?? null;
    if (authUserId) await admin.auth.admin.updateUserById(authUserId, { password: senhaTemp });
  }
  if (!authUserId) {
    console.error("Não foi possível criar/achar o usuário Auth:", criado.error?.message);
    return;
  }

  await prisma.usuario.update({ where: { id: usuarioId }, data: { authUserId, trocarSenha: true } });
  try {
    // empresa_id em app_metadata: claim que o RLS usa (usuário não edita).
    await admin.auth.admin.updateUserById(authUserId, { app_metadata: { empresa_id: empresaId } });
  } catch (e) {
    console.error("updateUserById falhou:", (e as Error).message);
  }

  // E-mail bonito com a senha temporária (SendGrid direto).
  const enviado = await enviarEmailBoasVindas(email, nome, senhaTemp);
  if (!enviado) {
    // Sem SendGrid: cai para o link de definição de senha (SMTP do Supabase).
    console.error("Boas-vindas via SendGrid falhou (SENDGRID_API_KEY?) — fallback de link para", email);
    try {
      const anon = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await anon.auth.resetPasswordForEmail(email, { redirectTo: `${APP_URL}/definir-senha` });
    } catch (e) {
      console.error("Fallback de e-mail falhou:", (e as Error).message);
    }
  }
}

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
      // Já existe (renovação / reenvio) — reativa.
      await tx.usuario.updateMany({ where: { email }, data: { ativo: true } });
      await tx.empresa.update({
        where: { id: existente.empresaId },
        data: { statusAssinatura: "ativa" },
      });
      return {
        empresaId: existente.empresaId, novo: false,
        usuarioId: existente.id, temAuth: existente.authUserId != null,
      };
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
    return { empresaId: empresa.id, novo: true, usuarioId: usuario.id, temAuth: false };
  });

  // Cria o Auth + envia o e-mail (via SendGrid) sempre que o usuário ainda não
  // tem login — cobre cliente novo E o que ficou sem auth por falha anterior
  // (ex.: reenviar o webhook cura o cadastro).
  if (res.usuarioId && !res.temAuth) {
    try {
      await garantirAuthEEmail(res.usuarioId, res.empresaId, email, input.nome?.trim() ?? "");
    } catch (e) {
      console.error("Falha ao gerar acesso/enviar e-mail:", (e as Error).message);
    }
  }

  await auditar({
    empresaId: res.empresaId,
    entidade: "empresa",
    entidadeId: res.empresaId,
    acao: res.novo ? "provisionar_acesso" : "reativar_acesso",
    dados: { email, ciclo: input.ciclo ?? "" },
  });
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
  await auditar({
    empresaId: u.empresaId,
    usuarioId: u.id,
    entidade: "usuario",
    entidadeId: u.id,
    acao: "bloquear_acesso",
    dados: { email: e },
  });
}
