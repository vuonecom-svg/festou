// Equipe — funcionários e veículos. Sobre Postgres, por empresa.
import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type FuncionarioFuncao = "montador" | "motorista" | "ajudante";
export const FUNCAO: Record<FuncionarioFuncao, string> = {
  montador: "Montador",
  motorista: "Motorista",
  ajudante: "Ajudante",
};

export type Funcionario = { id: string; nome: string; funcao: FuncionarioFuncao; telefone: string; ativo: boolean };
export type Veiculo = { id: string; placa: string; modelo: string; capacidade: string; ativo: boolean };

export async function listFuncionarios(): Promise<Funcionario[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.funcionario.findMany({ where: { empresaId }, orderBy: { nome: "asc" } });
  return rows.map((f) => ({ id: f.id, nome: f.nome, funcao: f.funcao as FuncionarioFuncao, telefone: f.telefone ?? "", ativo: f.ativo }));
}

export async function createFuncionario(input: { nome: string; funcao: FuncionarioFuncao; telefone: string }): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  if (!input.nome) return;
  await prisma.funcionario.create({ data: { empresaId, nome: input.nome, funcao: input.funcao, telefone: input.telefone || null } });
}

export async function deleteFuncionario(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.funcionario.deleteMany({ where: { id, empresaId } });
}

export async function listVeiculos(): Promise<Veiculo[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.veiculo.findMany({ where: { empresaId }, orderBy: { modelo: "asc" } });
  return rows.map((v) => ({ id: v.id, placa: v.placa ?? "", modelo: v.modelo ?? "", capacidade: v.capacidade ?? "", ativo: v.ativo }));
}

export async function createVeiculo(input: { placa: string; modelo: string; capacidade: string }): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  if (!input.modelo && !input.placa) return;
  await prisma.veiculo.create({ data: { empresaId, placa: input.placa || null, modelo: input.modelo || null, capacidade: input.capacidade || null } });
}

export async function deleteVeiculo(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.veiculo.deleteMany({ where: { id, empresaId } });
}
