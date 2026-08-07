// Controle de acesso por papel. Mínimo e conservador: só distingue quem PODE
// GERIR (admin/gerente) de quem não pode, usado para gate de ações destrutivas.
// Toda empresa tem ao menos um admin (garantido no provisionamento + backfill).
import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase/server";
import { authAtivo } from "./auth-flag";

export type Papel = "admin" | "gerente" | "atendente" | "financeiro" | "equipe" | "vendedor";

export async function papelAtual(): Promise<Papel> {
  if (!authAtivo()) return "admin"; // modo demo (dev): sem restrição
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return "atendente";
  const email = user.email?.toLowerCase();
  let u = await prisma.usuario.findFirst({ where: { authUserId: user.id }, select: { papel: true } });
  if (!u && email) u = await prisma.usuario.findFirst({ where: { email }, select: { papel: true } });
  return (u?.papel as Papel) ?? "atendente";
}

// Pode gerir = executar ações destrutivas/administrativas (excluir, etc.).
export async function podeGerir(): Promise<boolean> {
  const p = await papelAtual();
  return p === "admin" || p === "gerente";
}

// Id do usuário logado (para trilha de auditoria). Null em modo demo/sem sessão.
export async function usuarioAtualId(): Promise<string | null> {
  if (!authAtivo()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const email = user.email?.toLowerCase();
  let u = await prisma.usuario.findFirst({ where: { authUserId: user.id }, select: { id: true } });
  if (!u && email) u = await prisma.usuario.findFirst({ where: { email }, select: { id: true } });
  return u?.id ?? null;
}
