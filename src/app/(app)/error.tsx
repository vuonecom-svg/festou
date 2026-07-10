"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid place-items-center py-20 px-4 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 mb-4">
          <AlertTriangle size={26} />
        </span>
        <h1 className="text-lg font-semibold">Algo deu errado</h1>
        <p className="text-sm text-muted mt-2">
          Tivemos um problema ao carregar esta tela. Tente de novo — se continuar, recarregue a página.
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center rounded-lg h-10 px-5 bg-primary text-primary-fg font-medium hover:bg-primary/90"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}
