-- Onboarding por nicho: campos aditivos (nullable) na empresa. Seguro p/ produção
-- (o código de produção não lê essas colunas até o merge).
alter table empresa add column if not exists nicho text;
alter table empresa add column if not exists perfil_negocio jsonb;
alter table empresa add column if not exists onboarding_em timestamptz;
