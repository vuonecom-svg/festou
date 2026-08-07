# FIX_PROGRESS — Correções pós-auditoria (FesFlow)

Engenheiro líder: correções em ciclos, com validação real (typecheck + build) a cada ciclo.
Base: relatórios de auditoria (segurança, backend/DB, frontend) de 10/07/2026.

## Backlog priorizado

### P0 — impede rodar / segurança / dados / auth / pagamentos
- [x] **C-1 RLS tabelas-filhas** (vazamento cross-tenant via PostgREST) — corrigido ao vivo + persistido em `001` (commit `30fece6`).
- [x] **AUTH em produção fail-closed** — auth sempre ligado em prod (não depende só da flag).

### P1 — bugs importantes / regras incompletas / segurança média
- [x] Open-redirect por `\` no login
- [x] Headers de segurança (clickjacking/sniffing/HSTS/referrer)
- [x] Upload: bloquear SVG (allowlist raster) + validação
- [x] Resolução de usuário determinística (prioriza authUserId)
- [x] `server-only` em admin/upload
- [ ] Uploads em actions com try/catch → `?erro=` (não perder formulário)
- [ ] `registrarPagamento`: validar valor>0 + gravar linha em `Pagamento`
- [ ] Race de `numero`/`codigoInterno`: retry em unique violation
- [ ] `reagendarPedido` / `deleteBrinquedo`: erros amigáveis
- [ ] `createOrcamento`: validar desconto/taxas >= 0

### P2 — dívida técnica / UX / performance / testes
- [ ] `loading.tsx` nas rotas pesadas
- [ ] Empty-state da agenda
- [ ] `aria-label` em botões só-ícone
- [ ] Índices em FKs quentes (schema + prod)
- [ ] `orcamentoStats` via `count()`
- [ ] Suíte mínima de testes (Vitest): disponibilidade, preço, financeiro, webhook
- [ ] Lint errors (`set-state-in-effect`)

### P3 — futuro (documentado, não bloqueante)
- [ ] `prisma migrate` versionado (hoje: `db push` + SQL manual)
- [ ] RBAC por `papel`; billing/limites aplicados; `AuditLog`
- [ ] Paginação nas listas
- [ ] Upgrade de deps (npm audit)
- [ ] Módulo Rotas; onboarding pós-pagamento

---

## Ciclos

### Ciclo 1 — Segurança ✅ (typecheck+build OK)
- `src/lib/auth-flag.ts` (novo): `authAtivo()` = flag OU `NODE_ENV=production`. Em prod, auth é sempre exigido (fecha o "modo demo aberto" acidental).
- `tenant.ts`, `access-check.ts`, `proxy.ts`: usam `authAtivo()`; **resolução de usuário determinística** (authUserId primeiro, e-mail só fallback).
- `entrar/actions.ts`: open-redirect fecha `\` (`/^\/(?![/\\])/`).
- `next.config.ts`: headers de segurança (X-Frame-Options DENY, nosniff, HSTS, Referrer-Policy, Permissions-Policy). CSP fica para depois.
- `upload.ts`: allowlist raster (bloqueia SVG) + `import "server-only"`. `supabase/admin.ts`: `server-only`.

### Ciclo 2 — Financeiro + robustez ✅ (typecheck+build OK)
- `registrarPagamento`: valida `valor>0`, nunca passa do total, e **grava linha em `Pagamento`** (tipo/forma/status/pagoEm) em transação junto com o agregado. Form de pagamento ganhou select de forma.
- `converterEmPedido` e `createOrcamento`: **retry em unique violation** (P2002) na geração de número (recomputa) — elimina 500 em corrida; overbooking (23P01) continua com msg amigável.
- `createOrcamento`: sanitiza desconto/taxas (>=0, desconto<=subtotal).
- `createBrinquedo`: retry de código auto-gerado; msg amigável em código duplicado.
- `deleteBrinquedo`: bloqueio amigável se há reservas (não crasha).
- `reagendarPedido`: conflito da constraint em corrida vira msg amigável (não 23P01 cru).
- Uploads (brinquedo/config) em try/catch → `?erro=` + banner nas telas (não perde na `error.tsx`).
