import { Filter, Trash2, Plus, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { inputClass } from "@/components/ui/form";
import { listClientes } from "@/lib/data/clientes";
import { listLeads, ETAPAS, ORIGENS } from "@/lib/data/crm";
import { createLeadAction, setLeadEtapaAction, deleteLeadAction } from "./actions";

export default async function CrmPage() {
  const [leads, clientes] = await Promise.all([listLeads(), listClientes()]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">CRM comercial</h1>
        <p className="text-sm text-muted">Acompanhe cada atendimento do primeiro contato até o pedido confirmado.</p>
      </div>

      {/* Novo lead */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3">Novo lead</h2>
        <form action={createLeadAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div>
            <label className="block text-xs text-muted mb-1">Cliente</label>
            <select name="clienteId" required className={inputClass} defaultValue="">
              <option value="" disabled>Selecione…</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Origem</label>
            <select name="origem" className={inputClass} defaultValue="whatsapp">
              {Object.entries(ORIGENS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="lg:col-span-1 sm:col-span-2">
            <label className="block text-xs text-muted mb-1">Observação</label>
            <input name="obs" className={inputClass} placeholder="opcional" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-primary-fg font-medium hover:bg-primary/90">
            <Plus size={16} /> Adicionar
          </button>
        </form>
        {clientes.length === 0 && (
          <p className="text-xs text-muted mt-2">Cadastre um cliente primeiro para criar leads.</p>
        )}
      </div>

      {/* Funil */}
      {leads.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3"><Filter size={26} /></span>
          <p className="font-medium">Funil vazio</p>
          <p className="text-sm text-muted mt-1">Adicione leads acima para começar a acompanhar seus atendimentos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {ETAPAS.map((etapa) => {
              const doFunil = leads.filter((l) => l.etapa === etapa.key);
              return (
                <div key={etapa.key} className={`w-64 shrink-0 rounded-xl bg-surface border-t-2 ${etapa.cor} border border-border`}>
                  <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium">{etapa.label}</span>
                    <span className="text-xs text-muted">{doFunil.length}</span>
                  </div>
                  <div className="p-2 space-y-2 min-h-[60px]">
                    {doFunil.map((l) => {
                      const mover = setLeadEtapaAction.bind(null, l.id);
                      const remover = deleteLeadAction.bind(null, l.id);
                      return (
                        <div key={l.id} className="rounded-lg border border-border bg-background/50 p-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{l.clienteNome}</p>
                            <form action={remover}>
                              <button className="text-rose-400 hover:text-rose-600" aria-label="Excluir"><Trash2 size={13} /></button>
                            </form>
                          </div>
                          {l.origem && <Badge className="bg-slate-100 text-slate-600 mt-1">{ORIGENS[l.origem] ?? l.origem}</Badge>}
                          {l.obs && <p className="text-xs text-muted mt-1.5">{l.obs}</p>}
                          <form action={mover} className="mt-2 flex items-center gap-1">
                            <ArrowRightLeft size={12} className="text-muted shrink-0" />
                            <select name="etapa" defaultValue={l.etapa} className="flex-1 text-xs rounded border border-border bg-surface px-1.5 py-1 outline-none">
                              {ETAPAS.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
                            </select>
                            <button className="text-xs rounded bg-primary text-primary-fg px-2 py-1 hover:bg-primary/90">ok</button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
