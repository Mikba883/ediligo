import type { Metadata } from "next";
import { Funnel } from "@/components/Funnel";

export const metadata: Metadata = {
  title: "Scopri quanto vale casa tua — Ediligo",
  description: "Valutazione gratuita della tua casa a Milano in 2 minuti: incolla il link del tuo annuncio o rispondi a qualche domanda.",
};

export default async function ValutaPage({ searchParams }: { searchParams: Promise<{ pacchetto?: string; indirizzo?: string; da?: string }> }) {
  const { pacchetto, indirizzo, da } = await searchParams;
  return <Funnel packageId={pacchetto} initialAddress={indirizzo} initialMode={da} />;
}
