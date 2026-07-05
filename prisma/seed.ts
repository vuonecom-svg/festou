import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Planos SaaS ──────────────────────────────────────────
  const planos = [
    {
      nome: "Começando",
      precoMensal: 49,
      limiteBrinquedos: 15,
      limiteUsuarios: 1,
      limiteEventosMes: 30,
      features: { agenda: true, orcamentos: true, financeiro: false },
    },
    {
      nome: "Profissional",
      precoMensal: 129,
      limiteBrinquedos: 60,
      limiteUsuarios: 5,
      limiteEventosMes: null,
      features: { agenda: true, orcamentos: true, financeiro: true, crm: true, contratos: true },
    },
    {
      nome: "Locadora+",
      precoMensal: 249,
      limiteBrinquedos: null,
      limiteUsuarios: null,
      limiteEventosMes: null,
      features: { tudo: true, equipe: true, rotas: true, appRua: true, catalogo: true },
    },
  ];

  for (const p of planos) {
    const existe = await prisma.plano.findFirst({ where: { nome: p.nome } });
    if (!existe) await prisma.plano.create({ data: p });
  }
  const planoPro = await prisma.plano.findFirst({ where: { nome: "Profissional" } });

  // ── Empresa demo ─────────────────────────────────────────
  let empresa = await prisma.empresa.findFirst({ where: { nome: "Festa Feliz Locações" } });
  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: {
        nome: "Festa Feliz Locações",
        cnpj: "12.345.678/0001-90",
        telefone: "(19) 99999-0000",
        corPrimaria: "#6d28d9",
        planoId: planoPro?.id,
        statusAssinatura: "trial",
        trialAte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ── Usuário admin ────────────────────────────────────────
  await prisma.usuario.upsert({
    where: { empresaId_email: { empresaId: empresa.id, email: "admin@festafeliz.com" } },
    update: {},
    create: {
      empresaId: empresa.id,
      nome: "Dona Festa",
      email: "admin@festafeliz.com",
      papel: "admin",
    },
  });

  // ── Categorias + brinquedos ──────────────────────────────
  const catInflaveis =
    (await prisma.categoria.findFirst({ where: { empresaId: empresa.id, nome: "Infláveis" } })) ??
    (await prisma.categoria.create({ data: { empresaId: empresa.id, nome: "Infláveis" } }));

  const brinquedos = [
    { nome: "Pula-pula Castelo 3x3", valorDiaria: 250, capacidadeCriancas: 8, qtdMotores: 1, precisaEnergia: true },
    { nome: "Tobogã inflável 5m", valorDiaria: 400, capacidadeCriancas: 6, qtdMotores: 1, precisaEnergia: true },
    { nome: "Piscina de bolinha", valorDiaria: 150, capacidadeCriancas: 10, qtdMotores: 0 },
    { nome: "Cama elástica 3m", valorDiaria: 180, capacidadeCriancas: 4, qtdMotores: 0 },
    { nome: "Futebol de sabão", valorDiaria: 500, capacidadeCriancas: 10, qtdMotores: 1, precisaEnergia: true, precisaAgua: true },
  ];

  for (const [i, b] of brinquedos.entries()) {
    const codigo = `BR-${String(i + 1).padStart(3, "0")}`;
    const existe = await prisma.brinquedo.findFirst({
      where: { empresaId: empresa.id, codigoInterno: codigo },
    });
    if (!existe) {
      await prisma.brinquedo.create({
        data: { ...b, empresaId: empresa.id, categoriaId: catInflaveis.id, codigoInterno: codigo },
      });
    }
  }

  // ── Clientes demo ────────────────────────────────────────
  const clientesDemo: {
    nome: string; doc?: string; telefone?: string; whatsapp?: string;
    cidade?: string; bairro?: string; tags: string[]; avaliacao?: number;
  }[] = [
    { nome: "Ana Paula Ribeiro", telefone: "(19) 99811-2200", whatsapp: "(19) 99811-2200", cidade: "Indaiatuba", bairro: "Jardim Morada do Sol", tags: ["recorrente", "particular"], avaliacao: 5 },
    { nome: "Escola Arco-Íris", doc: "12.345.678/0001-90", telefone: "(19) 3834-1122", whatsapp: "(19) 99700-1010", cidade: "Campinas", bairro: "Cambuí", tags: ["escola", "empresa"], avaliacao: 5 },
    { nome: "Condomínio Villa Verde", telefone: "(19) 99655-3030", cidade: "Indaiatuba", bairro: "Vila Rica", tags: ["condominio"], avaliacao: 4 },
    { nome: "Marcos Antônio Silva", telefone: "(19) 99422-8080", cidade: "Salto", bairro: "Centro", tags: ["particular"] },
  ];
  for (const c of clientesDemo) {
    const existe = await prisma.cliente.findFirst({ where: { empresaId: empresa.id, nome: c.nome } });
    if (existe) continue;
    const created = await prisma.cliente.create({
      data: {
        empresaId: empresa.id, nome: c.nome, doc: c.doc ?? null,
        telefone: c.telefone ?? null, whatsapp: c.whatsapp ?? null, avaliacao: c.avaliacao ?? null,
      },
    });
    if (c.cidade || c.bairro) {
      await prisma.clienteEndereco.create({
        data: { clienteId: created.id, tipo: "residencial", cidade: c.cidade ?? null, bairro: c.bairro ?? null },
      });
    }
    if (c.tags.length) {
      await prisma.clienteTag.createMany({ data: c.tags.map((tag) => ({ clienteId: created.id, tag })) });
    }
  }

  // ── Pedidos demo (orçamento aprovado → pedido → reserva) ─────
  const demos = [
    { numero: 1001, orcNum: 2001, cliente: "Ana Paula Ribeiro", brinquedo: "Pula-pula Castelo 3x3", data: "2026-07-19", ini: "14:00", fim: "18:00", jIni: "12:45", jFim: "19:35", total: 250, sinal: 100, cidade: "Indaiatuba", bairro: "Centro" },
    { numero: 1002, orcNum: 2002, cliente: "Escola Arco-Íris", brinquedo: "Tobogã inflável 5m", data: "2026-07-20", ini: "10:00", fim: "14:00", jIni: "08:45", jFim: "15:35", total: 400, sinal: 400, cidade: "Campinas", bairro: "Cambuí" },
  ];
  for (const d of demos) {
    const jaTem = await prisma.pedido.findFirst({ where: { empresaId: empresa.id, numero: d.numero } });
    if (jaTem) continue;
    const cli = await prisma.cliente.findFirst({ where: { empresaId: empresa.id, nome: d.cliente } });
    const brq = await prisma.brinquedo.findFirst({ where: { empresaId: empresa.id, nome: d.brinquedo } });
    if (!cli || !brq) continue;
    const restante = Math.max(0, d.total - d.sinal);
    const statusFin = d.sinal >= d.total ? "quitado" : d.sinal > 0 ? "sinal_pago" : "aguardando_sinal";
    const endereco = await prisma.enderecoEvento.create({
      data: { empresaId: empresa.id, nomeLocal: "Local do evento", tipoLocal: "Salão", cidade: d.cidade, bairro: d.bairro },
    });
    const orc = await prisma.orcamento.create({
      data: {
        empresaId: empresa.id, numero: d.orcNum, clienteId: cli.id, enderecoEventoId: endereco.id,
        dataEvento: new Date(d.data), horaEntrega: d.ini, horaRetirada: d.fim,
        subtotal: d.total, total: d.total, valorSinal: d.sinal, valorRestante: restante,
        formaPagamento: "Pix", status: "aprovado",
        itens: { create: [{ brinquedoId: brq.id, descricao: brq.nome, qtd: 1, valorUnit: d.total, valorTotal: d.total }] },
      },
    });
    const ped = await prisma.pedido.create({
      data: {
        empresaId: empresa.id, numero: d.numero, orcamentoId: orc.id, clienteId: cli.id, enderecoEventoId: endereco.id,
        dataEvento: new Date(d.data), horaEntrega: d.ini, horaRetirada: d.fim,
        total: d.total, sinalPago: d.sinal, valorRestante: restante,
        statusFinanceiro: statusFin as "quitado" | "sinal_pago" | "aguardando_sinal",
        statusOperacional: "aguardando_separacao",
      },
    });
    await prisma.reservaItem.create({
      data: {
        empresaId: empresa.id, pedidoId: ped.id, brinquedoId: brq.id, qtd: 1,
        janelaInicio: new Date(`${d.data}T${d.jIni}:00`), janelaFim: new Date(`${d.data}T${d.jFim}:00`),
      },
    });
  }

  console.log("✅ Seed concluído: 3 planos, 1 empresa, 1 admin, 5 brinquedos, 4 clientes, 2 pedidos demo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
