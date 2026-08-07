-- Config sensível do app (ex.: SENDGRID_API_KEY) lida em runtime pelo Prisma
-- (owner), sem depender de env var no host. RLS ligado SEM policy => nenhum
-- cliente anon/authenticated lê; só o owner (Prisma) enxerga.
create table if not exists app_config (
  chave text primary key,
  valor text not null,
  atualizado_em timestamptz not null default now()
);

alter table app_config enable row level security;
