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
- [x] `loading.tsx` no segmento (app)
- [x] Empty-state da agenda
- [x] `aria-label` em botões só-ícone (combos/equipe)
- [x] Índices em FKs quentes (prod + schema)
- [x] `orcamentoStats` via `count()`
- [x] Suíte mínima de testes (Vitest): disponibilidade + preço (15 testes ✅)
- [ ] Lint errors (`set-state-in-effect`) — falso-positivo do compiler; documentado
- [ ] Mais testes: financeiro (registrarPagamento), webhook HMAC (precisam mock de prisma)

### P3 — futuro (documentado, não bloqueante)
- [~] Guarda de invariantes (`npm run db:check`) protege constraint+RLS de sumir; `prisma migrate` versionado completo ainda pendente
- [x] RBAC mínimo: ações destrutivas (excluir pedido/orçamento/brinquedo) exigem admin/gerente; backfill garante 1 admin/empresa
- [x] `AuditLog` gravado (eventos de dinheiro + exclusões)
- [~] billing/limites de plano: **N/A** — produto é tier único (3 cobranças = mesmo "FesFlow Completo"); enforcar limites mudaria o escopo do produto
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

### Ciclo 3 — Performance/DB + UX ✅ (typecheck+build OK)
- `orcamentoStats`: 3× `count()` no banco (não carrega a tabela).
- Índices criados em prod + no schema: `orcamento(cliente_id, endereco_evento_id)`, `orcamento_item(brinquedo_id)`, `lead(cliente_id)`, `despesa(pedido_id)`, `manutencao(brinquedo_id)`, `combo_item(brinquedo_id)`.
- `(app)/loading.tsx` (skeleton na navegação); empty-state da agenda; `aria-label` nos botões +.

### Ciclo 4 — Testes ✅ (15 testes passando)
- Vitest instalado + scripts `test`/`test:watch`.
- `precoUnitario` extraído para `src/lib/preco.ts` (puro, testável sem Prisma).
- `src/lib/__tests__/disponibilidade.test.ts` (9) — buffers, meio-aberto, anti-overbooking por unidade, **regressão do fuso**, ignora própria reserva.
- `src/lib/__tests__/preco.test.ts` (6) — diária/promocional/período/horas.

### Ciclo 5 — Fluxo de dinheiro + invariantes + RBAC ✅ (22 testes, db:check OK)
- `src/lib/pagamento.ts` (novo, puro): `aplicarPagamento` (limita ao total, arredonda, tipo sinal/restante). `registrarPagamento` refatorado para usá-la.
- `src/lib/__tests__/pagamento.test.ts` (7) — parcial, quitação, overpay limitado, já-quitado, valor<=0, arredondamento, dados sujos.
- `scripts/check-db-invariants.mjs` + `npm run db:check`: falha se constraint anti-overbooking, RLS (7 tabelas) ou colunas de estoque sumirem. Passou contra prod.
- RBAC mínimo: `src/lib/rbac.ts` (`papelAtual`/`podeGerir`); excluir pedido/orçamento/brinquedo exigem admin/gerente. Backfill em prod garantiu 1 admin por empresa (ninguém trancado).

### Ciclo 6 — Endurecimento do webhook (dinheiro) + auditoria ✅ (44 testes)
- `src/lib/kiwify.ts` (novo, puro): `verificarAssinaturaKiwify` (HMAC-SHA1 constant-time, fail-closed) + `classificarEvento` (liberar/bloquear/ignorar, **bloqueio tem prioridade**). Webhook `route.ts` refatorado para usá-lo.
- **Correção**: `subscription_renewed` não reativava (não estava na lista) — adicionado a LIBERAM.
- `src/lib/__tests__/kiwify.test.ts` (+22): assinatura válida/inválida/adulterada/token errado/vazio; classificação de paid/approved/renewed/refunded/chargeback/canceled/late/waiting; prioridade do bloqueio.
- **AuditLog**: `src/lib/audit.ts` (`auditar`, best-effort) + `usuarioAtualId()` em rbac. Grava: provisionar/reativar/bloquear acesso (webhook), registrar_pagamento, excluir pedido/orçamento/brinquedo (com usuarioId). Nota: falta UI para VER os logs (follow-up).

## Estado final: 6 ciclos, 44 testes, build/typecheck/db:check verdes. Todos P0/P1 resolvidos; P2/P3 restantes documentados acima.
