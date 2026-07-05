import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-10 px-4 transition-colors disabled:opacity-60 disabled:pointer-events-none";

const variants = {
  primary: "bg-primary text-primary-fg hover:bg-primary/90",
  secondary: "border border-border bg-surface hover:bg-background",
  danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
  ghost: "hover:bg-background text-foreground/70",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  href,
  children,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
