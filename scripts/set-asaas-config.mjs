// Cadastra as chaves do Asaas no app_config (banco) a partir do .env local.
// USO: cole no C:\festou\.env (gitignored, NUNCA commitar):
//   ASAAS_API_KEY=$aact_prod_...
//   ASAAS_WEBHOOK_TOKEN=<token que você digitou no painel do Asaas>
// e rode: node scripts/set-asaas-config.mjs
// Depois disso o webhook em produção lê do banco — sem env var na Vercel.
import { readFileSync } from "node:fs";
import pg from "pg";

const t = readFileSync(new URL("../.env", import.meta.url), "utf8");
const e = {};
for (const l of t.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) e[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const pares = [
  ["asaas_api_key", e.ASAAS_API_KEY],
  ["asaas_webhook_token", e.ASAAS_WEBHOOK_TOKEN],
];

const faltando = pares.filter(([, v]) => !v).map(([k]) => k);
if (faltando.length === 2) {
  console.error("Nada a cadastrar: cole ASAAS_API_KEY e ASAAS_WEBHOOK_TOKEN no .env primeiro.");
  process.exit(1);
}

const c = new pg.Client({ connectionString: e.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
for (const [chave, valor] of pares) {
  if (!valor) { console.log(`- ${chave}: ausente no .env (pulado)`); continue; }
  await c.query(
    `insert into app_config (chave, valor) values ($1, $2)
     on conflict (chave) do update set valor = excluded.valor`,
    [chave, valor]
  );
  console.log(`+ ${chave}: gravado (${valor.length} chars)`);
}
await c.end();
console.log("Pronto. O webhook /api/webhooks/asaas passa a funcionar em produção.");
