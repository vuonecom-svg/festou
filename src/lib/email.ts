// Envio de e-mail DIRETO pela API do SendGrid (não depende do e-mail do Supabase).
// SERVER-ONLY. Usa SENDGRID_API_KEY; remetente já autenticado (acesso@fesflow.com.br).
import "server-only";

const FROM = { email: "acesso@fesflow.com.br", name: "FesFlow" };

export async function enviarEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    console.error("SENDGRID_API_KEY ausente — e-mail não enviado para", to);
    return false;
  }
  try {
    const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: FROM,
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!r.ok) {
      console.error("SendGrid falhou:", r.status, await r.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("Erro ao enviar e-mail (SendGrid):", (e as Error).message);
    return false;
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://fesflow.com.br";

// E-mail de boas-vindas com a marca FesFlow + senha temporária.
export async function enviarEmailBoasVindas(to: string, nome: string, senhaTemp: string): Promise<boolean> {
  const saud = nome ? `Bem-vindo(a), ${nome}!` : "Bem-vindo(a) ao FesFlow!";
  const html = `
  <div style="background:#eef2f7;padding:24px 12px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
    <div style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 24px rgba(11,27,51,.08)">
      <!-- Cabeçalho com a marca -->
      <div style="background:linear-gradient(120deg,#0b1b33 0%,#1e1b4b 55%,#2b1b4e 100%);padding:30px 28px;text-align:center">
        <div style="font-size:26px;font-weight:800;letter-spacing:-.5px;color:#ffffff">Fes<span style="color:#22d3ee">Flow</span></div>
        <div style="font-size:12px;color:#a9b6d6;margin-top:4px;letter-spacing:2px;text-transform:uppercase">Gestão para locadoras de festa</div>
      </div>

      <div style="padding:30px 28px">
        <h1 style="font-size:22px;margin:0 0 10px;color:#0b1b33">${saud} 🎉</h1>
        <p style="font-size:15px;line-height:1.65;color:#475569;margin:0 0 20px">
          Sua assinatura foi confirmada e sua conta já está ativa. Preparamos tudo para você
          organizar sua agenda, orçamentos, contratos e financeiro — sem overbooking.
        </p>

        <!-- Senha temporária -->
        <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin:6px 0 22px">
          <p style="margin:0 0 6px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Sua senha temporária</p>
          <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:2px;color:#0b1b33;font-family:'Courier New',monospace">${senhaTemp}</p>
        </div>

        <p style="font-size:15px;line-height:1.65;color:#475569;margin:0 0 22px">
          Entre com seu e-mail e essa senha. No primeiro acesso, o sistema pede para você
          <strong>criar a sua própria senha</strong>. Rapidinho. 🚀
        </p>

        <div style="text-align:center;margin:6px 0 8px">
          <a href="${APP_URL}/entrar" style="display:inline-block;background:#06b6b4;color:#052e2b;font-weight:800;text-decoration:none;padding:14px 30px;border-radius:30px;font-size:16px">
            Entrar no FesFlow
          </a>
        </div>
        <p style="text-align:center;font-size:13px;color:#94a3b8;margin:10px 0 0">
          Seu login: <strong style="color:#475569">${to}</strong>
        </p>

        <div style="border-top:1px solid #eef2f7;margin-top:26px;padding-top:16px">
          <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0">
            Precisa de ajuda? Fale com a gente no WhatsApp
            <a href="https://wa.me/5519983760954" style="color:#0ea5a4;text-decoration:none">(19) 98376-0954</a>.
          </p>
        </div>
      </div>

      <div style="background:#0b1b33;padding:16px;text-align:center">
        <span style="font-size:12px;color:#8ea0bf">FesFlow — do pedido à devolução, tudo flui. 🎈</span>
      </div>
    </div>
  </div>`;
  return enviarEmail(to, "🎉 Bem-vindo ao FesFlow — seu acesso está pronto", html);
}
