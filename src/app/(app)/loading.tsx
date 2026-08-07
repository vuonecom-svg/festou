// Skeleton exibido durante a navegação entre telas (Server Components fazem
// await de várias queries; sem isso a troca parecia travada em conexão lenta).
export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Carregando">
      <div className="h-7 w-56 rounded-lg bg-border/60" />
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-border/40" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-border/30" />
    </div>
  );
}
