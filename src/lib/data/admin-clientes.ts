import "server-only";
import { prisma } from "@/lib/prisma";
import { dtISO } from "@/lib/utils";

export type ClienteAdmin = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  status: string;
  criadoEm: string;
  trialAte: string | null;
  ultimoAcesso: string | null;
  temLogin: boolean;
  usuarios: number;
  brinquedos: number;
  clientes: number;
  orcamentos: number;
  pedidos: number;
  faturamento: number;
};

async function contarPor(tabela: string): Promise<Map<string, number>> {
  const rows = await prisma.$queryRawUnsafe<{ empresa_id: string; n: number }[]>(
    `select empresa_id, count(*)::int as n from ${tabela} group by empresa_id`
  );
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.empresa_id, Number(r.n));
  return m;
}

export async function listarClientesAdmin(): Promise<ClienteAdmin[]> {
  const empresas = await prisma.empresa.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true, nome: true, telefone: true, email: true, cidade: true,
      statusAssinatura: true, criadoEm: true, trialAte: true,
      usuarios: { select: { nome: true, email: true, papel: true, authUserId: true } },
    },
  });

  const [brinq, cli, orc, ped] = await Promise.all([
    contarPor("brinquedo"), contarPor("cliente"), contarPor("orcamento"), contarPor("pedido"),
  ]);

  const fatRows = await prisma.$queryRawUnsafe<{ empresa_id: string; s: string }[]>(
    `select empresa_id, coalesce(sum(total),0)::text as s from pedido group by empresa_id`
  );
  const fatur = new Map<string, number>();
  for (const r of fatRows) fatur.set(r.empresa_id, Number(r.s));

  // Último acesso: max(last_sign_in_at) do Supabase Auth entre os usuários da empresa.
  const acesso = new Map<string, Date | null>();
  try {
    const rows = await prisma.$queryRawUnsafe<{ empresa_id: string; ultimo: Date | null }[]>(
      `select u.empresa_id, max(au.last_sign_in_at) as ultimo
       from usuario u join auth.users au on au.id::text = u.auth_user_id
       group by u.empresa_id`
    );
    for (const r of rows) acesso.set(r.empresa_id, r.ultimo);
  } catch {
    // sem acesso ao schema auth: segue sem "último acesso"
  }

  return empresas.map((e) => {
    const admin = e.usuarios.find((u) => u.papel === "admin") ?? e.usuarios[0];
    const ult = acesso.get(e.id) ?? null;
    return {
      id: e.id,
      nome: e.nome,
      email: admin?.email ?? e.email ?? "",
      telefone: e.telefone ?? "",
      cidade: e.cidade ?? "",
      status: e.statusAssinatura,
      criadoEm: e.criadoEm.toISOString(),
      trialAte: e.trialAte ? dtISO(e.trialAte) : null,
      ultimoAcesso: ult ? dtISO(ult) : null,
      temLogin: e.usuarios.some((u) => u.authUserId),
      usuarios: e.usuarios.length,
      brinquedos: brinq.get(e.id) ?? 0,
      clientes: cli.get(e.id) ?? 0,
      orcamentos: orc.get(e.id) ?? 0,
      pedidos: ped.get(e.id) ?? 0,
      faturamento: fatur.get(e.id) ?? 0,
    };
  });
}
