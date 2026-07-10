"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Algo deu errado</h1>
          <p style={{ color: "#64748b", marginBottom: 16 }}>
            Recarregue a página. Se o problema continuar, fale com o suporte.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: 0,
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
