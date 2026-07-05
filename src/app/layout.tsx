import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Festou — Gestão para locadoras de brinquedos",
  description:
    "Agenda inteligente sem overbooking, orçamentos, contratos e financeiro para locadoras de brinquedos e itens de festa.",
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
