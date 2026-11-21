"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { euro, packages } from "@/lib/site";
import {
  type Condition,
  type Energy,
  type Extra,
  estimate,
  parseListingUrl,
  zoneForPoint,
  zoneSource,
  zoneTrend,
  zones,
} from "@/lib/valuation";

type Mode = "link" | "dati";
type StepId = "start" | "link" | "address" | "analysis" | "contact" | "otp" | "sqm" | "condition" | "floor" | "extras" | "energy" | "timing" | "result";
type Timing = "subito" | "3-mesi" | "6-mesi" | "curiosita";

const FLOWS: Record<Mode, StepId[]> = {
  link: ["start", "link", "address", "analysis", "sqm", "timing", "contact", "otp", "result"],
  dati: ["start", "address", "analysis", "sqm", "condition", "floor", "extras", "energy", "timing", "contact", "otp", "result"],
};
const NOT_QUESTIONS: StepId[] = ["start", "analysis", "contact", "otp", "result"];

type GeoHit = {
  label: string;
  street: string;
  houseNumber: string | null;
  quarter: string | null;
  postcode: string | null;
  lat: number;
  lng: number;
  omiZone: string | null;
};
type Geo =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; hit: GeoHit }
  | { status: "error"; error: string };

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

export function Funnel({
  packageId,
  initialAddress,
  initialMode,
}: {
  packageId?: string;
  initialAddress?: string;
  initialMode?: string;
}) {
  const startFromAddress = Boolean(initialAddress && initialAddress.trim().length >= 4 && /\d/.test(initialAddress));
  const startFromLink = !startFromAddress && initialMode === "link";
  const [mode, setMode] = useState<Mode>(startFromLink ? "link" : "dati");
  const [index, setIndex] = useState(
    startFromAddress ? FLOWS.dati.indexOf("analysis") : startFromLink ? FLOWS.link.indexOf("link") : 0,
  );
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [address, setAddress] = useState(initialAddress?.trim() ?? "");
  const [addressError, setAddressError] = useState("");
  const [geo, setGeo] = useState<Geo>({ status: "idle" });
  const [phase, setPhase] = useState(0);
  const [changeZone, setChangeZone] = useState(false);
  const [zoneOfficial, setZoneOfficial] = useState(false);
  const [sqm, setSqm] = useState("");
  const [sqmError, setSqmError] = useState("");
  const [condition, setCondition] = useState<Condition>("buono");
  const [floor, setFloor] = useState(1);
  const [lift, setLift] = useState(true);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [energy, setEnergy] = useState<Energy>("non-so");
  const [timing, setTiming] = useState<Timing | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [contactError, setContactError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [demo, setDemo] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const flow = FLOWS[mode];
  const step = flow[index];
  const total = flow.length - 1;
  const progress = step === "start" ? 4 : Math.round((index / total) * 100);
  const questions = flow.filter((x) => !NOT_QUESTIONS.includes(x));
  const chosenPackage = packages.find((p) => p.id === packageId && p.price > 0);

  useEffect(() => {
    titleRef.current?.focus();
  }, [step]);

  // Analisi dell'indirizzo: ricerca reale, poi le tre conferme compaiono una alla volta.
  const queried = useRef<string | null>(null);
  useEffect(() => {
    if (step !== "analysis" || queried.current === address) return;
    queried.current = address;
    const timers: number[] = [];
    setGeo({ status: "loading" });
    setPhase(0);
    setChangeZone(false);
    fetch(`/api/geocode?q=${encodeURIComponent(address)}`)
      .then(async (r) => {
        const json = await r.json().catch(() => ({}));
        if (queried.current !== address) return;
        if (!r.ok) {
          setGeo({ status: "error", error: json.error ?? "Non riusciamo a trovare l'indirizzo." });
          return;
        }
        const hit = json as GeoHit;
        setGeo({ status: "ok", hit });
        // Zona ufficiale dai confini OMI; se l'indirizzo cade in una zona senza quotazioni residenziali
        // (es. R2, agricola) usiamo la zona residenziale più vicina.
        const official = hit.omiZone && zones.some((z) => z.id === hit.omiZone) ? hit.omiZone : null;
        setZoneId(official ?? zoneForPoint(hit.lat, hit.lng)?.id ?? "");
        setZoneOfficial(Boolean(official));
        [1, 2, 3].forEach((n) => timers.push(window.setTimeout(() => setPhase(n), n * 550)));
      })
      .catch(() => {
        if (queried.current === address) setGeo({ status: "error", error: "Sei offline. Controlla la connessione e riprova." });
      });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step, address]);

  const result = useMemo(
    () => estimate({ zoneId, sqm: Number(sqm), condition, floor, lift, extras, energy }),
    [zoneId, sqm, condition, floor, lift, extras, energy],
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  const payload = () => ({
    mode,
    listingUrl: mode === "link" ? link : null,
    address: geo.status === "ok" ? geo.hit.label : address,
    zoneId,
    sqm: Number(sqm),
    condition,
    floor,
    lift,
    extras,
    energy,
    timing,
    low: result?.low ?? null,
    high: result?.high ?? null,
    package: packageId ?? null,
  });

  async function sendOtp(goNext: boolean) {
    if (!name.trim()) return setContactError("Scrivi il tuo nome.");
    if (!privacy) return setContactError("Per mandarti il codice serve il consenso privacy.");
    setBusy(true);
    setContactError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, privacyConsent: privacy }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setContactError(json.error ?? "Invio non riuscito. Riprova.");
        if (!goNext) setCodeError(json.error ?? "Invio non riuscito. Riprova.");
        return;
      }
      setSentTo(json.phone);
      setDemo(Boolean(json.demo));
      setResendIn(30);
      setCode("");
      setCodeError("");
      if (goNext) next();
    } catch {
      setContactError("Sei offline. Controlla la connessione e riprova.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(value: string) {
    if (value.length !== 6) return setCodeError("Il codice ha 6 cifre.");
    setBusy(true);
    setCodeError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: sentTo,
          code: value,
          name,
          need: chosenPackage ? `Pacchetto ${chosenPackage.name}` : "Valutazione",
          zone: zones.find((z) => z.id === zoneId)?.name,
          payload: payload(),
          privacyConsent: privacy,
          marketingConsent: marketing,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setCodeError(json.error ?? "Codice non valido.");
      next();
    } catch {
      setCodeError("Sei offline. Controlla la connessione e riprova.");
    } finally {
      setBusy(false);
    }
  }

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
  function submitAddress() {
    const v = address.trim();
    if (v.length < 4) return setAddressError("Scrivi via e numero civico.");
    if (!/\d/.test(v)) return setAddressError("Aggiungi il numero civico: serve per trovare la casa giusta.");
    setAddressError("");
    setGeo({ status: "idle" });
    queried.current = null;
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
  const stepNumber = questions.includes(step) ? questions.indexOf(step) + 1 : null;

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
              Domanda {stepNumber} di {questions.length}
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
                  <span>Incolli il link da Immobiliare.it, Idealista o Casa.it, poi indirizzo e metri quadri.</span>
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
                  <span>Indirizzo e qualche domanda veloce, una per schermata. Circa due minuti.</span>
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
              <p className="sub">Lo apriamo noi per la valutazione dettagliata. Per la stima immediata ti chiediamo solo indirizzo e metri quadri.</p>
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

          {step === "address" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAddress();
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                Dov&apos;è la casa?
              </h1>
              <p className="sub">Via e numero civico. Lo usiamo per trovare la zona e i prezzi delle case vicine.</p>
              <div className="q-body field">
                <label htmlFor="address">Indirizzo a Milano</label>
                <div className="address-box">
                  <span className="address-pin" aria-hidden="true">
                    <Icon name="pin" size={22} />
                  </span>
                  <input
                    id="address"
                    className="input input-address"
                    autoComplete="street-address"
                    placeholder="Via Giovanni Pacini 11"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    aria-invalid={addressError ? true : undefined}
                    aria-describedby={addressError ? "address-err" : undefined}
                  />
                </div>
                {addressError && (
                  <p className="err" id="address-err">
                    {addressError}
                  </p>
                )}
              </div>
              <Actions onBack={back} nextLabel="Analizza l'indirizzo" />
            </form>
          )}

          {step === "analysis" && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                {geo.status === "error" ? "Non troviamo l'indirizzo." : phase >= 3 ? "Ecco cosa abbiamo trovato." : "Stiamo analizzando l'indirizzo…"}
              </h1>
              {geo.status === "error" ? (
                <>
                  <p className="sub">{geo.error}</p>
                  <div className="q-actions">
                    <button type="button" className="btn btn-blue" onClick={back}>
                      Correggi l&apos;indirizzo
                    </button>
                    <button type="button" className="btn btn-soft" onClick={() => setChangeZone(true)}>
                      Scegli la zona a mano
                    </button>
                  </div>
                </>
              ) : (
                <ul className="analysis" aria-live="polite">
                  <AnalysisRow done={phase >= 1} label="Indirizzo" value={geo.status === "ok" ? geo.hit.label : "Cerco l'indirizzo"} />
                  <AnalysisRow
                    done={phase >= 2}
                    label="Zona"
                    value={phase >= 2 && zone ? `${zone.id}, ${zone.name}` : "Individuo la zona"}
                  />
                  <AnalysisRow
                    done={phase >= 3}
                    label="Prezzi di zona"
                    value={phase >= 3 && zone ? `${euro(zone.min)} – ${euro(zone.max)} al m², ${zoneSource.label}` : "Recupero i prezzi"}
                  />
                  {zone && zoneTrend(zone, 5) && (
                    <AnalysisRow
                      done={phase >= 3}
                      label="Andamento della zona"
                      value={phase >= 3 ? `${signPct(zoneTrend(zone, 5)!.pct)} in 5 anni (OMI)` : "Calcolo l'andamento"}
                    />
                  )}
                </ul>
              )}

              {(changeZone || geo.status === "error") && (
                <div className="q-body field" style={{ marginTop: "1.5rem" }}>
                  <label htmlFor="zone-pick">Zona OMI</label>
                  <select
                    id="zone-pick"
                    className="select"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                  >
                    <option value="">Scegli la zona</option>
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.id}, {z.name}
                      </option>
                    ))}
                  </select>
                  <div className="q-actions">
                    <button
                      type="button"
                      className="btn btn-blue"
                      disabled={!zoneId}
                      onClick={() => {
                        setChangeZone(false);
                        if (geo.status === "error") next();
                      }}
                    >
                      Usa questa zona
                    </button>
                  </div>
                </div>
              )}

              {geo.status === "ok" && phase >= 3 && !changeZone && (
                <div className="q-actions">
                  <button type="button" className="icon-btn" onClick={back} aria-label="Indietro">
                    <Icon name="back" />
                  </button>
                  <button type="button" className="btn btn-blue" onClick={next}>
                    Continua
                  </button>
                  <button type="button" className="btn btn-soft" onClick={() => setChangeZone(true)}>
                    Non è la zona giusta
                  </button>
                </div>
              )}
              {geo.status === "ok" && phase >= 3 && (
                <p className="small muted" style={{ marginTop: "1.5rem" }}>
                  {zoneOfficial
                    ? "Zona OMI ufficiale, dai confini dell'Agenzia delle Entrate (Comune di Milano, CC BY 4.0)."
                    : "Zona stimata dalla posizione: controlla che sia giusta."}{" "}
                  Indirizzi © OpenStreetMap.
                </p>
              )}
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

          {step === "contact" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp(true);
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                La tua valutazione è pronta.
              </h1>
              <p className="sub">
                Dove te la mandiamo? Verifichiamo il cellulare con un codice SMS: così sappiamo che sei tu e un nostro
                esperto può richiamarti per il report completo, gratis.
              </p>

              <div className="teaser" aria-hidden="true">
                <div className="label">Valore di mercato stimato</div>
                <div className="teaser-value">000–000 mila €</div>
                <div className="teaser-lock">
                  <Icon name="lock" size={18} />
                  Si sblocca dopo la verifica
                </div>
              </div>

              <div className="q-body form">
                <div className="field">
                  <label htmlFor="c-name">Nome</label>
                  <input id="c-name" className="input" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Cellulare</label>
                  <div className="phone-box">
                    <span className="phone-prefix" aria-hidden="true">
                      +39
                    </span>
                    <input
                      id="c-phone"
                      className="input input-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="347 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-describedby={contactError ? "c-err" : undefined}
                    />
                  </div>
                </div>
                <label className="consent full">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                  <span>
                    Ho letto l&apos;
                    <Link href="/privacy" target="_blank">
                      informativa privacy
                    </Link>{" "}
                    e voglio ricevere la valutazione ed essere richiamato per questa richiesta.
                  </span>
                </label>
                <label className="consent full">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                  <span>Facoltativo: mandatemi consigli e offerte di Ediligo. Posso disiscrivermi quando voglio.</span>
                </label>
                {contactError && (
                  <p className="err full" id="c-err" role="alert">
                    {contactError}
                  </p>
                )}
              </div>
              <div className="q-actions">
                <button type="button" className="icon-btn" onClick={back} aria-label="Indietro">
                  <Icon name="back" />
                </button>
                <button type="submit" className="btn btn-blue btn-lg" disabled={busy}>
                  {busy ? "Invio in corso" : "Mandami il codice"}
                </button>
              </div>
              <p className="small muted" style={{ marginTop: "1rem" }}>
                Niente spam e niente agenzie: ti chiamiamo noi una volta, poi decidi tu.
              </p>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp(code);
              }}
            >
              <h1 ref={titleRef} tabIndex={-1}>
                Inserisci il codice.
              </h1>
              <p className="sub">
                L&apos;abbiamo mandato via SMS al {fmtPhone(sentTo)}.
              </p>
              {demo && (
                <p className="notice">Modalità prova: gli SMS non sono ancora attivi. Usa il codice 123456.</p>
              )}
              <div className="q-body">
                <label htmlFor="otp" className="small" style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Codice di 6 cifre
                </label>
                <input
                  id="otp"
                  className="input input-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(v);
                    if (v.length === 6) verifyOtp(v);
                  }}
                  aria-invalid={codeError ? true : undefined}
                  aria-describedby={codeError ? "otp-err" : undefined}
                />
                {codeError && (
                  <p className="err" id="otp-err" role="alert">
                    {codeError}
                  </p>
                )}
              </div>
              <div className="q-actions">
                <button type="button" className="icon-btn" onClick={back} aria-label="Cambia numero">
                  <Icon name="back" />
                </button>
                <button type="submit" className="btn btn-blue" disabled={busy || code.length !== 6}>
                  {busy ? "Verifica in corso" : "Verifica e vedi il valore"}
                </button>
                <button type="button" className="btn btn-soft" disabled={resendIn > 0 || busy} onClick={() => sendOtp(false)}>
                  {resendIn > 0 ? `Invia di nuovo tra ${resendIn}s` : "Invia di nuovo"}
                </button>
              </div>
            </form>
          )}

          {step === "result" && result && (
            <>
              <h1 ref={titleRef} tabIndex={-1}>
                Ecco quanto vale casa tua.
              </h1>
              <p className="sub">
                {sqm} m² in {geo.status === "ok" ? geo.hit.label : `zona ${zone?.name}`}. Ti mostriamo anche come ci
                siamo arrivati.
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
                  <span>Zona OMI {result.zone.id}</span>
                  <span>{result.zone.name}</span>
                </div>
                <div>
                  <span>{result.baseLabel}</span>
                  <span>
                    {euro(result.baseMin)} – {euro(result.baseMax)} al m²
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
                  Stima con indirizzo e metri quadri. Con il tuo annuncio (piano, stato, foto) la affiniamo nel report
                  completo.
                </p>
              )}
              {zoneTrend(result.zone, 5) && (
                <p className="notice" style={{ background: "var(--mint)", color: "var(--mint-ink)" }}>
                  Nella tua zona i prezzi OMI sono {trendText(zoneTrend(result.zone, 5)!.pct)} negli ultimi 5 anni
                  {zoneTrend(result.zone, 1) ? ` e ${trendText(zoneTrend(result.zone, 1)!.pct)} nell'ultimo anno` : ""}.
                </p>
              )}
              {!zoneSource.isSample && (
                <p className="small muted" style={{ marginTop: "0.75rem" }}>
                  Fonte: quotazioni OMI dell&apos;Agenzia delle Entrate, {zoneSource.label.replace("Dati OMI ", "semestre ")}, abitazioni
                  civili. Confini delle zone: Comune di Milano, CC BY 4.0. È una stima, non una perizia.
                </p>
              )}
              {zoneSource.isSample && (
                <p className="notice">
                  Versione di prova: i prezzi di zona sono valori di esempio, non ancora i dati OMI ufficiali. Non usare
                  questa cifra per decidere il prezzo.
                </p>
              )}

              <div className="callback">
                <span className="callback-ico" aria-hidden="true">
                  <Icon name="phone" size={22} />
                </span>
                <div>
                  <h2>Ti chiamiamo entro un giorno lavorativo.</h2>
                  <p>
                    {chosenPackage
                      ? `Un nostro esperto ti chiama al ${fmtPhone(sentTo)} per attivare il pacchetto ${chosenPackage.name}.`
                      : `Un nostro esperto ti chiama al ${fmtPhone(sentTo)} con il report completo: compravendite vicine, controllo dei documenti e prezzo d'annuncio ragionato. Gratis.`}
                  </p>
                </div>
              </div>

              <div className="next-grid">
                <Link href="/#prezzi" className="btn btn-ink">
                  Guarda i pacchetti
                </Link>
                <Link href="/#provvigione" className="btn btn-soft">
                  Calcola quanto risparmi
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const trendText = (pct: number) =>
  pct >= 0 ? `saliti del ${Math.round(pct * 100)}%` : `scesi del ${Math.abs(Math.round(pct * 100))}%`;

const signPct = (pct: number) => `${pct >= 0 ? "+" : "−"}${Math.abs(Math.round(pct * 100))}%`;

const fmtPhone = (p: string) => p.replace(/^\+39(\d{3})(\d{3})(\d+)$/, "+39 $1 $2 $3");

function AnalysisRow({ done, label, value }: { done: boolean; label: string; value: string }) {
  return (
    <li className={done ? "done" : undefined}>
      <span className="analysis-ico" aria-hidden="true">
        {done ? <Icon name="check" size={16} stroke={3} /> : <span className="spinner" />}
      </span>
      <span>
        <span className="analysis-label">{label}</span>
        <strong>{value}</strong>
      </span>
    </li>
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
