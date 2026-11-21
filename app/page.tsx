import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PhoneHero } from "@/components/PhoneHero";
import { PhotoCompare } from "@/components/PhotoCompare";
import { AddressCta, StickyCta } from "@/components/AddressCta";
import { CommissionCalc } from "@/components/CommissionCalc";
import { Footer, TopBar } from "@/components/Site";
import { depositEuro, euro, packages } from "@/lib/site";

const faqs = [
  {
    q: "Ediligo è un'agenzia?",
    a: "No. Non cerchiamo acquirenti al posto tuo, non trattiamo il prezzo e non prendiamo percentuali. Ti diamo un'app e dei professionisti, a prezzo fisso. La vendita resta tua.",
  },
  {
    q: "Chi paga?",
    a: "Solo tu, e solo il pacchetto che scegli. Chi compra casa non paga niente a Ediligo.",
  },
  {
    q: "La valutazione è affidabile?",
    a: "Partiamo dalle quotazioni OMI dell'Agenzia delle Entrate per la tua zona e le correggiamo con le caratteristiche della casa. Ti mostriamo ogni passaggio. È una stima, non una perizia: se ti serve una perizia firmata, la fa un tecnico del network.",
  },
  {
    q: "E se i documenti non sono in regola?",
    a: "Meglio saperlo adesso che davanti al notaio. Il geometra ti spiega cosa non torna e quanto costa sistemarlo, con un preventivo scritto. Decidi tu.",
  },
  {
    q: "Le foto con l'AI non ingannano chi compra?",
    a: "Miglioriamo luce, colori e prospettiva. L'arredo virtuale è sempre dichiarato nell'annuncio. Non nascondiamo difetti e non cambiamo le misure: chi visita trova la casa delle foto.",
  },
  {
    q: "Devo dare a qualcuno le chiavi di casa?",
    a: "No. Le visite le fai tu, quando vuoi tu. La segretaria AI ti manda solo persone già filtrate e prenota negli orari che hai scelto.",
  },
];

export default function Home() {
  return (
    <>
      <TopBar />
      <main id="contenuto">
        {/* Apertura */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>
                Vendi casa da privato.
                <span className="soft">Senza stress.</span>
              </h1>
              <p className="sub">
                Ti diciamo quanto vale, mettiamo in regola i documenti, scriviamo l&apos;annuncio e filtriamo chi
                chiama. Tu decidi tutto, e la provvigione resta a te.
              </p>
              <AddressCta id="hero-address" />
              <ul className="hero-proof">
                <li>
                  <span className="tick">
                    <Icon name="check" size={13} stroke={3} />
                  </span>
                  Dati OMI della tua zona
                </li>
                <li>
                  <span className="tick">
                    <Icon name="check" size={13} stroke={3} />
                  </span>
                  Nessuna agenzia
                </li>
                <li>
                  <span className="tick">
                    <Icon name="check" size={13} stroke={3} />
                  </span>
                  Professionisti di Milano
                </li>
              </ul>
            </div>
            <PhoneHero />
          </div>
        </section>

        {/* Servizi */}
        <section className="section section-tight" id="servizi" aria-labelledby="servizi-title">
          <div className="wrap">
            <div className="head">
              <h2 id="servizi-title">Tutto quello che fa un&apos;agenzia. Tranne la provvigione.</h2>
              <p className="sub">
                L&apos;AI fa il lavoro lungo, i professionisti di Milano mettono la firma dove serve. Tu tieni il
                controllo dal telefono.
              </p>
            </div>

            <div className="bento">
              <article className="tile t-mint span-4">
                <h3>Sai subito quanto vale</h3>
                <p>
                  Quotazioni OMI della tua zona, corrette per piano, stato, balcone e classe energetica. E il prezzo
                  giusto da cui far partire l&apos;annuncio.
                </p>
                <div className="viz">
                  <div className="mini" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "end" }}>
                    <div className="bars" aria-hidden="true">
                      {[38, 52, 61, 70, 84, 92, 78, 64, 50].map((h, i) => (
                        <span key={i} className={i === 5 ? "me" : undefined} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="muted small">Casa tua</div>
                      <div className="display" style={{ fontSize: "1.8rem" }}>
                        5.490 €/m²
                      </div>
                      <div className="small" style={{ color: "var(--mint-ink)", fontWeight: 600 }}>
                        Sopra la media di zona
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="tile t-lilac span-2">
                <h3>Documenti in regola, prima delle visite</h3>
                <p>Carichi visura, planimetria e APE. Ti diciamo cosa manca. Se serve, un geometra va in Comune.</p>
                <div className="viz">
                  <div className="mini">
                    <div className="mini-row">
                      <span>Planimetria</span>
                      <span className="dot dot-ok">Ok</span>
                    </div>
                    <div className="mini-row">
                      <span>APE</span>
                      <span className="dot dot-warn">Scaduto</span>
                    </div>
                    <div className="mini-row">
                      <span>Veranda</span>
                      <span className="dot dot-bad">Da sanare</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="tile t-peach span-3">
                <h3>Un annuncio che si fa leggere</h3>
                <p>Scritto dall&apos;AI per Immobiliare.it, Idealista e Casa.it, con le parole che chi cerca casa usa davvero.</p>
                <div className="viz">
                  <div className="mini typing">
                    Trilocale <mark>luminoso</mark> a due passi dalla <mark>M2 Piola</mark>, secondo piano con
                    ascensore, balcone su cortile <mark>silenzioso</mark>. Cucina abitabile, due camere, cantina
                    <span className="caret" aria-hidden="true" />
                  </div>
                </div>
              </article>

              <article className="tile t-sky span-3">
                <h3>Foto che fanno venire voglia di visitare</h3>
                <p>Luce, colori e arredo virtuale con l&apos;AI. Sempre dichiarato, mai un difetto nascosto. Prova tu.</p>
                <div className="viz">
                  <PhotoCompare />
                </div>
              </article>

              <article className="tile t-butter span-2">
                <span className="tag">In arrivo</span>
                <h3>Una segretaria che filtra i perditempo</h3>
                <p>Risponde su WhatsApp, chiede budget e mutuo, ti passa solo chi è serio.</p>
                <div className="viz">
                  <div className="chat">
                    <span className="bubble in">Ciao, la casa è ancora disponibile?</span>
                    <span className="bubble out">Sì! Ha già un mutuo approvato?</span>
                    <span className="bubble in">Sì, fino a 420 mila</span>
                  </div>
                </div>
              </article>

              <article className="tile t-rose span-2">
                <span className="tag">In arrivo</span>
                <h3>Visite solo quando vuoi tu</h3>
                <p>Scegli gli orari, l&apos;agenda si riempie da sola con chi ha superato il filtro.</p>
                <div className="viz">
                  <div className="slots" aria-hidden="true">
                    <span className="head-day">Gio</span>
                    <span className="head-day">Ven</span>
                    <span className="head-day">Sab</span>
                    <span className="head-day">Dom</span>
                    <span>18:00</span>
                    <span className="busy">18:30</span>
                    <span className="busy">10:30</span>
                    <span>11:00</span>
                    <span className="busy">18:30</span>
                    <span>19:00</span>
                    <span className="busy">11:30</span>
                    <span>—</span>
                  </div>
                </div>
              </article>

              <article className="tile t-ink span-2">
                <h3>Professionisti veri, a prezzo fisso</h3>
                <p>Geometra, certificatore APE e avvocato per la proposta d&apos;acquisto. Il prezzo lo sai prima.</p>
                <div className="viz">
                  <div className="people">
                    <span className="person">
                      <span className="avatar" style={{ background: "var(--blue)" }}>G</span>
                      Geometra
                    </span>
                    <span className="person">
                      <span className="avatar" style={{ background: "var(--mint-ink)" }}>A</span>
                      Certificatore APE
                    </span>
                    <span className="person">
                      <span className="avatar" style={{ background: "var(--rose-ink)" }}>L</span>
                      Avvocato
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Calcolo della provvigione */}
        <section className="section section-tight" aria-label="Calcolo della provvigione">
          <div className="wrap">
            <CommissionCalc />
          </div>
        </section>

        {/* Come funziona */}
        <section className="section section-tight" aria-labelledby="come-title">
          <div className="wrap">
            <div className="head">
              <h2 id="come-title">Da oggi al rogito, in tre mosse.</h2>
            </div>
            <ol className="steps3">
              <li>
                <h3>Scopri quanto vale</h3>
                <p>Rispondi a qualche domanda o incolla il link del tuo annuncio. Il valore lo vedi subito.</p>
              </li>
              <li>
                <h3>Prepariamo tutto</h3>
                <p>Documenti controllati, APE, annuncio e foto. Lo pubblichi tu dal tuo account, come privato.</p>
              </li>
              <li>
                <h3>Vendi alle tue condizioni</h3>
                <p>Visite filtrate, proposta preparata, avvocato se serve. Tu firmi, e tieni la provvigione.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* Prezzi */}
        <section className="section section-tight" id="prezzi" aria-labelledby="prezzi-title">
          <div className="wrap">
            <div className="head">
              <h2 id="prezzi-title">Un prezzo fisso. Niente percentuali.</h2>
              <p className="sub">
                Prenoti con un acconto di {euro(depositEuro)}, rimborsabile. Paghi il resto solo quando partiamo.
              </p>
            </div>
            <div className="prices">
              {packages.map((p) => (
                <div key={p.id} className={`price-card${p.id === "completo" ? " hot" : ""}`}>
                  {p.id === "completo" && <span className="pill">Consigliato</span>}
                  <h3>{p.name}</h3>
                  <div className="amount">{p.price === 0 ? "Gratis" : euro(p.price)}</div>
                  <p style={{ opacity: 0.85 }}>{p.summary}</p>
                  <ul>
                    {p.includes.map((i) => (
                      <li key={i}>
                        <span className="tick">
                          <Icon name="check" size={13} stroke={3} />
                        </span>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.id === "gratis" ? "/valuta" : `/valuta?pacchetto=${p.id}`}
                    className={`btn ${p.id === "completo" ? "btn-white" : "btn-ink"}`}
                  >
                    {p.id === "gratis" ? "Valuta casa gratis" : `Inizia con ${p.name}`}
                  </Link>
                </div>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: "1rem" }}>
              Prezzi IVA inclusa. Eventuali sanatorie hanno un preventivo a parte, sempre a prezzo fisso.
            </p>
          </div>
        </section>

        {/* Domande */}
        <section className="section section-tight" id="domande" aria-labelledby="faq-title">
          <div className="wrap faq-grid">
            <div>
              <h2 id="faq-title">Le domande che ci fanno tutti.</h2>
            </div>
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

        {/* Chiusura */}
        <section className="section section-tight">
          <div className="wrap">
            <div className="closing">
              <h2>Quanto vale casa tua? Scoprilo in 2 minuti.</h2>
              <p className="sub">Scrivi l&apos;indirizzo: zona, prezzi e valore li calcoliamo noi.</p>
              <div className="closing-form">
                <AddressCta id="closing-address" dark />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
