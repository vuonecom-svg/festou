// Ícone da marca Festou — pula-pula (torres + domo + base) com check e estrela,
// nas cores do logotipo. Simplificado para ler bem em tamanhos pequenos.
export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* torres laterais */}
      <rect x="3.5" y="12" width="6" height="15" rx="2" fill="#f26a26" />
      <rect x="22.5" y="12" width="6" height="15" rx="2" fill="#7c3aed" />
      {/* domo (corpo do pula-pula) */}
      <path d="M8 27 V18 a8 8 0 0 1 16 0 V27 Z" fill="#17b3c4" />
      {/* porta */}
      <path d="M13 27 V22.5 a3 3 0 0 1 6 0 V27 Z" fill="#0f8ea3" />
      {/* base */}
      <rect x="2.5" y="25" width="27" height="5" rx="2.5" fill="#182a5c" />
      {/* check */}
      <path
        d="M12 17.8 l2.6 2.6 l5.2 -5.8"
        stroke="#ffffff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* estrela */}
      <path
        d="M16 3 l1.3 2.7 3 .4 -2.2 2.1 .5 3 -2.6 -1.4 -2.6 1.4 .5 -3 -2.2 -2.1 3 -.4 Z"
        fill="#f4c220"
      />
    </svg>
  );
}
