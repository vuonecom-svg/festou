# 🎉 Festou

SaaS de gestão para **locadoras de brinquedos e itens de festa** (pula-pula, infláveis, cama elástica, tendas, mesas, cadeiras…).

O diferencial: **agenda inteligente que impede overbooking** — um brinquedo nunca é locado duas vezes no mesmo período, considerando os buffers de transporte, montagem, retirada e limpeza. A garantia é física, no banco (exclusion constraint), não só validação no app.

## Stack

| Camada | Tecnologia |
|---|---|
| Full-stack | Next.js 16 (App Router) + React 19 + TypeScript |
| UI | Tailwind CSS v4 |
| Banco / Auth / Storage | Supabase (Postgres + Auth + Storage + RLS) |
| ORM | Prisma 7 |

## Estrutura

```
prisma/
  schema.prisma            # 32 tabelas, multi-tenant por empresa_id
  seed.ts                  # planos + empresa demo + brinquedos
  sql/001_antioverbooking_rls.sql  # exclusion constraint + políticas RLS
src/
  app/
    (app)/                 # shell autenticado (sidebar + topbar)
      dashboard/           # cards, alertas
      agenda, orcamentos, pedidos, clientes, brinquedos, ...
  components/              # sidebar, topbar, stat-card, ...
  lib/
    prisma.ts              # client Prisma (conexão pooled)
    supabase/              # clients server/browser
    nav.ts, status.ts, utils.ts
  generated/prisma/        # client Prisma gerado
```

## Como rodar

1. **Crie um projeto no Supabase** e copie as credenciais.
2. Copie o env e preencha:
   ```bash
   cp .env.example .env
   ```
3. Instale as dependências (já feito no scaffold):
   ```bash
   npm install
   ```
4. Suba o schema no banco e depois a migração manual (anti-overbooking + RLS):
   ```bash
   npm run db:push
   # cole prisma/sql/001_antioverbooking_rls.sql no SQL Editor do Supabase
   ```
5. Popule com dados de exemplo:
   ```bash
   npm run db:seed
   ```
6. Rode o app:
   ```bash
   npm run dev
   ```
   Acesse http://localhost:3000 → redireciona para `/dashboard`.

> Sem `.env` configurado, o app abre e navega normalmente (dashboard com dados de exemplo). As telas com dados reais acendem após conectar o Supabase.

## Roadmap

- **MVP (atual):** fundação, schema, layout/menu, dashboard. Próximo: brinquedos → clientes → agenda com disponibilidade → orçamento → pedido → sinal/restante → contrato PDF.
- **V2:** equipe, rotas, app de rua, checklists, manutenção, CRM.
- **V3:** WhatsApp, bot de disponibilidade, catálogo público, assinatura digital, billing self-service.
