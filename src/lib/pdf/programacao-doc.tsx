import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Empresa } from "@/lib/data/empresa";
import type { Programacao, EventoProgramacao } from "@/lib/data/programacao";
import { PEDIDO_FIN, PEDIDO_OP, statusInfo } from "@/lib/data/pedidos";

const PRIMARY = "#182a5c";
const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const diaExt = (d: string) => format(parseISO(d + "T00:00"), "EEEE, dd 'de' MMMM", { locale: ptBR });
const diaCurto = (d: string) => format(parseISO(d + "T00:00"), "dd/MM", { locale: ptBR });

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9.5, color: "#0f172a", fontFamily: "Helvetica", lineHeight: 1.4 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: `2 solid ${PRIMARY}`, paddingBottom: 8, marginBottom: 4 },
  empresa: { fontSize: 13, fontFamily: "Helvetica-Bold", color: PRIMARY },
  muted: { fontSize: 8, color: "#64748b" },
  titulo: { fontSize: 15, fontFamily: "Helvetica-Bold", color: PRIMARY, textAlign: "right" },
  resumo: { flexDirection: "row", gap: 14, marginTop: 6, marginBottom: 10 },
  resumoItem: { fontSize: 9, color: "#334155" },
  b: { fontFamily: "Helvetica-Bold" },
  dia: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#ffffff", backgroundColor: PRIMARY, padding: "4 8", borderRadius: 3, marginTop: 10, marginBottom: 4, textTransform: "capitalize" },
  evento: { border: "0.5 solid #e2e8f0", borderRadius: 4, padding: 7, marginBottom: 5 },
  linha1: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  cliente: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  hora: { fontSize: 10, fontFamily: "Helvetica-Bold", color: PRIMARY },
  info: { fontSize: 9, color: "#334155", marginBottom: 1 },
  itens: { fontSize: 9, color: "#0f172a", marginTop: 2 },
  badges: { flexDirection: "row", gap: 6, marginTop: 3 },
  badge: { fontSize: 8, color: "#475569", backgroundColor: "#f1f5f9", padding: "2 5", borderRadius: 3 },
  aReceber: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#b45309", backgroundColor: "#fef3c7", padding: "2 5", borderRadius: 3 },
  quitado: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#047857", backgroundColor: "#d1fae5", padding: "2 5", borderRadius: 3 },
  vazio: { fontSize: 10, color: "#64748b", marginTop: 14, textAlign: "center" },
  footer: { position: "absolute", bottom: 22, left: 36, right: 36, fontSize: 7.5, color: "#94a3b8", textAlign: "center" },
});

function EventoBloco({ ev, marcaInicio }: { ev: EventoProgramacao; marcaInicio?: boolean }) {
  const fin = statusInfo(PEDIDO_FIN, ev.statusFinanceiro);
  const op = statusInfo(PEDIDO_OP, ev.statusOperacional);
  const multiDia = ev.diarias > 1;
  return (
    <View style={s.evento} wrap={false}>
      <View style={s.linha1}>
        <Text style={s.cliente}>
          #{ev.numero} · {ev.clienteNome}{ev.telefone ? `  ·  ${ev.telefone}` : ""}
        </Text>
        <Text style={s.hora}>
          {ev.horaEntrega || "—"} → {ev.horaRetirada || "—"}
          {multiDia ? `  (${ev.diarias} diárias${marcaInicio ? `, até ${diaCurto(ev.dataFim)}` : ""})` : ""}
        </Text>
      </View>
      {ev.local || ev.enderecoLinha ? (
        <Text style={s.info}>
          {[ev.local, ev.enderecoLinha].filter(Boolean).join(" — ")}
          {ev.referencia ? `  (ref.: ${ev.referencia})` : ""}
        </Text>
      ) : null}
      {ev.itens ? <Text style={s.itens}>{ev.itens}</Text> : null}
      <View style={s.badges}>
        <Text style={s.badge}>{op.label}</Text>
        {ev.valorRestante > 0 ? (
          <Text style={s.aReceber}>RECEBER {brl(ev.valorRestante)} ({fin.label})</Text>
        ) : (
          <Text style={s.quitado}>QUITADO · {brl(ev.total)}</Text>
        )}
      </View>
    </View>
  );
}

export function ProgramacaoDoc({ empresa, prog }: { empresa: Empresa; prog: Programacao }) {
  const periodo =
    prog.de === prog.ate
      ? diaExt(prog.de)
      : `${format(parseISO(prog.de + "T00:00"), "dd/MM/yyyy")} a ${format(parseISO(prog.ate + "T00:00"), "dd/MM/yyyy")}`;
  return (
    <Document title={`Programação ${prog.de} a ${prog.ate}`}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {empresa.logoUrl ? (
              <Image src={empresa.logoUrl} style={{ width: 38, height: 38, objectFit: "contain", marginRight: 8 }} />
            ) : null}
            <View>
              <Text style={s.empresa}>{empresa.nome}</Text>
              <Text style={s.muted}>{[empresa.telefone, empresa.cidade].filter(Boolean).join(" · ")}</Text>
            </View>
          </View>
          <View>
            <Text style={s.titulo}>PROGRAMAÇÃO DE EVENTOS</Text>
            <Text style={[s.muted, { textAlign: "right", textTransform: "capitalize" }]}>{periodo}</Text>
          </View>
        </View>

        <View style={s.resumo}>
          <Text style={s.resumoItem}><Text style={s.b}>{prog.totalEventos}</Text> evento(s) no período</Text>
          <Text style={s.resumoItem}>A receber no período: <Text style={s.b}>{brl(prog.totalAReceber)}</Text></Text>
        </View>

        {prog.totalEventos === 0 ? (
          <Text style={s.vazio}>Nenhum evento agendado neste período.</Text>
        ) : null}

        {prog.emAndamento.length > 0 ? (
          <>
            <Text style={s.dia}>Em andamento (começaram antes do período)</Text>
            {prog.emAndamento.map((ev) => (
              <EventoBloco key={ev.pedidoId} ev={ev} />
            ))}
          </>
        ) : null}

        {prog.porDia.map(({ dia, eventos }) => (
          <View key={dia}>
            <Text style={s.dia}>{diaExt(dia)}</Text>
            {eventos.map((ev) => (
              <EventoBloco key={ev.pedidoId} ev={ev} marcaInicio />
            ))}
          </View>
        ))}

        <Text style={s.footer} fixed>
          Gerado por FesFlow — do pedido à devolução, tudo flui.
        </Text>
      </Page>
    </Document>
  );
}
