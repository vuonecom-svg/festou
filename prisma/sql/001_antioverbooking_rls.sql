-- ============================================================
-- FesFlow — Migração manual 001
-- (1) Anti-overbooking físico no banco (btree_gist EXCLUDE)
-- (2) RLS multi-tenant por empresa_id
-- ------------------------------------------------------------
-- Rode DEPOIS de `prisma db push` / `prisma migrate deploy`.
-- No Supabase: cole no SQL Editor, ou aplique via MCP/CLI.
-- ============================================================

-- ── (1) ANTI-OVERBOOKING ────────────────────────────────────
-- Um mesmo brinquedo NUNCA pode ter duas reservas cujas janelas
-- (já com buffers de transporte/montagem/limpeza) se sobreponham.
-- A janela [janela_inicio, janela_fim) é um range meio-aberto:
-- fim de uma locação encostando no início da próxima NÃO conflita.
create extension if not exists btree_gist;

alter table reserva_item
  add constraint reserva_item_sem_overbooking
  exclude using gist (
    brinquedo_id with =,
    tsrange(janela_inicio, janela_fim, '[)') with &&
  );

-- Índice GiST para acelerar a checagem de disponibilidade ao vivo.
create index if not exists reserva_item_janela_gist
  on reserva_item using gist (
    brinquedo_id,
    tsrange(janela_inicio, janela_fim, '[)')
  );

-- ── (2) RLS MULTI-TENANT ────────────────────────────────────
-- Cada usuário só enxerga dados da sua empresa. O empresa_id do
-- usuário logado vem de um claim no JWT do Supabase Auth:
--   auth.jwt() -> 'app_metadata' ->> 'empresa_id'
-- (gravado no signup/convite). Defesa em profundidade: além do
-- filtro no app, o banco recusa qualquer vazamento entre tenants.

create or replace function festou_empresa_atual()
returns text
language sql stable
as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::json
      -> 'app_metadata' ->> 'empresa_id',
    current_setting('request.jwt.claims', true)::json ->> 'empresa_id'
  );
$$;

-- Ativa RLS + política padrão (tenant isolation) em todas as
-- tabelas que possuem a coluna empresa_id.
do $$
declare
  t text;
begin
  for t in
    select table_name
    from information_schema.columns
    where table_schema = 'public'
      and column_name = 'empresa_id'
  loop
    -- ENABLE (sem FORCE): o dono das tabelas (role do Prisma/backend) NÃO é
    -- afetado pelo RLS e acessa normalmente aplicando o escopo de empresa no app.
    -- O RLS abaixo protege os acessos via PostgREST/Supabase client (anon/authenticated).
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists tenant_isolation on public.%I;', t);
    execute format($p$
      create policy tenant_isolation on public.%I
        using (empresa_id = festou_empresa_atual())
        with check (empresa_id = festou_empresa_atual());
    $p$, t);
  end loop;
end $$;

-- Observação: o backend do FesFlow acessa o banco via Prisma com a
-- connection string do Postgres (role privilegiada), então aplica o
-- escopo de empresa na aplicação. As policies RLS acima protegem os
-- acessos diretos via PostgREST/Supabase client (ex.: catálogo público,
-- app da equipe de rua) e servem como rede de segurança final.
