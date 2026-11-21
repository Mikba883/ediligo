"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { LeadForm } from "./LeadForm";
import { Logo } from "./Logo";
import { euro, packages } from "@/lib/site";
import {
  type Condition,
  type Energy,
  type Extra,
  estimate,
  parseListingUrl,
  zoneSource,
  zones,
} from "@/lib/valuation";

type Mode = "link" | "dati";
type StepId = "start" | "link" | "zone" | "sqm" | "condition" | "floor" | "extras" | "energy" | "timing" | "result";
type Timing = "subito" | "3-mesi" | "6-mesi" | "curiosita";

const FLOWS: Record<Mode, StepId[]> = {
  link: ["start", "link", "zone", "sqm", "timing", "result"],
  dati: ["start", "zone", "sqm", "condition", "floor", "extras", "energy", "timing", "result"],
};

const conditionOptions: [Condition, string, string][] = [
  ["da-ristrutturare", "Da ristrutturare", "Impianti o bagni da rifare"],
  ["buono", "Buono", "Abitabile così com'è"],
  ["ristrutturato", "Ristrutturata", "Lavori negli ultimi 10 anni"],
  ["nuovo", "Nuova", "Mai abitata o appena finita"],
];
const extraOptions: [Extra, string][] = [
  ["balcone", "Balcone"],
  ["terrazzo", "Terrazzo"],
  ["giardino", "Giardino"],
  ["box", "Box o posto auto"],
  ["cantina", "Cantina"],
];
const energyOptions: [Energy, string][] = [
  ["alta", "A o B"],
  ["media", "C o D"],
  ["bassa", "E, F o G"],
  ["non-so", "Non lo so"],
];
const timingOptions: [Timing, string, string][] = [
  ["subito", "Il prima possibile", "Voglio partire adesso"],
  ["3-mesi", "Entro 3 mesi", "Mi sto organizzando"],
  ["6-mesi", "Tra 6 mesi o più", "Sto valutando"],
  ["curiosita", "Voglio solo sapere quanto vale", "Per ora nessun piano"],
];

export function Funnel({ packageId }: { packageId?: string }) {
  const [mode, setMode] = useState<Mode>("dati");
  const [index, setIndex] = useState(0);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [sqm, setSqm] = useState("");
  const [sqmError, setSqmError] = useState("");
  const [condition, setCondition] = useState<Condition>("buono");
  const [floor, setFloor] = useState(1);
  const [lift, setLift] = useState(true);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [energy, setEnergy] = useState<Energy>("non-so");
  const [timing, setTiming] = useState<Timing | "">("");
  const titleRef = useRef<HTMLHeadingElement>(null);

  const flow = FLOWS[mode];
  const step = flow[index];
  const total = flow.length - 1;
  const progress = step === "start" ? 4 : Math.round((index / total) * 100);
  const chosenPackage = packages.find((p) => p.id === packageId && p.price > 0);

  useEffect(() => {
    titleRef.current?.focus();
  }, [step]);

  const result = useMemo(
    () =>
      step === "result"
        ? estimate({ zoneId, sqm: Number(sqm), condition, floor, lift, extras, energy })
        : null,
    [step, zoneId, sqm, condition, floor, lift, extras, energy],
  );

  const next = () => setIndex((i) => Math.min(i + 1, flow.length - 1));
  const back = () => setIndex((i) => Math.max(i - 1, 0));
  const pickAndNext = (fn: () => void) => {
    fn();
    window.setTimeout(next, 180);
  };

  function submitLink() {
    const parsed = parseListingUrl(link);
    if (!parsed.ok) return setLinkError(parsed.error);
    setLinkError("");
    setLink(parsed.url);
    next();
  }
  function submitSqm() {
    const n = Number(sqm);
    if (!sqm || n < 15 || n > 1000) return setSqmError("Inserisci un numero tra 15 e 1000.");
    setSqmError("");
    next();
  }
  const bumpSqm = (d: number) => setSqm((s) => String(Math.min(1000, Math.max(15, (Number(s) || 70) + d))));
  const toggleExtra = (e: Extra) => setExtras((xs) => (xs.includes(e) ? xs.filter((x) => x !== e) : [...xs, e]));

  const zone = zones.find((z) => z.id === zoneId);
  const stepNumber = step === "start" || step === "result" ? null : index;

  return (
    <div className="flow">
      <div className="flow-top">
        <Link href="/" aria-label="Ediligo, torna alla home" className="logo">
          <Logo />
        </Link>
        <div
          className="progress"
          role="progressbar"
          aria-label="Avanzamento"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <Link href="/" className="icon-btn" aria-label="Esci">
          <Icon name="close" />
        </Link>
      </div>

      <main className="flow-body" id="contenuto">
        <div className="q" key={step}>
          {stepNumber !== null && (
            <p className="q-step">
              Domanda {stepNumber} di {total - 1}
            </p>
          )}

          {step === "start" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Scopri quanto vale casa tua.
              </h1>
              <p className="sub">
                {chosenPackage
                  ? `Partiamo dalla valutazione, poi attiviamo il pacchetto ${chosenPackage.name}.`
                  : "Gratis, senza registrazione. Scegli da dove partire."}
              </p>
              <div className="q-body choices two">
                <button
                  type="button"
                  className="choice choice-big"
                  onClick={() => pickAndNext(() => setMode("link"))}
                >
                  <span className="ico" style={{ background: "var(--sky)", color: "var(--sky-ink)" }}>
                    <Icon name="link" size={22} />
                  </span>
                  <strong>Ho già un annuncio</strong>
                  <span>Incolli il link da Immobiliare.it, Idealista o Casa.it. Due domande e hai la stima.</span>
                </button>
                <button
                  type="button"
                  className="choice choice-big"
                  onClick={() => pickAndNext(() => setMode("dati"))}
                >
                  <span className="ico" style={{ background: "var(--mint)", color: "var(--mint-ink)" }}>
                    <Icon name="home" size={22} />
                  </span>
                  <strong>Inserisco i dati della casa</strong>
                  <span>Sette domande veloci, una per schermata. Circa due minuti.</span>
                </button>
              </div>
            </>
          )}

          {step === "link" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitLink();
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                Incolla il link del tuo annuncio.
              </h1>
              <p className="sub">Lo apriamo noi e lo usiamo per la valutazione dettagliata. Per la stima immediata ti chiediamo solo zona e metri quadri.</p>
              <div className="q-body field">
                <label htmlFor="link">Link dell&apos;annuncio</label>
                <input
                  id="link"
                  className="input"
                  inputMode="url"
                  placeholder="https://www.immobiliare.it/annunci/…"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  aria-invalid={linkError ? true : undefined}
                  aria-describedby={linkError ? "link-err" : undefined}
                />
                {linkError && (
                  <p className="err" id="link-err">
                    {linkError}
                  </p>
                )}
              </div>
              <Actions onBack={back} />
            </form>
          )}

          {step === "zone" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                In che zona si trova?
              </h1>
              <p className="sub">Scegli la zona di Milano più vicina.</p>
              <div className="q-body zone-grid" role="radiogroup" aria-label="Zona">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    role="radio"
                    aria-checked={zoneId === z.id}
                    className="choice"
                    onClick={() => pickAndNext(() => setZoneId(z.id))}
                  >
                    <strong>{z.name}</strong>
                    <span>{z.areas}</span>
                  </button>
                ))}
              </div>
              <Actions onBack={back} hideNext />
            </>
          )}

          {step === "sqm" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSqm();
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                Quanti metri quadri?
              </h1>
              <p className="sub">Quelli commerciali, come sulla visura o sull&apos;annuncio. Va bene anche a occhio.</p>
              <div className="q-body unit-row">
                <label htmlFor="sqm" className="sr-only" style={{ position: "absolute", left: -9999 }}>
                  Metri quadri
                </label>
                <input
                  id="sqm"
                  className="input input-xl"
                  inputMode="numeric"
                  placeholder="70"
                  value={sqm}
                  onChange={(e) => setSqm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  aria-invalid={sqmError ? true : undefined}
                  aria-describedby={sqmError ? "sqm-err" : undefined}
                />
                <span className="unit">m²</span>
                <span className="stepper">
                  <button type="button" className="icon-btn" onClick={() => bumpSqm(-5)} aria-label="Meno 5 metri quadri">
                    −
                  </button>
                  <button type="button" className="icon-btn" onClick={() => bumpSqm(5)} aria-label="Più 5 metri quadri">
                    +
                  </button>
                </span>
              </div>
              {sqmError && (
                <p className="err" id="sqm-err">
                  {sqmError}
                </p>
              )}
              <Actions onBack={back} />
            </form>
          )}

          {step === "condition" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Com&apos;è messa la casa?
              </h1>
              <div className="q-body choices two" role="radiogroup" aria-label="Stato della casa">
                {conditionOptions.map(([v, label, hint]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={condition === v}
                    className="choice"
                    onClick={() => pickAndNext(() => setCondition(v))}
                  >
                    <strong>{label}</strong>
                    <span>{hint}</span>
                  </button>
                ))}
              </div>
              <Actions onBack={back} hideNext />
            </>
          )}

          {step === "floor" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                A che piano?
              </h1>
              <div className="q-body">
                <div className="chips" role="radiogroup" aria-label="Piano">
                  {["Terra", "1", "2", "3", "4", "5", "6+"].map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={floor === i}
                      className="chip"
                      onClick={() => setFloor(i)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: "1.75rem 0 0.75rem", fontWeight: 600 }}>C&apos;è l&apos;ascensore?</p>
                <div className="chips" role="radiogroup" aria-label="Ascensore">
                  <button type="button" role="radio" aria-checked={lift} className="chip" onClick={() => setLift(true)}>
                    Sì
                  </button>
                  <button type="button" role="radio" aria-checked={!lift} className="chip" onClick={() => setLift(false)}>
                    No
                  </button>
                </div>
              </div>
              <Actions onBack={back} />
            </form>
          )}

          {step === "extras" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                Cosa c&apos;è in più?
              </h1>
              <p className="sub">Scegli tutto quello che vale. Se non c&apos;è niente, vai avanti.</p>
              <div className="q-body chips">
                {extraOptions.map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={extras.includes(v)}
                    className="chip"
                    onClick={() => toggleExtra(v)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Actions onBack={back} nextLabel={extras.length ? "Continua" : "Niente di questo"} />
            </form>
          )}

          {step === "energy" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Che classe energetica ha?
              </h1>
              <p className="sub">La trovi sull&apos;APE. Se non lo sai, nessun problema: lo controlliamo dopo.</p>
              <div className="q-body choices two" role="radiogroup" aria-label="Classe energetica">
                {energyOptions.map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={energy === v}
                    className="choice"
                    onClick={() => pickAndNext(() => setEnergy(v))}
                  >
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
              <Actions onBack={back} hideNext />
            </>
          )}

          {step === "timing" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Quando vorresti vendere?
              </h1>
              <p className="sub">Ultima domanda. Ci aiuta a darti i consigli giusti.</p>
              <div className="q-body choices two" role="radiogroup" aria-label="Quando vuoi vendere">
                {timingOptions.map(([v, label, hint]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={timing === v}
                    className="choice"
                    onClick={() => pickAndNext(() => setTiming(v))}
                  >
                    <strong>{label}</strong>
                    <span>{hint}</span>
                  </button>
                ))}
              </div>
              <Actions onBack={back} hideNext />
            </>
          )}

          {step === "result" && result && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Ecco quanto vale casa tua.
              </h1>
              <p className="sub">
                {sqm} m² in zona {zone?.name}. Ti mostriamo anche come ci siamo arrivati.
              </p>

              <div className="result-hero">
                <div className="label">Valore di mercato stimato</div>
                <div className="result-value">
                  {Math.round(result.low / 1000)}–{Math.round(result.high / 1000)} mila €
                </div>
                <div className="range">
                  <i
                    style={{
                      left: `${Math.min(95, Math.max(5, ((result.listingPrice - result.low) / Math.max(1, result.high - result.low)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="range-legend">
                  <span>{euro(result.low)}</span>
                  <span>Annuncio consigliato: {euro(result.listingPrice)}</span>
                  <span>{euro(result.high)}</span>
                </div>
              </div>

              <div className="result-list">
                <div>
                  <span>Prezzo al m² della zona</span>
                  <span>
                    {euro(result.zone.min)} – {euro(result.zone.max)}
                  </span>
                </div>
                {result.adjustments.map((a) => (
                  <div key={a.label}>
                    <span>{a.label}</span>
                    <span>{`${a.pct > 0 ? "+" : "−"}${Math.abs(Math.round(a.pct * 100))}%`}</span>
                  </div>
                ))}
                <div className="em">
                  <span>Prezzo al m² di casa tua</span>
                  <span>
                    {euro(result.sqmLow)} – {euro(result.sqmHigh)}
                  </span>
                </div>
              </div>

              {mode === "link" && (
                <p className="notice" style={{ background: "var(--sky)", color: "var(--sky-ink)" }}>
                  Stima con zona e metri quadri. Con il tuo annuncio (piano, stato, foto) la affiniamo nel report
                  completo.
                </p>
              )}
              {zoneSource.isSample && (
                <p className="notice">
                  Versione di prova: i prezzi di zona sono valori di esempio, non ancora i dati OMI ufficiali. Non usare
                  questa cifra per decidere il prezzo.
                </p>
              )}

              <div style={{ marginTop: "3rem" }}>
                <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)" }}>
                  {chosenPackage ? `Attiviamo il pacchetto ${chosenPackage.name}?` : "Vuoi il report completo, gratis?"}
                </h2>
                <p className="sub" style={{ margin: "0.75rem 0 1.5rem" }}>
                  {chosenPackage
                    ? "Lasciaci un contatto: ti chiamiamo per partire e ti mandiamo il link per l'acconto."
                    : "Compravendite recenti nella tua zona, controllo dei documenti e prezzo d'annuncio ragionato. Te lo mandiamo entro un giorno."}
                </p>
                <LeadForm
                  sourcePage="valuta"
                  need={chosenPackage ? `Pacchetto ${chosenPackage.name}` : "Report completo"}
                  zone={zone?.name}
                  submitLabel={chosenPackage ? "Voglio partire" : "Mandami il report"}
                  payload={{
                    mode,
                    listingUrl: mode === "link" ? link : null,
                    sqm: Number(sqm),
                    condition,
                    floor,
                    lift,
                    extras,
                    energy,
                    timing,
                    low: result.low,
                    high: result.high,
                  }}
                />
              </div>

              <div className="next-grid">
                <button type="button" className="btn btn-soft" onClick={() => setIndex(0)}>
                  Ricomincia
                </button>
                <Link href="/#prezzi" className="btn btn-soft">
                  Guarda i pacchetti
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Actions({ onBack, hideNext, nextLabel = "Continua" }: { onBack: () => void; hideNext?: boolean; nextLabel?: string }) {
  return (
    <div className="q-actions">
      <button type="button" className="icon-btn" onClick={onBack} aria-label="Indietro">
        <Icon name="back" />
      </button>
      {!hideNext && (
        <>
          <button type="submit" className="btn btn-blue">
            {nextLabel}
          </button>
          <span className="kbd-hint">
            oppure premi <kbd>Invio</kbd>
          </span>
        </>
      )}
    </div>
  );
}
