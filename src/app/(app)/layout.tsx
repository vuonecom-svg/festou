import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { verificarAcesso } from "@/lib/access-check";

// Páginas da plataforma são renderizadas por requisição (leem o banco).
// Evita tentar pré-renderizar no build (que exigiria o banco no build-time).
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const acesso = await verificarAcesso();
  if (!acesso.ok) {
    redirect(acesso.motivo === "bloqueado" ? "/acesso-bloqueado" : "/entrar");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
