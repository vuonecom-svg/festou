import { redirect } from "next/navigation";
import { Building2, CheckCircle2, Clock, TrendingUp, UserX, MoonStar } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatBRL } from "@/lib/utils";
import { ehSuperAdmin } from "@/lib/superadmin";
import { listarClientesAdmin } from "@/lib/data/admin-clientes";
import { ClientesAdminTable } from "@/components/clientes-admin-table";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  if (!(await ehSuperAdmin())) redirect("/dashboard");

  const clientes = await listarClientesAdmin();
  const agora = Date.now();
  const total = clientes.length;
  const ativos = clientes.filter((c) => c.status === "ativa").length;
  const trial = clientes.filter((c) => c.status === "trial").length;
  const semLogin = clientes.filter((c) => !c.temLogin).length;
  const faturamento = clientes.reduce((s, c) => s + c.faturamento, 0);
  const inativos = clientes.filter(
    (c) => c.temLogin && (!c.ultimoAcesso || (agora - new Date(c.ultimoAcesso).getTime()) / 86400000 > 14)
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Super Admin — Clientes</h1>
        <p className="text-sm text-muted">Visão de todos os clientes da plataforma, atividade e suporte.</p>
      </div>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-6">
        <StatCard label="Clientes" value={total} icon={Building2} />
        <StatCard label="Assinantes ativos" value={ativos} icon={CheckCircle2} tone="success" />
        <StatCard label="Em trial" value={trial} icon={Clock} tone="info" />
        <StatCard label="Faturam. dos clientes" value={formatBRL(faturamento)} icon={TrendingUp} tone="success" />
        <StatCard label="Sem 1º acesso" value={semLogin} hint="pagaram e não entraram" icon={UserX} tone="warning" />
        <StatCard label="Inativos +14 dias" value={inativos} icon={MoonStar} tone="warning" />
      </section>

      <ClientesAdminTable clientes={clientes} />
    </div>
  );
}
