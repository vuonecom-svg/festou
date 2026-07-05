// Camada de dados de Brinquedos — agora sobre o Postgres (Prisma/Supabase),
// escopada por empresa. Os tipos e assinaturas são os mesmos da versão mock,
// então nenhuma tela/action precisou mudar.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";

export type BrinquedoStatus =
  | "disponivel"
  | "alugado"
  | "manutencao"
  | "limpeza"
  | "inativo";

export type Brinquedo = {
  id: string;
  nome: string;
  codigoInterno: string;
  categoriaNome: string;
  descricao: string;
  fotoUrl: string;
  medidas: string;
  pesoKg: number | null;
  capacidadeCriancas: number | null;
  idadeMin: number | null;
  idadeMax: number | null;
  valorDiaria: number;
  valorPeriodo: number | null;
  valorHoraExtra: number | null;
  valorPromocional: number | null;
  status: BrinquedoStatus;
  precisaEnergia: boolean;
  precisaAgua: boolean;
  qtdMotores: number;
  pisoIrregular: boolean;
  localAberto: boolean;
  localCoberto: boolean;
  tempoMontagemMin: number;
  tempoDesmontagemMin: number;
  tempoLimpezaMin: number;
  custoManutMedio: number | null;
  obsInternas: string;
  ativo: boolean;
  criadoEm: string;
};

export type BrinquedoInput = Omit<Brinquedo, "id" | "criadoEm">;

const include = {
  categoria: true,
  fotos: { orderBy: { ordem: "asc" as const }, take: 1 },
} satisfies Prisma.BrinquedoInclude;

type BrinquedoRow = Prisma.BrinquedoGetPayload<{ include: typeof include }>;

const dec = (v: Prisma.Decimal | null) => (v == null ? null : Number(v));

function toDTO(b: BrinquedoRow): Brinquedo {
  return {
    id: b.id,
    nome: b.nome,
    codigoInterno: b.codigoInterno ?? "",
    categoriaNome: b.categoria?.nome ?? "",
    descricao: b.descricao ?? "",
    fotoUrl: b.fotos[0]?.url ?? "",
    medidas: b.medidas ?? "",
    pesoKg: dec(b.pesoKg),
    capacidadeCriancas: b.capacidadeCriancas,
    idadeMin: b.idadeMin,
    idadeMax: b.idadeMax,
    valorDiaria: Number(b.valorDiaria),
    valorPeriodo: dec(b.valorPeriodo),
    valorHoraExtra: dec(b.valorHoraExtra),
    valorPromocional: dec(b.valorPromocional),
    status: b.status as BrinquedoStatus,
    precisaEnergia: b.precisaEnergia,
    precisaAgua: b.precisaAgua,
    qtdMotores: b.qtdMotores,
    pisoIrregular: b.pisoIrregular,
    localAberto: b.localAberto,
    localCoberto: b.localCoberto,
    tempoMontagemMin: b.tempoMontagemMin,
    tempoDesmontagemMin: b.tempoDesmontagemMin,
    tempoLimpezaMin: b.tempoLimpezaMin,
    custoManutMedio: dec(b.custoManutMedio),
    obsInternas: b.obsInternas ?? "",
    ativo: b.ativo,
    criadoEm: b.criadoEm.toISOString(),
  };
}

// Resolve (encontra ou cria) a categoria pelo nome, no escopo da empresa.
async function resolveCategoriaId(empresaId: string, nome: string): Promise<string | null> {
  const limpo = nome.trim();
  if (!limpo) return null;
  const existente = await prisma.categoria.findFirst({ where: { empresaId, nome: limpo } });
  if (existente) return existente.id;
  const nova = await prisma.categoria.create({ data: { empresaId, nome: limpo } });
  return nova.id;
}

function dadosBrinquedo(input: BrinquedoInput) {
  return {
    nome: input.nome,
    descricao: input.descricao || null,
    medidas: input.medidas || null,
    pesoKg: input.pesoKg,
    capacidadeCriancas: input.capacidadeCriancas,
    idadeMin: input.idadeMin,
    idadeMax: input.idadeMax,
    valorDiaria: input.valorDiaria,
    valorPeriodo: input.valorPeriodo,
    valorHoraExtra: input.valorHoraExtra,
    valorPromocional: input.valorPromocional,
    status: input.status,
    precisaEnergia: input.precisaEnergia,
    precisaAgua: input.precisaAgua,
    qtdMotores: input.qtdMotores,
    pisoIrregular: input.pisoIrregular,
    localAberto: input.localAberto,
    localCoberto: input.localCoberto,
    tempoMontagemMin: input.tempoMontagemMin,
    tempoDesmontagemMin: input.tempoDesmontagemMin,
    tempoLimpezaMin: input.tempoLimpezaMin,
    custoManutMedio: input.custoManutMedio,
    obsInternas: input.obsInternas || null,
    ativo: input.ativo,
  };
}

async function proximoCodigo(empresaId: string): Promise<string> {
  const n = (await prisma.brinquedo.count({ where: { empresaId } })) + 1;
  return `BR-${String(n).padStart(3, "0")}`;
}

async function sincronizaFoto(brinquedoId: string, fotoUrl: string) {
  await prisma.brinquedoFoto.deleteMany({ where: { brinquedoId } });
  if (fotoUrl.trim()) {
    await prisma.brinquedoFoto.create({ data: { brinquedoId, url: fotoUrl.trim(), ordem: 0 } });
  }
}

export async function listBrinquedos(): Promise<Brinquedo[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.brinquedo.findMany({
    where: { empresaId },
    include,
    orderBy: { nome: "asc" },
  });
  return rows.map(toDTO);
}

export async function getBrinquedo(id: string): Promise<Brinquedo | null> {
  const empresaId = await getCurrentEmpresaId();
  const row = await prisma.brinquedo.findFirst({ where: { id, empresaId }, include });
  return row ? toDTO(row) : null;
}

export async function createBrinquedo(input: BrinquedoInput): Promise<Brinquedo> {
  const empresaId = await getCurrentEmpresaId();
  const categoriaId = await resolveCategoriaId(empresaId, input.categoriaNome);
  const codigoInterno = input.codigoInterno.trim() || (await proximoCodigo(empresaId));

  const criado = await prisma.brinquedo.create({
    data: { ...dadosBrinquedo(input), empresaId, categoriaId, codigoInterno },
  });
  await sincronizaFoto(criado.id, input.fotoUrl);

  const row = await prisma.brinquedo.findUniqueOrThrow({ where: { id: criado.id }, include });
  return toDTO(row);
}

export async function updateBrinquedo(
  id: string,
  input: Partial<BrinquedoInput>
): Promise<Brinquedo | null> {
  const empresaId = await getCurrentEmpresaId();
  const atual = await prisma.brinquedo.findFirst({ where: { id, empresaId } });
  if (!atual) return null;

  const full = { ...toDTO(await prisma.brinquedo.findUniqueOrThrow({ where: { id }, include })), ...input };
  const categoriaId = await resolveCategoriaId(empresaId, full.categoriaNome);

  await prisma.brinquedo.update({
    where: { id },
    data: {
      ...dadosBrinquedo(full),
      categoriaId,
      codigoInterno: full.codigoInterno.trim() || atual.codigoInterno,
    },
  });
  if (input.fotoUrl !== undefined) await sincronizaFoto(id, input.fotoUrl);

  const row = await prisma.brinquedo.findUniqueOrThrow({ where: { id }, include });
  return toDTO(row);
}

export async function setBrinquedoStatus(id: string, status: BrinquedoStatus): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.brinquedo.updateMany({ where: { id, empresaId }, data: { status } });
}

export async function deleteBrinquedo(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.brinquedo.deleteMany({ where: { id, empresaId } });
}

export async function brinquedoStats() {
  const empresaId = await getCurrentEmpresaId();
  const grupos = await prisma.brinquedo.groupBy({
    by: ["status"],
    where: { empresaId },
    _count: { _all: true },
  });
  const cont = (s: BrinquedoStatus) =>
    grupos.find((g) => g.status === s)?._count._all ?? 0;
  return {
    total: grupos.reduce((s, g) => s + g._count._all, 0),
    disponivel: cont("disponivel"),
    alugado: cont("alugado"),
    manutencao: cont("manutencao"),
    limpeza: cont("limpeza"),
  };
}
