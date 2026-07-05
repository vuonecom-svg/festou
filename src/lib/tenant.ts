import { prisma } from "./prisma";

// Empresa "atual". Até o login (Supabase Auth) existir, usamos a primeira
// empresa cadastrada. Depois, virá do JWT/sessão do usuário logado.
let cached: string | null = null;

export async function getCurrentEmpresaId(): Promise<string> {
  if (cached) return cached;
  const empresa = await prisma.empresa.findFirst({ orderBy: { criadoEm: "asc" } });
  if (!empresa) throw new Error("Nenhuma empresa cadastrada. Rode o seed.");
  cached = empresa.id;
  return cached;
}
