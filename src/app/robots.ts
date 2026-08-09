import type { MetadataRoute } from "next";
import { abs, ROTAS_PRIVADAS, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // A área logada e os fluxos de conta não têm valor de busca e não devem
        // aparecer no Google.
        disallow: ROTAS_PRIVADAS,
      },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
