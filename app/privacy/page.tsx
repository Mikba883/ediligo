import type { Metadata } from "next";
import { Footer, TopBar } from "@/components/Site";

export const metadata: Metadata = { title: "Informativa privacy — Ediligo", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main id="contenuto" className="section" style={{ paddingTop: "3rem" }}>
        <div className="wrap"><div className="prose">
          <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>Informativa privacy</h1>
          <p className="notice" style={{ margin: "1.5rem 0" }}>
            Bozza da far verificare a un legale prima della pubblicazione. Mancano i dati del titolare.
          </p>

          <h2>Chi tratta i tuoi dati</h2>
          <p>Titolare del trattamento: [ragione sociale, sede, partita IVA, email di contatto].</p>

          <h2>Quali dati raccogliamo</h2>
          <p>
            Nome, email o telefono, la richiesta che ci fai e, se usi la quotazione, le caratteristiche della casa che
            inserisci (zona, metri quadri, stato, piano).
          </p>

          <h2>Perché e su quale base</h2>
          <ul>
            <li>Per rispondere alla tua richiesta e ricontattarti: base giuridica è la tua richiesta (art. 6.1.b GDPR).</li>
            <li>
              Per inviarti aggiornamenti e offerte, solo se hai spuntato la casella facoltativa: base giuridica è il tuo
              consenso (art. 6.1.a GDPR), revocabile in ogni momento.
            </li>
          </ul>

          <h2>Per quanto tempo</h2>
          <p>
            I dati della richiesta per 12 mesi dall&apos;ultimo contatto, salvo che tu diventi cliente. I dati per gli
            aggiornamenti fino alla revoca del consenso.
          </p>

          <h2>Con chi li condividiamo</h2>
          <p>
            Con i fornitori tecnici che ci servono per gestire il sito e i contatti, nominati responsabili del
            trattamento. Con i professionisti del network solo se ci chiedi un loro servizio. Non vendiamo i tuoi dati.
          </p>

          <h2>I tuoi diritti</h2>
          <p>
            Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento scrivendo a
            [email]. Puoi anche presentare reclamo al Garante per la protezione dei dati personali.
          </p>
        </div></div>
      </main>
      <Footer />
    </>
  );
}
