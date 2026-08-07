// Guarda de invariantes do banco — falha (exit 1) se algo crítico sumir.
// Rode em CI antes do deploy: `npm run db:check`.
// Protege contra um `prisma db push` descuidado remover a constraint de
// anti-overbooking ou o RLS (que não vivem no schema.prisma, e sim no SQL).
import pg from "pg";
import fs from "fs";

function dbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
    const m = env.match(/^\s*DATABASE_URL\s*=\s*(.*)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  return null;
}

const url = dbUrl();
if (!url) { console.error("✖ DATABASE_URL ausente"); process.exit(1); }

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const falhas = [];

// 1) Constraint de anti-overbooking (o diferencial do produto).
const c = await client.query(
  "select 1 from pg_constraint where conname = 'reserva_item_sem_overbooking'"
);
if (c.rowCount === 0) falhas.push("constraint reserva_item_sem_overbooking AUSENTE (overbooking liberado!)");

// 2) RLS ligado nas tabelas sensíveis (isolamento multi-tenant).
const TABELAS = ["reserva_item", "cliente", "pedido", "orcamento", "receita", "brinquedo", "usuario"];
const rls = await client.query(
  `select relname, relrowsecurity from pg_class
   where relnamespace = 'public'::regnamespace and relname = any($1::text[])`,
  [TABELAS]
);
for (const t of TABELAS) {
  const row = rls.rows.find((r) => r.relname === t);
  if (!row) falhas.push(`tabela ${t} não encontrada`);
  else if (!row.relrowsecurity) falhas.push(`RLS DESLIGADO em ${t}`);
}

// 3) Colunas de estoque por unidade (anti-overbooking por unidade física).
const cols = await client.query(
  `select table_name, column_name from information_schema.columns
   where table_schema='public' and
     ((table_name='brinquedo' and column_name='quantidade') or
      (table_name='reserva_item' and column_name='unidade'))`
);
if (!cols.rows.some((r) => r.table_name === "brinquedo")) falhas.push("brinquedo.quantidade AUSENTE");
if (!cols.rows.some((r) => r.table_name === "reserva_item")) falhas.push("reserva_item.unidade AUSENTE");

await client.end();

if (falhas.length) {
  console.error("✖ Invariantes do banco QUEBRADAS:");
  for (const f of falhas) console.error("  - " + f);
  process.exit(1);
}
console.log("✓ Invariantes do banco OK (constraint anti-overbooking, RLS, colunas de estoque).");
