import { Boxes, Trash2, Plus } from "lucide-react";
import { inputClass } from "@/components/ui/form";
import { formatBRL } from "@/lib/utils";
import { listCombos } from "@/lib/data/combos";
import { createComboAction, deleteComboAction } from "./actions";

export default async function CombosPage() {
  const combos = await listCombos();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Combos</h1>
        <p className="text-sm text-muted">Pacotes com preço fechado para acelerar seus orçamentos.</p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-3">Novo combo</h2>
        <form action={createComboAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-xs text-muted mb-1">Nome</label>
            <input name="nome" required className={inputClass} placeholder="Combo Festa Completa" />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs text-muted mb-1">Descrição</label>
            <input name="descricao" className={inputClass} placeholder="Pula-pula + piscina de bolinha + cama elástica" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">Valor (R$)</label>
              <input name="valor" type="number" step="0.01" min="0" className={inputClass} />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-primary-fg font-medium hover:bg-primary/90 self-end">
              <Plus size={16} />
            </button>
          </div>
        </form>
      </div>

      {combos.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3"><Boxes size={26} /></span>
          <p className="font-medium">Nenhum combo ainda</p>
          <p className="text-sm text-muted mt-1">Crie pacotes para oferecer mais valor e fechar orçamentos mais rápido.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((c) => {
            const remover = deleteComboAction.bind(null, c.id);
            return (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary-soft text-primary"><Boxes size={18} /></span>
                    <p className="font-medium">{c.nome}</p>
                  </div>
                  <form action={remover}>
                    <button className="text-rose-400 hover:text-rose-600" aria-label="Excluir"><Trash2 size={15} /></button>
                  </form>
                </div>
                {c.descricao && <p className="text-sm text-muted mt-2">{c.descricao}</p>}
                <p className="text-2xl font-bold mt-3">{formatBRL(c.valor)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
