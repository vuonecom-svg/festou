import { format, parseISO } from "date-fns";
import { Wrench, CheckCircle2, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { inputClass } from "@/components/ui/form";
import { formatBRL } from "@/lib/utils";
import { listBrinquedos } from "@/lib/data/brinquedos";
import { listManutencoes, MANUT_TIPO, MANUT_STATUS } from "@/lib/data/manutencoes";
import { abrirManutencaoAction, concluirManutencaoAction, deleteManutencaoAction } from "./actions";

export default async function ManutencaoPage() {
  const [manutencoes, brinquedos] = await Promise.all([listManutencoes(), listBrinquedos()]);
  const abertas = manutencoes.filter((m) => m.status !== "concluida");
  const historico = manutencoes.filter((m) => m.status === "concluida");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Manutenção e limpeza</h1>
        <p className="text-sm text-muted">
          Ao abrir, o brinquedo é bloqueado automaticamente na agenda. Ao concluir, ele volta a ficar disponível.
        </p>
      </div>

      {/* Abrir manutenção */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3">Abrir manutenção / limpeza</h2>
        <form action={abrirManutencaoAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs text-muted mb-1">Brinquedo</label>
            <select name="brinquedoId" required className={inputClass} defaultValue="">
              <option value="" disabled>Selecione…</option>
              {brinquedos.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Tipo</label>
            <select name="tipo" className={inputClass} defaultValue="corretiva">
              {Object.entries(MANUT_TIPO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Custo (R$)</label>
            <input name="custo" type="number" step="0.01" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Responsável</label>
            <input name="responsavel" className={inputClass} />
          </div>
          <div className="lg:col-span-4">
            <label className="block text-xs text-muted mb-1">Descrição do problema</label>
            <input name="descricao" className={inputClass} placeholder="Ex.: motor com ruído, lona rasgada…" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-primary-fg font-medium hover:bg-primary/90">
            <Plus size={16} /> Abrir
          </button>
        </form>
      </div>

      {/* Abertas */}
      <div>
        <h2 className="font-semibold mb-3">Em aberto ({abertas.length})</h2>
        {abertas.length === 0 ? (
          <div className="card p-6 text-center text-sm text-muted">Nenhuma manutenção em aberto. 👍</div>
        ) : (
          <div className="space-y-2">
            {abertas.map((m) => {
              const concluir = concluirManutencaoAction.bind(null, m.id);
              const remover = deleteManutencaoAction.bind(null, m.id);
              return (
                <div key={m.id} className="card p-4 flex items-start gap-4">
                  <span className="grid place-items-center h-10 w-10 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Wrench size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{m.brinquedoNome}</p>
                      <Badge className="bg-slate-100 text-slate-600">{MANUT_TIPO[m.tipo]}</Badge>
                      <Badge className={MANUT_STATUS[m.status].badge}>{MANUT_STATUS[m.status].label}</Badge>
                    </div>
                    {m.descricao && <p className="text-sm text-muted mt-1">{m.descricao}</p>}
                    <p className="text-xs text-muted mt-1">
                      Aberta em {format(parseISO(m.abertura), "dd/MM/yyyy")}
                      {m.responsavel ? ` · ${m.responsavel}` : ""}
                      {m.custo != null ? ` · ${formatBRL(m.custo)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <form action={concluir}>
                      <button className="inline-flex items-center gap-1.5 rounded-lg h-9 px-3 text-sm border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        <CheckCircle2 size={15} /> Concluir
                      </button>
                    </form>
                    <form action={remover}>
                      <button className="text-rose-500 hover:text-rose-700 p-2" aria-label="Excluir"><Trash2 size={15} /></button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico */}
      {historico.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Histórico</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium px-4 py-2">Brinquedo</th>
                  <th className="font-medium px-4 py-2">Tipo</th>
                  <th className="font-medium px-4 py-2">Concluída</th>
                  <th className="font-medium px-4 py-2 text-right">Custo</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">{m.brinquedoNome}</td>
                    <td className="px-4 py-2.5 text-muted">{MANUT_TIPO[m.tipo]}</td>
                    <td className="px-4 py-2.5 text-muted">{m.fechamento ? format(parseISO(m.fechamento), "dd/MM/yyyy") : "—"}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{m.custo != null ? formatBRL(m.custo) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
