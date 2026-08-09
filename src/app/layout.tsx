import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE_URL, abs, OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FesFlow — Gestão para locadoras de brinquedos",
  description:
    "Agenda inteligente sem overbooking, orçamentos, contratos e financeiro para locadoras de brinquedos e itens de festa.",
  applicationName: "FesFlow",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "FesFlow",
    url: abs("/"),
    title: "FesFlow — Gestão para locadoras de brinquedos",
    description:
      "Agenda inteligente sem overbooking, orçamentos, contratos e financeiro para locadoras de brinquedos e itens de festa.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "FesFlow — Gestão para locadoras de brinquedos",
    description:
      "Agenda inteligente sem overbooking, orçamentos, contratos e financeiro para locadoras de brinquedos e itens de festa.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Verificação da propriedade no Google Search Console (fesflow.com.br).
  // NÃO remova: o Google revalida periodicamente e a propriedade cai se sumir.
  verification: { google: "8cDkdOXSen3Toee4mVWoY3wjurx95nSgzezFZEGrLG8" },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
