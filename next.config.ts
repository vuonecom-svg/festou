import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer (fontkit/brotli/stream) não deve ser empacotado pelo
  // bundler — fica como dependência externa das rotas de PDF (runtime nodejs).
  serverExternalPackages: ["@react-pdf/renderer"],

  // Cabeçalhos de segurança em todas as rotas (mitiga clickjacking, sniffing,
  // downgrade HTTP e vazamento de referrer). CSP fica para um passo seguinte
  // (precisa mapear inline scripts do Next/Supabase sem quebrar a app).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

export default nextConfig;
