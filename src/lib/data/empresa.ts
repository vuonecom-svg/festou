// Dados da empresa (locadora) — sobre Postgres. Usados no cabeçalho de
// orçamentos/contratos e editáveis em Configurações.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type Empresa = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  responsavel: string;
};

export async function getEmpresa(): Promise<Empresa> {
  const id = await getCurrentEmpresaId();
  const e = await prisma.empresa.findUnique({ where: { id } });
  return {
    nome: e?.nome ?? "Minha Locadora",
    cnpj: e?.cnpj ?? "",
    telefone: e?.telefone ?? "",
    email: e?.email ?? "",
    endereco: e?.endereco ?? "",
    cidade: e?.cidade ?? "",
    responsavel: e?.responsavel ?? "",
  };
}

export async function updateEmpresa(input: Partial<Empresa>): Promise<void> {
  const id = await getCurrentEmpresaId();
  await prisma.empresa.update({
    where: { id },
    data: {
      ...(input.nome !== undefined ? { nome: input.nome } : {}),
      cnpj: input.cnpj || null,
      telefone: input.telefone || null,
      email: input.email || null,
      endereco: input.endereco || null,
      cidade: input.cidade || null,
      responsavel: input.responsavel || null,
    },
  });
}
