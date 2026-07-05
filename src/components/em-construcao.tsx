import { Hammer, type LucideIcon } from "lucide-react";

export function EmConstrucao({
  titulo,
  descricao,
  icon: Icon = Hammer,
}: {
  titulo: string;
  descricao: string;
  fase?: string; // aceito por compatibilidade; não exibido
  icon?: LucideIcon;
}) {
  return (
    <div className="card p-10 max-w-2xl mx-auto text-center">
      <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-4">
        <Icon size={26} />
      </span>
      <span className="inline-block text-[11px] font-semibold uppercase tracking-wide rounded-full bg-primary-soft text-primary px-3 py-1 mb-3">
        🚧 Em breve
      </span>
      <h2 className="text-xl font-semibold">{titulo}</h2>
      <p className="text-muted mt-2">{descricao}</p>
      <p className="text-sm text-muted/80 mt-4">
        Estamos preparando este módulo. Enquanto isso, aproveite tudo que já está pronto no menu. 🎈
      </p>
    </div>
  );
}
