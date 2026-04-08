import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { FilterProvider } from "@/components/providers/FilterProvider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flagrante.site — Audiências de Custódia no Brasil",
  description:
    "Painel público com dados sobre audiências de custódia no Brasil. Decisões, perfil do custodiado, série histórica 2015–2025. Fontes: CNJ / SISTAC / BNMP 3.0.",
  openGraph: {
    title: "Flagrante.site — Audiências de Custódia no Brasil",
    description:
      "Painel público com dados sobre audiências de custódia no Brasil.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <FilterProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </FilterProvider>
      </body>
    </html>
  );
}
