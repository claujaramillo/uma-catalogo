import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-opensans", // Keeping variable name to avoid refactoring CSS
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UMA Mercado Consciente — Catálogo de productos naturales",
  description:
    "Biocosmética, productos eco-amigables, cuidado personal y snacks saludables. Descubre el catálogo de UMA y pide por WhatsApp.",
  keywords: ["biocosmética", "productos naturales", "eco-friendly", "cuidado personal", "snacks saludables", "UMA"],
  openGraph: {
    title: "UMA Mercado Consciente",
    description: "Productos naturales para una vida más plena y consciente.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
