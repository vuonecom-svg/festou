import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Empresa } from "@/lib/data/empresa";
import type { Orcamento } from "@/lib/data/orcamentos";
import type { Cliente } from "@/lib/data/clientes";

const PRIMARY = "#182a5c";
const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const dataExt = (d: string) =>
  d ? format(parseISO(d + "T00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#0f172a", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, borderBottom: `2 solid ${PRIMARY}`, paddingBottom: 10 },
  empresaNome: { fontSize: 16, fontFamily: "Helvetica-Bold", color: PRIMARY },
  muted: { color: "#64748b", fontSize: 8.5 },
  docTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", textAlign: "right" },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", marginBottom: 5 },
  row: { flexDirection: "row" },
  col: { flex: 1 },
  label: { color: "#64748b", fontSize: 8.5 },
  value: { fontSize: 10, marginBottom: 3 },
  tHead: { flexDirection: "row", backgroundColor: "#e9edf8", paddingVertical: 5, paddingHorizontal: 6, fontFamily: "Helvetica-Bold", fontSize: 9 },
  tRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottom: "0.5 solid #e2e8f0" },
  cItem: { flex: 4 },
  cQtd: { flex: 1, textAlign: "center" },
  cUnit: { flex: 1.5, textAlign: "right" },
  cTot: { flex: 1.5, textAlign: "right" },
  totais: { marginTop: 10, alignSelf: "flex-end", width: 220 },
  totRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totLabel: { color: "#475569" },
  totalFinal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, marginTop: 3, borderTop: "1 solid #e2e8f0", fontFamily: "Helvetica-Bold", fontSize: 12 },
  restante: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2, color: PRIMARY, fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 28, left: 36, right: 36, fontSize: 8, color: "#94a3b8", borderTop: "0.5 solid #e2e8f0", paddingTop: 6 },
});

export function OrcamentoDoc({
  empresa,
  orcamento: o,
  cliente,
}: {
  empresa: Empresa;
  orcamento: Orcamento;
  cliente: Cliente | null;
}) {
  return (
    <Document title={`Orçamento ${o.numero}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.empresaNome}>{empresa.nome}</Text>
            <Text style={s.muted}>{empresa.cnpj}</Text>
            <Text style={s.muted}>{empresa.telefone} · {empresa.email}</Text>
            <Text style={s.muted}>{empresa.endereco}, {empresa.cidade}</Text>
          </View>
          <View>
            <Text style={s.docTitle}>ORÇAMENTO Nº {o.numero}</Text>
            <Text style={[s.muted, { textAlign: "right" }]}>
              Emitido em {format(parseISO(o.criadoEm), "dd/MM/yyyy")}
            </Text>
          </View>
        </View>

        <View style={s.row}>
          <View style={[s.col, s.section]}>
            <Text style={s.sectionTitle}>Cliente</Text>
            <Text style={s.value}>{o.clienteNome}</Text>
            {cliente?.doc ? <Text style={s.muted}>{cliente.doc}</Text> : null}
            {cliente?.telefone ? <Text style={s.muted}>{cliente.telefone}</Text> : null}
          </View>
          <View style={[s.col, s.section]}>
            <Text style={s.sectionTitle}>Evento</Text>
            <Text style={s.value}>{dataExt(o.dataEvento)}</Text>
            <Text style={s.muted}>Entrega {o.horaEntrega || "—"} · Retirada {o.horaRetirada || "—"}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Local da festa</Text>
          <Text style={s.value}>
            {o.endereco.nomeLocal || "—"} ({o.endereco.tipoLocal})
          </Text>
          <Text style={s.muted}>
            {[o.endereco.rua, o.endereco.numero].filter(Boolean).join(", ")}
            {o.endereco.bairro ? ` — ${o.endereco.bairro}` : ""} · {o.endereco.cidade}
          </Text>
          {o.endereco.referencia ? <Text style={s.muted}>Ref.: {o.endereco.referencia}</Text> : null}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Itens</Text>
          <View style={s.tHead}>
            <Text style={s.cItem}>Brinquedo / item</Text>
            <Text style={s.cQtd}>Qtd</Text>
            <Text style={s.cUnit}>Unitário</Text>
            <Text style={s.cTot}>Total</Text>
          </View>
          {o.itens.map((it, i) => (
            <View key={i} style={s.tRow}>
              <Text style={s.cItem}>{it.nome}</Text>
              <Text style={s.cQtd}>{it.qtd}</Text>
              <Text style={s.cUnit}>{brl(it.valorUnit)}</Text>
              <Text style={s.cTot}>{brl(it.valorTotal)}</Text>
            </View>
          ))}

          <View style={s.totais}>
            <View style={s.totRow}><Text style={s.totLabel}>Subtotal</Text><Text>{brl(o.subtotal)}</Text></View>
            {o.desconto > 0 ? <View style={s.totRow}><Text style={s.totLabel}>Desconto</Text><Text>- {brl(o.desconto)}</Text></View> : null}
            {o.taxaEntrega > 0 ? <View style={s.totRow}><Text style={s.totLabel}>Taxa de entrega</Text><Text>{brl(o.taxaEntrega)}</Text></View> : null}
            {o.taxaMontagem > 0 ? <View style={s.totRow}><Text style={s.totLabel}>Taxa de montagem</Text><Text>{brl(o.taxaMontagem)}</Text></View> : null}
            <View style={s.totalFinal}><Text>Total</Text><Text>{brl(o.total)}</Text></View>
            <View style={s.totRow}><Text style={s.totLabel}>Sinal</Text><Text>{brl(o.valorSinal)}</Text></View>
            <View style={s.restante}><Text>Restante</Text><Text>{brl(o.valorRestante)}</Text></View>
            {o.formaPagamento ? <View style={s.totRow}><Text style={s.totLabel}>Pagamento</Text><Text>{o.formaPagamento}</Text></View> : null}
          </View>
        </View>

        {o.obs ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Observações</Text>
            <Text style={{ fontSize: 9 }}>{o.obs}</Text>
          </View>
        ) : null}

        <Text style={s.footer}>
          Este orçamento é uma proposta e não garante a reserva dos brinquedos até a confirmação do pagamento do sinal.
          {"  "}Gerado por FesFlow — gestão para locadoras de brinquedos.
        </Text>
      </Page>
    </Document>
  );
}
