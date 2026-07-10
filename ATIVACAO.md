# 🚀 Ativar o acesso automático (pagamento → login) do FesFlow

O código já está pronto. Para **ligar** o fluxo "pagou → recebe acesso; parou de pagar → bloqueia",
faça os passos abaixo (são nas suas contas — Kiwify, Supabase, Vercel).

## 1. Supabase
**Settings → API** — copie:
- `anon` (public)
- `service_role` (secreta)

**Authentication → URL Configuration → Redirect URLs** — adicione:
```
https://fesflow.com.br/definir-senha
```

**Authentication → Emails / SMTP** — configure um remetente SMTP (o e-mail padrão do
Supabase tem limite baixo; para produção use Resend, SendGrid, Amazon SES, etc.).

## 2. Kiwify
- Crie **3 assinaturas** (cartão, Pix, boleto):
  - Mensal — 1ª cobrança R$ 5,00, depois R$ 44,90/mês · Semestral R$ 239,40 · Anual R$ 358,80
- **Configurações → Webhooks → Adicionar webhook**:
  - URL: `https://fesflow.com.br/api/webhooks/kiwify`
  - Eventos: compra aprovada, assinatura renovada, reembolso, cancelamento, chargeback
  - Copie o **token do webhook**.
- Copie os **3 links de checkout** e cole em `src/lib/site-content.ts` → `KIWIFY`
  (ou me mande que eu ligo os botões).

## 3. Vercel — Settings → Environment Variables (Production)
```
NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon do passo 1>
SUPABASE_SERVICE_ROLE_KEY     = <service_role do passo 1>
NEXT_PUBLIC_APP_URL           = https://fesflow.com.br
KIWIFY_WEBHOOK_TOKEN          = <token do passo 2>
AUTH_ENABLED                  = true
```
Depois: **Redeploy**.

## Como funciona
```
compra aprovada (Kiwify) → webhook /api/webhooks/kiwify
  → cria empresa + usuário do cliente + convite por e-mail ("crie sua senha")
  → cliente acessa /entrar e usa a plataforma
cancelamento/reembolso/atraso → webhook → acesso bloqueado (/acesso-bloqueado)
```

> Enquanto `AUTH_ENABLED` != "true", o site fica **aberto** (modo demo) e nada é bloqueado.
