import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { LeadForm } from "@/components/LeadForm";
import { Planimetria } from "@/components/Planimetria";
import { QuickQuote } from "@/components/QuickQuote";
import { Savings } from "@/components/Savings";
import { depositEuro, euro, packages } from "@/lib/site";
import { estimate } from "@/lib/valuation";

const fixes = [
  {
    title: "Il prezzo",
    fear: "Chiedi troppo e la casa resta ferma. Chiedi poco e regali soldi a chi compra.",
    answer:
      "Partiamo dalle quotazioni OMI della tua zona e dalle caratteristiche della casa. Ti diciamo un intervallo realistico e da quale prezzo far partire l'annuncio per lasciare margine alla trattativa.",
  },
  {
    title: "I documenti",
    fear: "Una veranda chiusa o una planimetria vecchia possono bloccare il rogito, o arrivare dopo come causa.",
    answer:
      "Carichi visura, planimetria e APE: l'AI ti dice cosa manca e cosa non torna. Se serve, un geometra del network va in Comune, controlla i titoli edilizi e ti scrive cosa sistemare.",
  },
  {
    title: "L'annuncio",
    fear: "Foto scure, descrizione di due righe, niente planimetria: chi cerca casa scorre oltre.",
    answer:
      "Scriviamo l'annuncio per Immobiliare.it, Idealista e Casa.it, miglioriamo le foto e, se vuoi, aggiungiamo un arredamento virtuale dichiarato. Lo pubblichi tu, dal tuo account da privato.",
  },
  {
    title: "Il tempo",
    fear: "Telefonate a tutte le ore, visite di curiosi, proposte scritte su un foglio.",
    answer:
      "Ti diamo una scaletta per filtrare chi chiama, organizzare le visite e capire chi ha già un mutuo. Per la proposta d'acquisto ti mettiamo in contatto con un avvocato a prezzo fisso.",
  },
];

const steps = [
  {
    title: "Calcoli il valore",
    text: "Zona, metri quadri, stato della casa. In due minuti hai una stima con i dati OMI.",
    who: "Gratis, con l'AI",
  },
  {
    title: "Controlli i documenti",
    text: "Carichi le carte che hai. Ricevi una lista verde, gialla e rossa di cosa sistemare.",
    who: "Gratis, con l'AI",
  },
  {
    title: "Sistemi quello che serve",
    text: "APE, verifica di conformità, piccole sanatorie: le fa un professionista del network.",
    who: "Prezzo fisso, deciso prima",
  },
  {
    title: "Pubblichi l'annuncio",
    text: "Testo e foto pronti. Lo carichi sui portali come privato, con la nostra guida.",
    who: "Tu, dal tuo account",
  },
  {
    title: "Vendi",
    text: "Visite, trattativa e proposta restano in mano tua. Noi ti diamo strumenti e professionisti.",
    who: "Decidi sempre tu",
  },
];

const roles = [
  { title: "Geometri e architetti", text: "Accesso agli atti in Comune, verifica di conformità, pratiche di sanatoria." },
  { title: "Certificatori energetici", text: "APE con sopralluogo vero, non compilato a distanza." },
  { title: "Avvocati", text: "Revisione della proposta d'acquisto e del preliminare, a tariffa fissa." },
  { title: "Fotografi", text: "Per chi vuole foto professionali oltre a quelle migliorate con l'AI." },
];

const faqs = [
  {
    q: "Ediligo è un'agenzia immobiliare?",
    a: "No. Non cerchiamo acquirenti per te, non trattiamo il prezzo al posto tuo e non prendiamo percentuali sulla vendita. Ti vendiamo servizi a prezzo fisso: quotazione, documenti, annuncio, professionisti.",
  },
  {
    q: "Chi paga Ediligo?",
    a: "Solo tu che vendi, e solo il prezzo del pacchetto che scegli. Chi compra casa non ci paga nulla.",
  },
  {
    q: "La quotazione è una perizia?",
    a: "No, è una stima basata sulle quotazioni OMI della zona e sulle caratteristiche che ci indichi. Serve a scegliere il prezzo dell'annuncio. Una perizia la firma un tecnico abilitato e possiamo organizzarla tramite il network.",
  },
  {
    q: "Mi serve davvero l'APE?",
    a: "Sì. L'attestato di prestazione energetica va indicato nell'annuncio e consegnato a chi compra. Se il tuo è scaduto o manca, lo fa un certificatore del network con sopralluogo.",
  },
  {
    q: "Le foto con l'AI sono legali?",
    a: "Miglioriamo luce, colori e prospettiva. L'arredamento virtuale è sempre dichiarato nell'annuncio. Non togliamo difetti e non cambiamo le dimensioni delle stanze: chi visita deve trovare la casa delle foto.",
  },
  {
    q: "Cosa succede se dopo la verifica la casa non è in regola?",
    a: "Il geometra ti spiega cosa non torna e quanto costa sistemarlo, con un preventivo scritto. Decidi tu se procedere. Meglio saperlo prima delle visite che davanti al notaio.",
  },
];

export default function Home() {
  const example = estimate({
    zoneId: "citta-studi",
    sqm: 72,
    condition: "buono",
    floor: 2,
    lift: true,
    outdoor: "balcone",
    garage: false,
    energy: "non-so",
  });
  return (
    <>
      <Header />
      <main id="contenuto">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>
                <span className="h1-line">Vendi casa da privato.</span>{" "}
                <span className="h1-line">Al fascicolo pensiamo noi.</span>
              </h1>
              <p className="lead">
                Prezzo giusto, documenti verificati, annuncio e foto pronti. L&apos;AI fa il lavoro lungo, i
                professionisti di Milano mettono la firma. La trattativa resta tua, e anche i soldi della provvigione.
              </p>
              <QuickQuote />
              <p className="small muted" style={{ marginTop: "1.25rem" }}>
                Non siamo un&apos;agenzia: paghi un prezzo fisso, solo se scegli un pacchetto, e tratti tu con chi compra.
              </p>
            </div>

            <figure className="dossier" style={{ margin: 0 }}>
              <div className="dossier-head">
                <strong>Fascicolo della casa</strong>
                <span className="small muted">Esempio</span>
              </div>
              <div className="dossier-plan">
                <Planimetria />
              </div>
              <div className="dossier-estimate">
                <span className="small">Valore stimato</span>
                <span className="value">
                  {example ? `${euro(example.low)} – ${euro(example.high)}` : "—"}
                </span>
              </div>
              <ul className="status-list">
                <li>
                  <span>Prezzo d&apos;annuncio</span>
                  <span className="status status-ok">Calcolato</span>
                </li>
                <li>
                  <span>Planimetria catastale</span>
                  <span className="status status-ok">Allineata</span>
                </li>
                <li>
                  <span>APE</span>
                  <span className="status status-warn">Scaduto, da rifare</span>
                </li>
                <li>
                  <span>Veranda chiusa sul balcone</span>
                  <span className="status status-bad">Da verificare in Comune</span>
                </li>
              </ul>
              <figcaption className="small muted" style={{ padding: "0 1.25rem 1rem" }}>
                Trilocale di 72 m² con balcone in Città Studi, in buono stato. Valori di esempio.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="problemi">
          <div className="wrap">
            <div className="section-head">
              <h2 id="problemi">Quattro cose fermano chi vende da solo</h2>
              <p className="lead">
                Non è l&apos;agenzia che manca: mancano dati, carte in ordine e un po&apos; di metodo. Ecco cosa
                facciamo per ognuna.
              </p>
            </div>
            <ul className="fixes">
              {fixes.map((f) => (
                <li key={f.title}>
                  <div>
                    <h3>{f.title}</h3>
                    <p className="fear">{f.fear}</p>
                  </div>
                  <p>{f.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section-dark" id="come-funziona" aria-labelledby="come">
          <div className="wrap">
            <div className="section-head">
              <h2 id="come">Come funziona</h2>
              <p className="lead muted">
                Cinque passi, nell&apos;ordine in cui li affronti. I primi due sono gratis e ti dicono già se puoi
                vendere senza sorprese.
              </p>
            </div>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                  <span className="who">{s.who}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="prezzi" aria-labelledby="prezzi-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="prezzi-title">Prezzi fissi, decisi prima</h2>
              <p className="lead">
                Nessuna percentuale sulla vendita, nessun costo per chi compra. Per prenotare un pacchetto basta un
                acconto di {euro(depositEuro)}, rimborsabile.
              </p>
            </div>
            <div className="pricing">
              {packages.map((p) => (
                <div key={p.id} className={`plan-col${p.id === "completo" ? " featured" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price === 0 ? "Gratis" : euro(p.price)}</p>
                  <p className="muted small">{p.summary}</p>
                  <ul>
                    {p.includes.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  {p.id === "gratis" ? (
                    <Link href="/quotazione" className="btn btn-ghost">
                      {p.cta}
                    </Link>
                  ) : (
                    <Link href="#contatti" className={`btn ${p.id === "completo" ? "btn-primary" : "btn-ghost"}`}>
                      {p.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: "1rem" }}>
              Prezzi IVA inclusa. Sanatorie e pratiche extra hanno un preventivo a parte, sempre a prezzo fisso.
            </p>
            <Savings />
          </div>
        </section>

        <section className="section section-alt" aria-labelledby="network">
          <div className="wrap">
            <div className="section-head">
              <h2 id="network">Professionisti di Milano, a tariffa concordata</h2>
              <p className="lead">
                Dove serve una firma lavora un professionista abilitato. Il prezzo lo conosci prima, e ti fattura
                direttamente o è già incluso nel pacchetto.
              </p>
            </div>
            <ul className="roles">
              {roles.map((r) => (
                <li key={r.title}>
                  <h3>{r.title}</h3>
                  <p className="muted">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="domande" aria-labelledby="faq-title">
          <div className="wrap section-head" style={{ alignItems: "start" }}>
            <h2 id="faq-title">Domande frequenti</h2>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt" id="contatti" aria-labelledby="contatti-title">
          <div className="wrap section-head" style={{ alignItems: "start" }}>
            <div>
              <h2 id="contatti-title">Parliamo della tua casa</h2>
              <p className="lead" style={{ marginTop: "1rem" }}>
                Lasciaci un contatto: ti richiamiamo entro un giorno lavorativo, senza impegno.
              </p>
            </div>
            <LeadForm sourcePage="home" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
