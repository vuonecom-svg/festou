// ── Motor de disponibilidade (anti-overbooking) ─────────────
// Lógica PURA (sem I/O). Espelha em JS a exclusion constraint do
// Postgres: um brinquedo não pode ter duas reservas cujas janelas
// de bloqueio se sobreponham. A janela de bloqueio NÃO é só a festa
// — inclui os buffers de transporte, montagem, desmontagem e limpeza.
//
//   base ──transporte──► local ──montagem──►  [ FESTA ]  ──desmontagem──► ──transporte──► base ──limpeza──► pronto
//   └──────────────────── janela em que o brinquedo está INDISPONÍVEL ─────────────────────────────────────┘

export type Janela = { inicio: Date; fim: Date };

export type Buffers = {
  transporteMin: number; // tempo de deslocamento base↔local (por trecho)
  montagemMin: number;
  desmontagemMin: number;
  limpezaMin: number;
};

const MIN = 60_000;

/** Calcula a janela de bloqueio a partir da janela da festa + buffers. */
export function janelaBloqueio(
  eventoInicio: Date,
  eventoFim: Date,
  b: Buffers
): Janela {
  const antes = (b.transporteMin + b.montagemMin) * MIN;
  const depois = (b.desmontagemMin + b.transporteMin + b.limpezaMin) * MIN;
  return {
    inicio: new Date(eventoInicio.getTime() - antes),
    fim: new Date(eventoFim.getTime() + depois),
  };
}

/** Duas janelas se sobrepõem? Meio-aberto [inicio, fim): encostar NÃO conflita. */
export function sobrepoe(a: Janela, b: Janela): boolean {
  return a.inicio < b.fim && b.inicio < a.fim;
}

export type ReservaLike = {
  id: string;
  brinquedoId: string;
  janelaInicio: string | Date;
  janelaFim: string | Date;
};

function toJanela(r: ReservaLike): Janela {
  return { inicio: new Date(r.janelaInicio), fim: new Date(r.janelaFim) };
}

export type ResultadoDisponibilidade<T extends ReservaLike = ReservaLike> = {
  disponivel: boolean;
  janela: Janela; // janela de bloqueio calculada para o pedido
  conflitos: T[]; // reservas existentes que colidem
};

/**
 * Verifica se um brinquedo está livre numa janela de festa desejada.
 * Ignora `ignorarReservaId` (útil ao reagendar a própria reserva).
 */
export function verificarDisponibilidade<T extends ReservaLike>(
  brinquedoId: string,
  eventoInicio: Date,
  eventoFim: Date,
  buffers: Buffers,
  reservasExistentes: T[],
  ignorarReservaId?: string
): ResultadoDisponibilidade<T> {
  const janela = janelaBloqueio(eventoInicio, eventoFim, buffers);
  const conflitos = reservasExistentes.filter(
    (r) =>
      r.brinquedoId === brinquedoId &&
      r.id !== ignorarReservaId &&
      sobrepoe(janela, toJanela(r))
  );
  return { disponivel: conflitos.length === 0, janela, conflitos };
}
