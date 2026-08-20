// Agregações de relatórios — feitas no BANCO (aggregate/count/GROUP BY),
// não carregando o histórico inteiro para a memória.
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type LinhaRanking = { nome: string; qtd: number; total: number };
export type BarraMes = { chave: string; label: string; total: number };

export type Relatorios = {
  faturamentoTotal: number;
  recebido: number;
  aReceber: number;
  qtdPedidos: number;
  ticketMedio: number;
  porMes: BarraMes[];
  brinquedos: LinhaRanking[]; // por faturamento
  clientes: LinhaRanking[];
  cidades: LinhaRanking[];
  conversao: { orcamentos: number; convertidos: number; taxa: number | null };
};

type RankRow = { nome: string; qtd: number; total: number };

export async function gerarRelatorios(): Promise<Relatorios> {
  const empresaId = await getCurrentEmpresaId();

  const [tot, orcTotal, convertidos, porMesRows, brinqRows, cliRows, cidRows, recAvulsas] = await Promise.all([
    prisma.pedido.aggregate({
      where: { empresaId },
      _sum: { total: true, sinalPago: true, valorRestante: true },
      _count: { _all: true },
    }),
    prisma.orcamento.count({ where: { empresaId } }),
    prisma.orcamento.count({ where: { empresaId, pedido: { isNot: null } } }),
    // Últimos 12 meses (gráfico legível) e anos plausíveis (data corrompida não
    // derruba a página no parseISO).
    prisma.$queryRaw<{ chave: string; total: number }[]>`
      SELECT * FROM (
        SELECT to_char(date_trunc('month', data_evento), 'YYYY-MM') AS chave,
               SUM(total)::float8 AS total
        FROM pedido
        WHERE empresa_id = ${empresaId}
          AND data_evento BETWEEN '1990-01-01' AND '2100-01-01'
        GROUP BY 1 ORDER BY 1 DESC LIMIT 12
      ) ult ORDER BY chave`,
    // Ranking por BRINQUEDO (id), não pela descrição — "(3 diárias)"/"(+2h)" no
    // texto não fragmenta mais o mesmo brinquedo em várias linhas.
    prisma.$queryRaw<RankRow[]>`
      SELECT COALESCE(b.nome, oi.descricao) AS nome, SUM(oi.qtd)::int AS qtd, SUM(oi.valor_total)::float8 AS total
      FROM orcamento_item oi
      JOIN pedido p ON p.orcamento_id = oi.orcamento_id
      LEFT JOIN brinquedo b ON b.id = oi.brinquedo_id
      WHERE p.empresa_id = ${empresaId}
      GROUP BY COALESCE(b.nome, oi.descricao) ORDER BY total DESC LIMIT 6`,
    prisma.$queryRaw<RankRow[]>`
      SELECT c.nome AS nome, COUNT(*)::int AS qtd, SUM(p.total)::float8 AS total
      FROM pedido p JOIN cliente c ON c.id = p.cliente_id
      WHERE p.empresa_id = ${empresaId}
      GROUP BY c.nome ORDER BY total DESC LIMIT 6`,
    prisma.$queryRaw<RankRow[]>`
      SELECT COALESCE(e.cidade, '—') AS nome, COUNT(*)::int AS qtd, SUM(p.total)::float8 AS total
      FROM pedido p LEFT JOIN endereco_evento e ON e.id = p.endereco_evento_id
      WHERE p.empresa_id = ${empresaId}
      GROUP BY COALESCE(e.cidade, '—') ORDER BY total DESC LIMIT 6`,
    prisma.receita.aggregate({ where: { empresaId }, _sum: { valor: true } }),
  ]);

  // Receitas avulsas entram no faturamento/recebido — MESMA conta da tela
  // Financeiro (antes cada tela mostrava um número diferente com o mesmo rótulo).
  const avulsas = Number(recAvulsas._sum.valor ?? 0);
  const faturamentoTotal = Number(tot._sum.total ?? 0) + avulsas;
  const recebido = Number(tot._sum.sinalPago ?? 0) + avulsas;
  const aReceber = Number(tot._sum.valorRestante ?? 0);
  const qtdPedidos = tot._count._all;
  const ticketMedio = qtdPedidos ? Number(tot._sum.total ?? 0) / qtdPedidos : 0;

  const porMes: BarraMes[] = porMesRows
    .filter((m) => !isNaN(parseISO(m.chave + "-01").getTime()))
    .map((m) => ({
      chave: m.chave,
      label: format(parseISO(m.chave + "-01"), "LLL/yy", { locale: ptBR }),
      total: Number(m.total),
    }));

  const norm = (rows: RankRow[]): LinhaRanking[] =>
    rows.map((r) => ({ nome: r.nome, qtd: Number(r.qtd), total: Number(r.total) }));

  const taxa = orcTotal ? convertidos / orcTotal : null;

  return {
    faturamentoTotal,
    recebido,
    aReceber,
    qtdPedidos,
    ticketMedio,
    porMes,
    brinquedos: norm(brinqRows),
    clientes: norm(cliRows),
    cidades: norm(cidRows),
    conversao: { orcamentos: orcTotal, convertidos, taxa },
  };
}
