// Fonte única da verdade sobre "o gating de autenticação está ligado?".
// Em PRODUÇÃO o auth é SEMPRE exigido (fail-closed) — não depende de alguém
// lembrar de setar AUTH_ENABLED. A flag serve só para LIGAR o auth fora de
// produção (ex.: staging). Em dev, sem a flag, o app abre em modo demo.
export function authAtivo(): boolean {
  return process.env.AUTH_ENABLED === "true" || process.env.NODE_ENV === "production";
}
