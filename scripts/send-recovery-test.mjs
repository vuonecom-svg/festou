// Dispara o e-mail de recuperação (template branded com logo) para um endereço,
// via GoTrue REST usando a anon key. Não expõe segredos. Uso:
//   node scripts/send-recovery-test.mjs alguem@email.com
import { readFileSync } from "node:fs";

function readEnv() {
  const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const to = process.argv[2] || "ecomclube@gmail.com";
const env = readEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) { console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / ANON_KEY no .env"); process.exit(1); }

const r = await fetch(`${url}/auth/v1/recover`, {
  method: "POST",
  headers: { apikey: anon, "Content-Type": "application/json" },
  body: JSON.stringify({ email: to }),
});
console.log("status:", r.status, r.ok ? "-> e-mail de recuperação disparado para " + to : await r.text());
