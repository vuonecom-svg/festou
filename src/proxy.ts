import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Rotas da plataforma que exigem login (quando AUTH_ENABLED=true).
const PROTEGIDAS = [
  "/dashboard", "/agenda", "/orcamentos", "/pedidos", "/clientes", "/brinquedos",
  "/combos", "/equipe", "/rotas", "/manutencao", "/financeiro", "/crm",
  "/contratos", "/relatorios", "/configuracoes",
];

export async function proxy(req: NextRequest) {
  // Enquanto a flag estiver desligada, nada é bloqueado (site continua aberto).
  if (process.env.AUTH_ENABLED !== "true") return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  const protegida = PROTEGIDAS.some((p) => path === p || path.startsWith(p + "/"));

  if (protegida && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
