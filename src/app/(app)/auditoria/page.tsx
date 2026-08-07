import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ScrollText } from "lucide-react";
import { podeGerir } from "@/lib/rbac";
import { listAuditoria, ACAO_LABEL } from "@/lib/data/auditoria";

export default async function AuditoriaPage() {
  if (!(await podeGerir())) redirect("/dashboard");
  const linhas = await listAuditoria();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Auditoria</h1>
        <p className="text-sm text-muted">
          Registro dos eventos sensíveis (acesso, pagamentos e exclusões). Últimos 100.
        </p>
      </div>

      {linhas.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-primary-soft text-primary mb-3">
            <ScrollText size={26} />
          </span>
          <p className="font-medium">Nenhum registro ainda</p>
          <p className="text-sm text-muted mt-1">
            Ações sensíveis (pagamento, exclusão, acesso) aparecem aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium px-4 py-3">Quando</th>
                  <th className="font-medium px-4 py-3">Ação</th>
                  <th className="font-medium px-4 py-3">Por</th>
                  <th className="font-medium px-4 py-3">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted whitespace-nowrap tabular-nums">
                      {format(parseISO(l.criadoEm), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="px-4 py-3 font-medium">{ACAO_LABEL[l.acao] ?? l.acao}</td>
                    <td className="px-4 py-3">{l.usuarioNome}</td>
                    <td className="px-4 py-3 text-muted max-w-[22rem] truncate" title={l.dados}>{l.dados || "—"}</td>
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
