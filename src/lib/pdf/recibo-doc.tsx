import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Empresa } from "@/lib/data/empresa";
import type { Pedido } from "@/lib/data/pedidos";
import type { Cliente } from "@/lib/data/clientes";

const PRIMARY = "#182a5c";
const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const dataExt = (d: string) =>
  d ? format(parseISO(d + "T00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—";

const s = StyleSheet.create({
  page: { padding: 44, fontSize: 11, color: "#0f172a", fontFamily: "Helvetica", lineHeight: 1.5 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: `2 solid ${PRIMARY}`, paddingBottom: 10, marginBottom: 18 },
  empresa: { fontSize: 15, fontFamily: "Helvetica-Bold", color: PRIMARY },
  muted: { fontSize: 8.5, color: "#64748b" },
  tituloBox: { alignItems: "flex-end" },
  titulo: { fontSize: 20, fontFamily: "Helvetica-Bold", color: PRIMARY, letterSpacing: 1 },
  valorBox: { backgroundColor: "#f1f5f9", borderRadius: 8, padding: "12 16", marginBottom: 18, alignSelf: "flex-start" },
  valorLabel: { fontSize: 8.5, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  valor: { fontSize: 24, fontFamily: "Helvetica-Bold", color: PRIMARY },
  corpo: { textAlign: "justify", marginBottom: 10 },
  b: { fontFamily: "Helvetica-Bold" },
  linha: { marginBottom: 4 },
  itens: { marginTop: 6, marginBottom: 10, paddingLeft: 8 },
  ass: { marginTop: 46, borderTop: "1 solid #0f172a", width: "60%", paddingTop: 4, textAlign: "center", fontSize: 9, alignSelf: "center" },
  footer: { position: "absolute", bottom: 28, left: 44, right: 44, fontSize: 7.5, color: "#94a3b8", textAlign: "center" },
});

export function ReciboDoc({
  empresa,
  pedido: p,
  cliente,
  dataEventoISO,
}: {
  empresa: Empresa;
  pedido: Pedido;
  cliente: Cliente | null;
  dataEventoISO: string;
}) {
  const recebido = p.sinalPago;
  const quitado = p.valorRestante <= 0.001 && p.total > 0;
  const resumoItens = p.itens.map((i) => `${i.qtd}x ${i.nome}`).join(", ");
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <Document title={`Recibo ${p.numero}`}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {empresa.logoUrl ? (
              <Image src={empresa.logoUrl} style={{ width: 46, height: 46, objectFit: "contain", marginRight: 10 }} />
            ) : null}
            <View>
              <Text style={s.empresa}>{empresa.nome}</Text>
              {empresa.cnpj ? <Text style={s.muted}>CNPJ {empresa.cnpj}</Text> : null}
              <Text style={s.muted}>{[empresa.telefone, empresa.cidade].filter(Boolean).join(" · ")}</Text>
            </View>
          </View>
          <View style={s.tituloBox}>
            <Text style={s.titulo}>RECIBO</Text>
            <Text style={s.muted}>Nº {p.numero}</Text>
          </View>
        </View>

        <View style={s.valorBox}>
          <Text style={s.valorLabel}>Valor recebido</Text>
          <Text style={s.valor}>{brl(recebido)}</Text>
        </View>

        <Text style={s.corpo}>
          Recebemos de <Text style={s.b}>{p.clienteNome}</Text>
          {cliente?.doc ? `, documento ${cliente.doc},` : ""} a importância de{" "}
          <Text style={s.b}>{brl(recebido)}</Text>, referente à locação nº {p.numero}
          {dataEventoISO ? <> para o evento em <Text style={s.b}>{dataExt(dataEventoISO)}</Text></> : null}.
        </Text>

        {resumoItens ? (
          <Text style={s.itens}>
            <Text style={s.b}>Itens: </Text>{resumoItens}.
          </Text>
        ) : null}

        <Text style={s.linha}>
          <Text style={s.b}>Valor total da locação:</Text> {brl(p.total)}  ·  <Text style={s.b}>Recebido:</Text> {brl(recebido)}  ·{" "}
          <Text style={s.b}>{quitado ? "Situação:" : "Saldo restante:"}</Text> {quitado ? "QUITADO" : brl(p.valorRestante)}.
        </Text>

        <Text style={[s.corpo, { marginTop: 8 }]}>
          Para clareza e devidos fins, firmamos o presente recibo.
        </Text>

        <Text style={{ marginTop: 6 }}>{empresa.cidade || ""}{empresa.cidade ? ", " : ""}{dataExt(hoje)}.</Text>

        <Text style={s.ass}>{empresa.nome} — LOCADORA</Text>

        <Text style={s.footer}>Gerado por FesFlow — gestão para locadoras de brinquedos.</Text>
      </Page>
    </Document>
  );
}
