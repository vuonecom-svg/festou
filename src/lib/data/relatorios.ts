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

  const [tot, orcTotal, convertidos, porMesRows, brinqRows, cliRows, cidRows] = await Promise.all([
    prisma.pedido.aggregate({
      where: { empresaId },
      _sum: { total: true, sinalPago: true, valorRestante: true },
      _count: { _all: true },
    }),
    prisma.orcamento.count({ where: { empresaId } }),
    prisma.orcamento.count({ where: { empresaId, pedido: { isNot: null } } }),
    prisma.$queryRaw<{ chave: string; total: number }[]>`
      SELECT to_char(date_trunc('month', data_evento), 'YYYY-MM') AS chave,
             SUM(total)::float8 AS total
      FROM pedido WHERE empresa_id = ${empresaId}::uuid
      GROUP BY 1 ORDER BY 1`,
    prisma.$queryRaw<RankRow[]>`
      SELECT oi.descricao AS nome, SUM(oi.qtd)::int AS qtd, SUM(oi.valor_total)::float8 AS total
      FROM orcamento_item oi
      JOIN pedido p ON p.orcamento_id = oi.orcamento_id
      WHERE p.empresa_id = ${empresaId}::uuid AND oi.descricao IS NOT NULL
      GROUP BY oi.descricao ORDER BY total DESC LIMIT 6`,
    prisma.$queryRaw<RankRow[]>`
      SELECT c.nome AS nome, COUNT(*)::int AS qtd, SUM(p.total)::float8 AS total
      FROM pedido p JOIN cliente c ON c.id = p.cliente_id
      WHERE p.empresa_id = ${empresaId}::uuid
      GROUP BY c.nome ORDER BY total DESC LIMIT 6`,
    prisma.$queryRaw<RankRow[]>`
      SELECT COALESCE(e.cidade, '—') AS nome, COUNT(*)::int AS qtd, SUM(p.total)::float8 AS total
      FROM pedido p LEFT JOIN endereco_evento e ON e.id = p.endereco_evento_id
      WHERE p.empresa_id = ${empresaId}::uuid
      GROUP BY COALESCE(e.cidade, '—') ORDER BY total DESC LIMIT 6`,
  ]);

  const faturamentoTotal = Number(tot._sum.total ?? 0);
  const recebido = Number(tot._sum.sinalPago ?? 0);
  const aReceber = Number(tot._sum.valorRestante ?? 0);
  const qtdPedidos = tot._count._all;
  const ticketMedio = qtdPedidos ? faturamentoTotal / qtdPedidos : 0;

  const porMes: BarraMes[] = porMesRows.map((m) => ({
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
