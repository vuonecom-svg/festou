// Camada de dados de Clientes — sobre Postgres (Prisma/Supabase), por empresa.
// Mesmos tipos/assinaturas da versão mock (telas e actions não mudam).
// Endereço residencial = 1 ClienteEndereco (tipo "residencial"); tags = ClienteTag[].

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";
import { TAGS_VALIDAS, type ClienteTag } from "@/lib/clientes-shared";

// Reexporta para os consumidores server-side que já importam daqui.
export { CLIENTE_TAGS } from "@/lib/clientes-shared";
export type { ClienteTag } from "@/lib/clientes-shared";

export type Cliente = {
  id: string;
  nome: string;
  doc: string;
  telefone: string;
  whatsapp: string;
  email: string;
  nascimento: string; // yyyy-mm-dd ou ""
  avaliacao: number | null;
  obs: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento: string;
  tags: ClienteTag[];
  qtdEventos: number;
  totalGasto: number;
  criadoEm: string;
};

export type ClienteInput = Omit<Cliente, "id" | "criadoEm" | "qtdEventos" | "totalGasto">;

const include = {
  enderecos: { where: { tipo: "residencial" }, take: 1 },
  tags: true,
  _count: { select: { pedidos: true } },
} satisfies Prisma.ClienteInclude;

type ClienteRow = Prisma.ClienteGetPayload<{ include: typeof include }>;

// totalGasto é somado no BANCO (não puxando todos os pedidos pra JS).
function toDTO(c: ClienteRow, totalGasto: number): Cliente {
  const end = c.enderecos[0];
  return {
    id: c.id,
    nome: c.nome,
    doc: c.doc ?? "",
    telefone: c.telefone ?? "",
    whatsapp: c.whatsapp ?? "",
    email: c.email ?? "",
    nascimento: c.nascimento ? c.nascimento.toISOString().slice(0, 10) : "",
    avaliacao: c.avaliacao,
    obs: c.obs ?? "",
    rua: end?.rua ?? "",
    numero: end?.numero ?? "",
    bairro: end?.bairro ?? "",
    cidade: end?.cidade ?? "",
    cep: end?.cep ?? "",
    complemento: end?.complemento ?? "",
    tags: c.tags.map((t) => t.tag).filter((t): t is ClienteTag => TAGS_VALIDAS.includes(t as ClienteTag)),
    qtdEventos: c._count.pedidos,
    totalGasto,
    criadoEm: c.criadoEm.toISOString(),
  };
}

async function totalGastoDe(clienteId: string): Promise<number> {
  const agg = await prisma.pedido.aggregate({ where: { clienteId }, _sum: { total: true } });
  return Number(agg._sum.total ?? 0);
}

function dadosCliente(input: ClienteInput) {
  return {
    nome: input.nome,
    doc: input.doc || null,
    telefone: input.telefone || null,
    whatsapp: input.whatsapp || null,
    email: input.email || null,
    nascimento: input.nascimento ? new Date(input.nascimento) : null,
    avaliacao: input.avaliacao,
    obs: input.obs || null,
  };
}

async function sincronizaEndereco(clienteId: string, input: ClienteInput) {
  await prisma.clienteEndereco.deleteMany({ where: { clienteId, tipo: "residencial" } });
  if (input.rua || input.numero || input.bairro || input.cidade || input.cep || input.complemento) {
    await prisma.clienteEndereco.create({
      data: {
        clienteId, tipo: "residencial",
        rua: input.rua || null, numero: input.numero || null, bairro: input.bairro || null,
        cidade: input.cidade || null, cep: input.cep || null, complemento: input.complemento || null,
      },
    });
  }
}

async function sincronizaTags(clienteId: string, tags: ClienteTag[]) {
  await prisma.clienteTag.deleteMany({ where: { clienteId } });
  const unicas = [...new Set(tags)].filter((t) => TAGS_VALIDAS.includes(t));
  if (unicas.length) {
    await prisma.clienteTag.createMany({ data: unicas.map((tag) => ({ clienteId, tag })) });
  }
}

export async function listClientes(): Promise<Cliente[]> {
  const empresaId = await getCurrentEmpresaId();
  const [rows, totais] = await Promise.all([
    prisma.cliente.findMany({ where: { empresaId }, include, orderBy: { nome: "asc" } }),
    prisma.pedido.groupBy({ by: ["clienteId"], where: { empresaId }, _sum: { total: true } }),
  ]);
  const mapa = new Map(totais.map((t) => [t.clienteId, Number(t._sum.total ?? 0)]));
  return rows.map((r) => toDTO(r, mapa.get(r.id) ?? 0));
}

export async function getCliente(id: string): Promise<Cliente | null> {
  const empresaId = await getCurrentEmpresaId();
  const row = await prisma.cliente.findFirst({ where: { id, empresaId }, include });
  return row ? toDTO(row, await totalGastoDe(id)) : null;
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  const empresaId = await getCurrentEmpresaId();
  const criado = await prisma.cliente.create({ data: { ...dadosCliente(input), empresaId } });
  await sincronizaEndereco(criado.id, input);
  await sincronizaTags(criado.id, input.tags);
  const row = await prisma.cliente.findUniqueOrThrow({ where: { id: criado.id }, include });
  return toDTO(row, 0);
}

export async function updateCliente(id: string, input: Partial<ClienteInput>): Promise<Cliente | null> {
  const empresaId = await getCurrentEmpresaId();
  const atualRow = await prisma.cliente.findFirst({ where: { id, empresaId }, include });
  if (!atualRow) return null;

  const full: ClienteInput = { ...toDTO(atualRow, 0), ...input };
  await prisma.cliente.update({ where: { id }, data: dadosCliente(full) });
  await sincronizaEndereco(id, full);
  await sincronizaTags(id, full.tags);

  const row = await prisma.cliente.findUniqueOrThrow({ where: { id }, include });
  return toDTO(row, await totalGastoDe(id));
}

export async function deleteCliente(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.cliente.deleteMany({ where: { id, empresaId } });
}

export async function clienteStats() {
  const empresaId = await getCurrentEmpresaId();
  const [total, recorrentes, agg] = await Promise.all([
    prisma.cliente.count({ where: { empresaId } }),
    prisma.cliente.count({ where: { empresaId, tags: { some: { tag: "recorrente" } } } }),
    prisma.pedido.aggregate({ where: { empresaId }, _sum: { total: true } }),
  ]);
  return {
    total,
    recorrentes,
    faturamentoTotal: Number(agg._sum.total ?? 0),
  };
}
