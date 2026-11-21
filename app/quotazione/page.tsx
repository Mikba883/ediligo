import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { ValuationTool } from "@/components/ValuationTool";

export const metadata: Metadata = {
  title: "Quanto vale la tua casa a Milano — Ediligo",
  description: "Stima gratuita del valore della tua casa a Milano, con i dati di zona e le caratteristiche dell'immobile.",
};

export default async function QuotazionePage({
  searchParams,
}: {
  searchParams: Promise<{ zona?: string; mq?: string }>;
}) {
  const { zona, mq } = await searchParams;
  return (
    <>
      <Header />
      <main id="contenuto" className="section" style={{ paddingTop: "clamp(2rem, 5vw, 3.5rem)" }}>
        <div className="wrap">
          <h1 style={{ maxWidth: "18ch" }}>Quanto vale la tua casa</h1>
          <p className="lead" style={{ margin: "1rem 0 2.5rem" }}>
            Ti diamo un intervallo di prezzo e ti mostriamo come ci siamo arrivati, voce per voce.
          </p>
          <ValuationTool initialZone={zona} initialSqm={mq} />
        </div>
      </main>
      <Footer />
    </>
  );
}
