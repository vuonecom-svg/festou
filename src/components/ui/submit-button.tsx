"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-10 px-4 bg-primary text-primary-fg hover:bg-primary/90 transition-colors disabled:opacity-60",
        className
      )}
    >
      {pending ? "Salvando…" : children}
    </button>
  );
}
