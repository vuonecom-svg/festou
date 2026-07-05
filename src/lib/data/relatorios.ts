// Agregações de relatórios a partir dos pedidos (e orçamentos p/ conversão).
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { listPedidos } from "./pedidos";
import { listOrcamentos } from "./orcamentos";

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

export async function gerarRelatorios(): Promise<Relatorios> {
  const [pedidos, orcamentos] = await Promise.all([listPedidos(), listOrcamentos()]);

  const faturamentoTotal = pedidos.reduce((s, p) => s + p.total, 0);
  const recebido = pedidos.reduce((s, p) => s + p.sinalPago, 0);
  const aReceber = pedidos.reduce((s, p) => s + p.valorRestante, 0);
  const qtdPedidos = pedidos.length;
  const ticketMedio = qtdPedidos ? faturamentoTotal / qtdPedidos : 0;

  // Faturamento por mês (pela data do evento)
  const mesMap = new Map<string, number>();
  for (const p of pedidos) {
    if (!p.dataEvento) continue;
    const chave = p.dataEvento.slice(0, 7); // yyyy-mm
    mesMap.set(chave, (mesMap.get(chave) ?? 0) + p.total);
  }
  const porMes: BarraMes[] = [...mesMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([chave, total]) => ({
      chave,
      label: format(parseISO(chave + "-01"), "LLL/yy", { locale: ptBR }),
      total,
    }));

  // Rankings
  const brinqMap = new Map<string, LinhaRanking>();
  const cliMap = new Map<string, LinhaRanking>();
  const cidMap = new Map<string, LinhaRanking>();

  for (const p of pedidos) {
    for (const it of p.itens) {
      const r = brinqMap.get(it.nome) ?? { nome: it.nome, qtd: 0, total: 0 };
      r.qtd += it.qtd;
      r.total += it.valorTotal;
      brinqMap.set(it.nome, r);
    }
    const c = cliMap.get(p.clienteNome) ?? { nome: p.clienteNome, qtd: 0, total: 0 };
    c.qtd += 1;
    c.total += p.total;
    cliMap.set(p.clienteNome, c);

    const cidade = p.cidade || "—";
    const ci = cidMap.get(cidade) ?? { nome: cidade, qtd: 0, total: 0 };
    ci.qtd += 1;
    ci.total += p.total;
    cidMap.set(cidade, ci);
  }

  const ordena = (m: Map<string, LinhaRanking>) =>
    [...m.values()].sort((a, b) => b.total - a.total);

  const convertidos = orcamentos.filter((o) => o.status === "convertido").length;
  const taxa = orcamentos.length ? convertidos / orcamentos.length : null;

  return {
    faturamentoTotal,
    recebido,
    aReceber,
    qtdPedidos,
    ticketMedio,
    porMes,
    brinquedos: ordena(brinqMap),
    clientes: ordena(cliMap),
    cidades: ordena(cidMap),
    conversao: { orcamentos: orcamentos.length, convertidos, taxa },
  };
}
