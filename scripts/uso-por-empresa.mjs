// Uso real por empresa — quanto cada cliente de fato opera no sistema.
// Serve para o Paulo saber quem tem resultado real para virar case/depoimento
// (nunca para inventar prova: só mostra o que existe no banco).
// Somente leitura.
import { readFileSync } from "node:fs";
import pg from "pg";

function readEnv() {
  const txt = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = readEnv();
const client = new pg.Client({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const { rows } = await client.query(`
  select e.nome as empresa,
         e.status_assinatura,
         e.criado_em::date as desde,
         (select count(*) from brinquedo b where b.empresa_id = e.id) as brinquedos,
         (select count(*) from cliente c where c.empresa_id = e.id) as clientes,
         (select count(*) from orcamento o where o.empresa_id = e.id) as orcamentos,
         (select count(*) from pedido p where p.empresa_id = e.id) as pedidos,
         (select count(*) from reserva_item r where r.empresa_id = e.id) as reservas,
         (select max(p.criado_em)::date from pedido p where p.empresa_id = e.id) as ultimo_pedido
  from empresa e
  order by e.criado_em asc`);

await client.end();
console.table(rows);
