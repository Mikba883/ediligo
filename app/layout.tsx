import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ediligo — Vendi casa da privato a Milano, senza agenzia",
  description:
    "Quotazione con i dati OMI, controllo dei documenti, annuncio e foto con l'AI, professionisti a prezzo fisso. Tu vendi, noi mettiamo in ordine il fascicolo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
