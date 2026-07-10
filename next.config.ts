import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer (fontkit/brotli/stream) não deve ser empacotado pelo
  // bundler — fica como dependência externa das rotas de PDF (runtime nodejs).
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
