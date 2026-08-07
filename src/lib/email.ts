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

// E-mail de boas-vindas com o link para o cliente criar a senha e entrar.
export async function enviarEmailBoasVindas(to: string, nome: string, link: string): Promise<boolean> {
  const saud = nome ? `Olá, ${nome}!` : "Olá!";
  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
    <div style="background:#0b1b33;border-radius:14px;padding:22px;text-align:center">
      <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-.5px">FesFlow</span>
    </div>
    <div style="padding:24px 6px">
      <h1 style="font-size:20px;margin:0 0 8px">${saud}</h1>
      <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 16px">
        Seu acesso ao <strong>FesFlow</strong> está pronto. Clique no botão abaixo para
        <strong>criar sua senha</strong> e entrar na plataforma.
      </p>
      <p style="text-align:center;margin:24px 0">
        <a href="${link}" style="display:inline-block;background:#06b6b4;color:#052e2b;font-weight:800;
           text-decoration:none;padding:13px 26px;border-radius:28px;font-size:16px">
          Criar minha senha
        </a>
      </p>
      <p style="font-size:13px;color:#64748b;line-height:1.6;margin:16px 0 0">
        Se o botão não funcionar, copie e cole este link no navegador:<br>
        <span style="word-break:break-all;color:#0ea5a4">${link}</span>
      </p>
      <p style="font-size:13px;color:#64748b;margin:22px 0 0">
        Precisa de ajuda? Fale com a gente no WhatsApp (19) 98376-0954.
      </p>
    </div>
    <div style="text-align:center;color:#94a3b8;font-size:12px;padding:8px 0 0">
      FesFlow — gestão para locadoras de brinquedos.
    </div>
  </div>`;
  return enviarEmail(to, "Seu acesso ao FesFlow — crie sua senha", html);
}
