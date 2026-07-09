import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Empresa } from "@/lib/data/empresa";
import type { Pedido } from "@/lib/data/pedidos";
import type { Orcamento } from "@/lib/data/orcamentos";
import type { Cliente } from "@/lib/data/clientes";

const PRIMARY = "#182a5c";
const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const dataExt = (d: string) =>
  d ? format(parseISO(d + "T00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, color: "#0f172a", fontFamily: "Helvetica", lineHeight: 1.4 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", textAlign: "center", color: PRIMARY, marginBottom: 2 },
  sub: { fontSize: 9, textAlign: "center", color: "#64748b", marginBottom: 14 },
  h: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 3 },
  p: { marginBottom: 4, textAlign: "justify" },
  b: { fontFamily: "Helvetica-Bold" },
  tHead: { flexDirection: "row", backgroundColor: "#e9edf8", paddingVertical: 4, paddingHorizontal: 6, fontFamily: "Helvetica-Bold", fontSize: 9 },
  tRow: { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 6, borderBottom: "0.5 solid #e2e8f0" },
  cItem: { flex: 4 }, cQtd: { flex: 1, textAlign: "center" }, cTot: { flex: 1.5, textAlign: "right" },
  clausula: { marginBottom: 4, textAlign: "justify" },
  assRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  assBox: { width: "45%", borderTop: "1 solid #0f172a", paddingTop: 4, textAlign: "center", fontSize: 8.5 },
  footer: { position: "absolute", bottom: 26, left: 40, right: 40, fontSize: 7.5, color: "#94a3b8", textAlign: "center" },
});

const CLAUSULAS: [string, string][] = [
  ["Objeto", "A LOCADORA cede em locação ao LOCATÁRIO os brinquedos e itens discriminados neste contrato, pelo período e local do evento aqui indicados."],
  ["Entrega, montagem e retirada", "A entrega e montagem serão feitas pela equipe da LOCADORA no horário combinado. A retirada ocorrerá ao término do evento. O LOCATÁRIO deve garantir espaço adequado, acesso e, quando necessário, ponto de energia e água."],
  ["Uso correto e supervisão", "O LOCATÁRIO é responsável pelo uso correto dos equipamentos, devendo manter um adulto responsável supervisionando as crianças durante todo o evento."],
  ["Proibições", "É proibido: uso de objetos cortantes, óculos, sapatos, comida ou bebida sobre os brinquedos infláveis; exceder a capacidade máxima de crianças; e o uso por adultos em brinquedos infantis."],
  ["Segurança em caso de chuva ou vento", "Por segurança, a LOCADORA poderá interromper o uso e recolher brinquedos infláveis em caso de chuva forte ou ventania, sem que isso gere direito a reembolso após a montagem."],
  ["Energia e local", "O LOCATÁRIO garante que o local possui as condições informadas (energia, espaço e piso adequados). Danos causados por queda de energia ou local inadequado não são de responsabilidade da LOCADORA."],
  ["Danos ao equipamento", "O LOCATÁRIO responde por perdas ou danos aos equipamentos que excedam o desgaste normal de uso, decorrentes de mau uso, vandalismo ou descuido, arcando com o custo de reparo ou reposição."],
  ["Pagamento", "A reserva se confirma com o pagamento do sinal. O valor restante deve ser quitado até a data/entrega do evento, na forma de pagamento acordada."],
  ["Cancelamento e reagendamento", "Cancelamentos com menos de 48 horas de antecedência não dão direito à devolução do sinal. O reagendamento está sujeito à disponibilidade de data e dos brinquedos."],
  ["Multa por atraso", "A retenção dos equipamentos além do horário combinado, por responsabilidade do LOCATÁRIO, poderá gerar cobrança adicional proporcional à diária."],
  ["Foro", "Fica eleito o foro da comarca da LOCADORA para dirimir eventuais questões oriundas deste contrato."],
];

export function ContratoDoc({
  empresa,
  pedido: p,
  orcamento: o,
  cliente,
}: {
  empresa: Empresa;
  pedido: Pedido;
  orcamento: Orcamento | null;
  cliente: Cliente | null;
}) {
  const end = o?.endereco;
  return (
    <Document title={`Contrato ${p.numero}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>CONTRATO DE LOCAÇÃO DE BRINQUEDOS</Text>
        <Text style={s.sub}>Nº {p.numero} · {empresa.nome}</Text>

        <Text style={s.p}>
          <Text style={s.b}>LOCADORA:</Text> {empresa.nome}, CNPJ {empresa.cnpj}, situada em {empresa.endereco}, {empresa.cidade},
          telefone {empresa.telefone}.
        </Text>
        <Text style={s.p}>
          <Text style={s.b}>LOCATÁRIO:</Text> {p.clienteNome}
          {cliente?.doc ? `, documento ${cliente.doc}` : ""}
          {cliente?.telefone ? `, telefone ${cliente.telefone}` : ""}.
        </Text>

        <Text style={s.h}>Dados do evento</Text>
        <Text style={s.p}>
          Data: <Text style={s.b}>{dataExt(p.dataEvento)}</Text> · Entrega: {p.horaEntrega || "—"} · Retirada: {p.horaRetirada || "—"}.
        </Text>
        {end ? (
          <Text style={s.p}>
            Local: {end.nomeLocal || "—"} ({end.tipoLocal}) — {[end.rua, end.numero].filter(Boolean).join(", ")}
            {end.bairro ? ` — ${end.bairro}` : ""}, {end.cidade}.
          </Text>
        ) : (
          <Text style={s.p}>Local: {p.cidade}.</Text>
        )}

        <Text style={s.h}>Brinquedos e itens locados</Text>
        <View style={s.tHead}>
          <Text style={s.cItem}>Item</Text><Text style={s.cQtd}>Qtd</Text><Text style={s.cTot}>Valor</Text>
        </View>
        {p.itens.map((it, i) => (
          <View key={i} style={s.tRow}>
            <Text style={s.cItem}>{it.nome}</Text><Text style={s.cQtd}>{it.qtd}</Text><Text style={s.cTot}>{brl(it.valorTotal)}</Text>
          </View>
        ))}

        <Text style={[s.p, { marginTop: 8 }]}>
          <Text style={s.b}>Valor total:</Text> {brl(p.total)}  ·  <Text style={s.b}>Sinal pago:</Text> {brl(p.sinalPago)}  ·{" "}
          <Text style={s.b}>Restante:</Text> {brl(p.valorRestante)}
          {o?.formaPagamento ? `  ·  Forma: ${o.formaPagamento}` : ""}.
        </Text>

        <Text style={s.h}>Cláusulas</Text>
        {CLAUSULAS.map(([titulo, texto], i) => (
          <Text key={i} style={s.clausula}>
            <Text style={s.b}>{i + 1}. {titulo}. </Text>{texto}
          </Text>
        ))}

        <Text style={[s.p, { marginTop: 10 }]}>
          {empresa.cidade}, {dataExt(new Date().toISOString().slice(0, 10))}.
        </Text>

        <View style={s.assRow}>
          <View style={s.assBox}><Text>{p.clienteNome}</Text><Text>LOCATÁRIO</Text></View>
          <View style={s.assBox}><Text>{empresa.nome}</Text><Text>LOCADORA</Text></View>
        </View>

        <Text style={s.footer}>Gerado por FesFlow — gestão para locadoras de brinquedos.</Text>
      </Page>
    </Document>
  );
}
