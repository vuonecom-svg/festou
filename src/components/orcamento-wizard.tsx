"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Plus, Minus, Package } from "lucide-react";
import { verificarDisponibilidade, type ReservaLike } from "@/lib/disponibilidade";
import { Field, SectionTitle, inputClass, textareaClass } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatBRL } from "@/lib/utils";

const TRANSPORTE = 45;

type BrinquedoW = {
  id: string;
  nome: string;
  valorDiaria: number;
  valorPromocional: number | null;
  tempoMontagemMin: number;
  tempoDesmontagemMin: number;
  tempoLimpezaMin: number;
};

type ClienteW = { id: string; nome: string; cidade: string };

const TIPOS_LOCAL = ["Casa", "Salão", "Chácara", "Escola", "Condomínio", "Igreja", "Empresa", "Espaço de festa"];
const FORMAS = ["Pix", "Dinheiro", "Cartão", "Boleto", "Transferência"];

export function OrcamentoWizard({
  action,
  clientes,
  brinquedos,
  reservas,
}: {
  action: (fd: FormData) => void | Promise<void>;
  clientes: ClienteW[];
  brinquedos: BrinquedoW[];
  reservas: (ReservaLike & { clienteNome: string; cidade: string })[];
}) {
  const [clienteId, setClienteId] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");
  const [horaRetirada, setHoraRetirada] = useState("");
  const [endereco, setEndereco] = useState({
    nomeLocal: "", tipoLocal: "Casa", rua: "", numero: "", bairro: "", cidade: "", complemento: "", referencia: "",
  });
  const [sel, setSel] = useState<Record<string, number>>({});
  const [desconto, setDesconto] = useState(0);
  const [motivoDesconto, setMotivoDesconto] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [taxaMontagem, setTaxaMontagem] = useState(0);
  const [valorSinal, setValorSinal] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [obs, setObs] = useState("");

  const preco = (b: BrinquedoW) => Number(b.valorPromocional ?? b.valorDiaria);

  // janela válida?
  const janela = useMemo(() => {
    if (!dataEvento || !horaEntrega || !horaRetirada) return null;
    const ini = new Date(`${dataEvento}T${horaEntrega}`);
    const fim = new Date(`${dataEvento}T${horaRetirada}`);
    if (isNaN(ini.getTime()) || isNaN(fim.getTime()) || fim <= ini) return null;
    return { ini, fim };
  }, [dataEvento, horaEntrega, horaRetirada]);

  // disponibilidade por brinquedo na janela
  const dispMap = useMemo(() => {
    const map: Record<string, { disponivel: boolean; conflito?: string }> = {};
    if (!janela) return map;
    for (const b of brinquedos) {
      const r = verificarDisponibilidade(
        b.id, janela.ini, janela.fim,
        { transporteMin: TRANSPORTE, montagemMin: b.tempoMontagemMin, desmontagemMin: b.tempoDesmontagemMin, limpezaMin: b.tempoLimpezaMin },
        reservas
      );
      const c = r.conflitos[0] as (typeof reservas)[number] | undefined;
      map[b.id] = { disponivel: r.disponivel, conflito: c ? `${c.clienteNome} · ${c.cidade}` : undefined };
    }
    return map;
  }, [janela, brinquedos, reservas]);

  const itensSel = Object.entries(sel).filter(([, q]) => q > 0);
  const subtotal = itensSel.reduce((s, [id, q]) => {
    const b = brinquedos.find((x) => x.id === id);
    return s + (b ? preco(b) * q : 0);
  }, 0);
  const total = Math.max(0, subtotal - desconto + taxaEntrega + taxaMontagem);
  const restante = Math.max(0, total - valorSinal);

  function setQtd(id: string, delta: number) {
    setSel((prev) => {
      const atual = prev[id] ?? 0;
      const novo = Math.max(0, atual + delta);
      const cp = { ...prev };
      if (novo === 0) delete cp[id];
      else cp[id] = novo;
      return cp;
    });
  }

  function onClienteChange(id: string) {
    setClienteId(id);
    const c = clientes.find((x) => x.id === id);
    if (c && !endereco.cidade) setEndereco((e) => ({ ...e, cidade: c.cidade }));
  }

  const payload = JSON.stringify({
    clienteId, dataEvento, horaEntrega, horaRetirada, endereco,
    itens: itensSel.map(([brinquedoId, qtd]) => {
      const b = brinquedos.find((x) => x.id === brinquedoId)!;
      return { brinquedoId, qtd, valorUnit: preco(b) };
    }),
    desconto, motivoDesconto, taxaEntrega, taxaMontagem, valorSinal, formaPagamento, obs,
  });

  const podeEnviar = clienteId && itensSel.length > 0 && dataEvento;

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-3 items-start">
      <input type="hidden" name="payload" value={payload} />

      <div className="lg:col-span-2 space-y-5">
        {/* Cliente + data */}
        <div className="card p-5">
          <SectionTitle>Cliente e data do evento</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente" htmlFor="cliente" className="sm:col-span-2">
              <select id="cliente" value={clienteId} onChange={(e) => onClienteChange(e.target.value)} className={inputClass} required>
                <option value="">Selecione…</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </Field>
            <Field label="Data do evento" htmlFor="data">
              <input id="data" type="date" value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} className={inputClass} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entrega" htmlFor="hEntrega">
                <input id="hEntrega" type="time" value={horaEntrega} onChange={(e) => setHoraEntrega(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Retirada" htmlFor="hRetirada">
                <input id="hRetirada" type="time" value={horaRetirada} onChange={(e) => setHoraRetirada(e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>
        </div>

        {/* Endereço do evento */}
        <div className="card p-5">
          <SectionTitle>Endereço do evento</SectionTitle>
          <p className="text-xs text-muted -mt-2 mb-3">Onde a festa vai acontecer (pode ser diferente do endereço do cliente).</p>
          <div className="grid gap-4 sm:grid-cols-6">
            <Field label="Nome do local" htmlFor="nomeLocal" className="sm:col-span-4">
              <input id="nomeLocal" value={endereco.nomeLocal} onChange={(e) => setEndereco({ ...endereco, nomeLocal: e.target.value })} className={inputClass} placeholder="Salão Festa Boa" />
            </Field>
            <Field label="Tipo" htmlFor="tipoLocal" className="sm:col-span-2">
              <select id="tipoLocal" value={endereco.tipoLocal} onChange={(e) => setEndereco({ ...endereco, tipoLocal: e.target.value })} className={inputClass}>
                {TIPOS_LOCAL.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Rua" htmlFor="rua" className="sm:col-span-4">
              <input id="rua" value={endereco.rua} onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Número" htmlFor="numeroEv" className="sm:col-span-2">
              <input id="numeroEv" value={endereco.numero} onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Bairro" htmlFor="bairroEv" className="sm:col-span-2">
              <input id="bairroEv" value={endereco.bairro} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Cidade" htmlFor="cidadeEv" className="sm:col-span-2">
              <input id="cidadeEv" value={endereco.cidade} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Ponto de referência" htmlFor="ref" className="sm:col-span-2">
              <input id="ref" value={endereco.referencia} onChange={(e) => setEndereco({ ...endereco, referencia: e.target.value })} className={inputClass} />
            </Field>
          </div>
        </div>

        {/* Brinquedos com disponibilidade */}
        <div className="card p-5">
          <SectionTitle>Brinquedos</SectionTitle>
          {!janela && (
            <p className="text-sm text-amber-600 mb-3">
              Informe data, entrega e retirada para checar a disponibilidade de cada brinquedo.
            </p>
          )}
          <div className="space-y-2">
            {brinquedos.map((b) => {
              const disp = dispMap[b.id];
              const qtd = sel[b.id] ?? 0;
              return (
                <div key={b.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary-soft text-primary shrink-0">
                    <Package size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{b.nome}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted">{formatBRL(preco(b))} / diária</span>
                      {janela && disp && (
                        disp.disponivel ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 size={12} /> Livre
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600">
                            <XCircle size={12} /> Ocupado{disp.conflito ? ` — ${disp.conflito}` : ""}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {qtd === 0 ? (
                    <button type="button" onClick={() => setQtd(b.id, 1)}
                      className="h-9 px-3 rounded-lg text-sm border border-border hover:bg-background inline-flex items-center gap-1">
                      <Plus size={14} /> Adicionar
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => setQtd(b.id, -1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-background">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums font-medium">{qtd}</span>
                      <button type="button" onClick={() => setQtd(b.id, 1)} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-background">
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Observações */}
        <div className="card p-5">
          <SectionTitle>Observações</SectionTitle>
          <textarea value={obs} onChange={(e) => setObs(e.target.value)} className={textareaClass} placeholder="Combinações, pedidos especiais…" />
        </div>
      </div>

      {/* Resumo (sticky) */}
      <div className="lg:sticky lg:top-0 space-y-4">
        <div className="card p-5">
          <SectionTitle>Valores</SectionTitle>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Desconto (R$)" htmlFor="desc">
                <input id="desc" type="number" min="0" step="0.01" value={desconto || ""} onChange={(e) => setDesconto(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Taxa entrega (R$)" htmlFor="txEnt">
                <input id="txEnt" type="number" min="0" step="0.01" value={taxaEntrega || ""} onChange={(e) => setTaxaEntrega(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Taxa montagem (R$)" htmlFor="txMont">
                <input id="txMont" type="number" min="0" step="0.01" value={taxaMontagem || ""} onChange={(e) => setTaxaMontagem(Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Sinal (R$)" htmlFor="sinal">
                <input id="sinal" type="number" min="0" step="0.01" value={valorSinal || ""} onChange={(e) => setValorSinal(Number(e.target.value))} className={inputClass} />
              </Field>
            </div>
            {desconto > 0 && (
              <Field label="Motivo do desconto" htmlFor="motivo">
                <input id="motivo" value={motivoDesconto} onChange={(e) => setMotivoDesconto(e.target.value)} className={inputClass} placeholder="Cliente recorrente…" />
              </Field>
            )}
            <Field label="Forma de pagamento" htmlFor="forma">
              <select id="forma" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} className={inputClass}>
                {FORMAS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
          </div>

          <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
            <Row label={`Subtotal (${itensSel.length} ${itensSel.length === 1 ? "item" : "itens"})`} value={subtotal} />
            {desconto > 0 && <Row label="Desconto" value={-desconto} />}
            {taxaEntrega > 0 && <Row label="Taxa entrega" value={taxaEntrega} />}
            {taxaMontagem > 0 && <Row label="Taxa montagem" value={taxaMontagem} />}
            <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border">
              <span>Total</span><span>{formatBRL(total)}</span>
            </div>
            <Row label="Sinal" value={valorSinal} muted />
            <div className="flex justify-between font-medium text-primary">
              <span>Restante</span><span>{formatBRL(restante)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <SubmitButton className="w-full" disabled={!podeEnviar}>Criar orçamento</SubmitButton>
            {!podeEnviar && (
              <p className="text-xs text-muted text-center">Selecione cliente, data e ao menos um brinquedo.</p>
            )}
            <Link href="/orcamentos" className="block text-center text-sm text-muted hover:text-foreground">Cancelar</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className={"flex justify-between " + (muted ? "text-muted" : "")}>
      <span>{label}</span>
      <span className="tabular-nums">{formatBRL(value)}</span>
    </div>
  );
}
