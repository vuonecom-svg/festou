import { Hammer, type LucideIcon } from "lucide-react";

export function EmConstrucao({
  titulo,
  descricao,
  fase = "MVP",
  icon: Icon = Hammer,
}: {
  titulo: string;
  descricao: string;
  fase?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="card p-10 max-w-2xl mx-auto text-center">
      <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-4">
        <Icon size={26} />
      </span>
      <h2 className="text-xl font-semibold">{titulo}</h2>
      <p className="text-muted mt-2">{descricao}</p>
      <span className="inline-block mt-4 text-[11px] uppercase tracking-wide rounded-full bg-slate-100 text-slate-600 px-3 py-1">
        Fase {fase}
      </span>
    </div>
  );
}
