import { HardHat, Truck, Trash2, Plus, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { inputClass } from "@/components/ui/form";
import { listFuncionarios, listVeiculos, FUNCAO } from "@/lib/data/equipe";
import {
  createFuncionarioAction, deleteFuncionarioAction, createVeiculoAction, deleteVeiculoAction,
} from "./actions";

export default async function EquipePage() {
  const [funcionarios, veiculos] = await Promise.all([listFuncionarios(), listVeiculos()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Equipe e logística</h1>
        <p className="text-sm text-muted">Montadores, motoristas e veículos usados nas entregas e retiradas.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Funcionários */}
        <div className="space-y-3">
          <div className="card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><HardHat size={18} className="text-primary" /> Funcionários</h2>
            <form action={createFuncionarioAction} className="grid gap-3 sm:grid-cols-4 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted mb-1">Nome</label>
                <input name="nome" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Função</label>
                <select name="funcao" className={inputClass} defaultValue="ajudante">
                  {Object.entries(FUNCAO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-muted mb-1">Telefone</label>
                  <input name="telefone" className={inputClass} />
                </div>
                <button className="rounded-lg h-10 px-3 bg-primary text-primary-fg font-medium hover:bg-primary/90 self-end"><Plus size={16} /></button>
              </div>
            </form>
          </div>

          {funcionarios.length === 0 ? (
            <div className="card p-6 text-center text-sm text-muted">Nenhum funcionário cadastrado.</div>
          ) : (
            <div className="card divide-y divide-border">
              {funcionarios.map((f) => {
                const remover = deleteFuncionarioAction.bind(null, f.id);
                return (
                  <div key={f.id} className="flex items-center gap-3 p-3.5">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary-soft text-primary shrink-0"><HardHat size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{f.nome}</p>
                      <p className="text-xs text-muted flex items-center gap-2">
                        <Badge className="bg-slate-100 text-slate-600">{FUNCAO[f.funcao]}</Badge>
                        {f.telefone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {f.telefone}</span>}
                      </p>
                    </div>
                    <form action={remover}>
                      <button className="text-rose-400 hover:text-rose-600 p-1" aria-label="Excluir"><Trash2 size={15} /></button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Veículos */}
        <div className="space-y-3">
          <div className="card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Truck size={18} className="text-primary" /> Veículos</h2>
            <form action={createVeiculoAction} className="grid gap-3 sm:grid-cols-4 items-end">
              <div>
                <label className="block text-xs text-muted mb-1">Placa</label>
                <input name="placa" className={inputClass} placeholder="ABC-1D23" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Modelo</label>
                <input name="modelo" className={inputClass} placeholder="Fiorino" />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <div className="flex-1">
                  <label className="block text-xs text-muted mb-1">Capacidade</label>
                  <input name="capacidade" className={inputClass} placeholder="Ex.: 2 pula-pulas" />
                </div>
                <button className="rounded-lg h-10 px-3 bg-primary text-primary-fg font-medium hover:bg-primary/90 self-end"><Plus size={16} /></button>
              </div>
            </form>
          </div>

          {veiculos.length === 0 ? (
            <div className="card p-6 text-center text-sm text-muted">Nenhum veículo cadastrado.</div>
          ) : (
            <div className="card divide-y divide-border">
              {veiculos.map((v) => {
                const remover = deleteVeiculoAction.bind(null, v.id);
                return (
                  <div key={v.id} className="flex items-center gap-3 p-3.5">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary-soft text-primary shrink-0"><Truck size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{v.modelo || "Veículo"} {v.placa && <span className="text-muted font-normal">· {v.placa}</span>}</p>
                      {v.capacidade && <p className="text-xs text-muted">{v.capacidade}</p>}
                    </div>
                    <form action={remover}>
                      <button className="text-rose-400 hover:text-rose-600 p-1" aria-label="Excluir"><Trash2 size={15} /></button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
