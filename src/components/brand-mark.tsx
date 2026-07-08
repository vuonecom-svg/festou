// Ícone da marca FesFlow — fita/chama "flow" em gradiente (teal → índigo →
// roxo → azul noite) com estrela e confetes. Recriação fiel do logotipo.
export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  const gid = "fesflow-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="8" y1="36" x2="32" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0b1b33" />
          <stop offset="0.38" stopColor="#4f46e5" />
          <stop offset="0.72" stopColor="#06b6b4" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* fita traseira (flow) */}
      <path
        d="M25 6 C 14 8.5, 11 16.5, 17.5 21.5 C 22 25, 15.5 28.5, 13.5 34 C 23 32, 30 25.5, 26.5 16.5 C 24.8 12, 28 9, 25 6 Z"
        fill={`url(#${gid})`}
      />
      {/* realce frontal teal */}
      <path
        d="M23 10.5 C 16.5 12.5, 15.5 17.5, 19.5 21 C 22.6 23.7, 18 27, 17 31 C 23.5 29, 27.5 23.5, 25 17 C 23.9 14, 25.2 12.4, 23 10.5 Z"
        fill="#06b6b4"
        opacity="0.55"
      />
      {/* estrela */}
      <path d="M31 4 l1.15 2.35 2.6 .35 -1.9 1.8 .5 2.6 -2.35 -1.25 -2.35 1.25 .5 -2.6 -1.9 -1.8 2.6 -.35 Z" fill="#f59e0b" />
      {/* confetes */}
      <circle cx="9.5" cy="8" r="1.7" fill="#7c3aed" />
      <circle cx="34" cy="15" r="1.4" fill="#06b6b4" />
      <circle cx="8.5" cy="15" r="1.2" fill="#f59e0b" />
    </svg>
  );
}
