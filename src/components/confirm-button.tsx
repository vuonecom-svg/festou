"use client";

import type { ReactNode } from "react";

// Botão que pede confirmação (window.confirm) antes de disparar a server action.
export function ConfirmButton({
  action,
  confirm,
  children,
  className,
}: {
  action: () => void | Promise<void>;
  confirm: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={className}
        onClick={(e) => {
          if (!window.confirm(confirm)) e.preventDefault();
        }}
      >
        {children}
      </button>
    </form>
  );
}
