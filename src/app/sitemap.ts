import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";
import { POSTS } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: agora, changeFrequency: "weekly", priority: 1 },
    { url: abs("/precos"), lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/blog"), lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/faq"), lastModified: agora, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/privacidade"), lastModified: agora, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/termos"), lastModified: agora, changeFrequency: "yearly", priority: 0.2 },
  ];

  const artigos: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: abs(`/blog/${p.slug}`),
    lastModified: new Date(p.data),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...estaticas, ...artigos];
}
