import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2, AlertCircle } from "lucide-react";
import { BrinquedoForm } from "@/components/brinquedo-form";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/confirm-button";
import { BRINQUEDO_STATUS } from "@/lib/status";
import { getBrinquedo, type BrinquedoStatus } from "@/lib/data/brinquedos";
import { updateBrinquedoAction, deleteBrinquedoAction, setStatusAction } from "../actions";

const QUICK_STATUS: BrinquedoStatus[] = [
  "disponivel",
  "alugado",
  "manutencao",
  "limpeza",
  "inativo",
];

export default async function EditarBrinquedoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const brinquedo = await getBrinquedo(id);
  if (!brinquedo) notFound();

  const st = BRINQUEDO_STATUS[brinquedo.status];
  const update = updateBrinquedoAction.bind(null, id);
  const remove = deleteBrinquedoAction.bind(null, id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/brinquedos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Brinquedos
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-xl font-semibold">{brinquedo.nome}</h1>
            <Badge className={st.badge}>{st.label}</Badge>
          </div>
          <p className="text-sm text-muted">{brinquedo.codigoInterno}</p>
        </div>

        <ConfirmButton
          action={remove}
          confirm={`Excluir "${brinquedo.nome}"? Não é possível se houver reservas na agenda.`}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <Trash2 size={16} /> Excluir
        </ConfirmButton>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      {/* Troca rápida de status */}
      <div className="card p-4">
        <p className="text-xs text-muted mb-2 uppercase tracking-wide">Mudar status rapidamente</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_STATUS.map((s) => {
            const info = BRINQUEDO_STATUS[s];
            const change = setStatusAction.bind(null, id, s);
            const atual = brinquedo.status === s;
            return (
              <form key={s} action={change}>
                <button
                  disabled={atual}
                  className={
                    "h-9 px-3 rounded-lg text-sm border transition-colors disabled:opacity-100 " +
                    (atual
                      ? info.badge + " border-transparent font-medium"
                      : "border-border bg-surface hover:bg-background text-foreground/70")
                  }
                >
                  {info.label}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <BrinquedoForm action={update} brinquedo={brinquedo} submitLabel="Salvar alterações" />
    </div>
  );
}
