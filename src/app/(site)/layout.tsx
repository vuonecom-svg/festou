import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark size={32} />
            <span className="font-semibold text-lg tracking-wide">FesFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
            <Link href="/#funcionalidades" className="hover:text-foreground">Funcionalidades</Link>
            <Link href="/#precos" className="hover:text-foreground">Preços</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard" className="text-sm font-medium px-3 h-9 inline-flex items-center rounded-lg hover:bg-background">
              Entrar
            </Link>
            <Link href="/dashboard" className="text-sm font-medium px-4 h-9 inline-flex items-center rounded-lg bg-primary text-primary-fg hover:bg-primary/90">
              Testar grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BrandMark size={28} />
              <span className="font-semibold">FesFlow</span>
            </div>
            <p className="text-muted">Agenda inteligente para locações de festa. Do pedido à devolução, tudo flui.</p>
          </div>
          <div>
            <p className="font-medium mb-2">Produto</p>
            <ul className="space-y-1.5 text-muted">
              <li><Link href="/#funcionalidades" className="hover:text-foreground">Funcionalidades</Link></li>
              <li><Link href="/#precos" className="hover:text-foreground">Preços</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Entrar na plataforma</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Conteúdo</p>
            <ul className="space-y-1.5 text-muted">
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">Perguntas frequentes</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Comece agora</p>
            <p className="text-muted mb-2">30 dias grátis para testar.</p>
            <Link href="/dashboard" className="inline-flex items-center rounded-lg bg-primary text-primary-fg px-4 h-9 font-medium hover:bg-primary/90">
              Testar grátis
            </Link>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted flex flex-wrap justify-between gap-2">
            <span>© 2026 FesFlow. Todos os direitos reservados.</span>
            <span>Feitas para quem faz momentos acontecerem 🎈</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
