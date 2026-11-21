"use client";

import { useMemo, useState } from "react";
import { LeadForm } from "./LeadForm";
import { euro } from "@/lib/site";
import {
  type Condition,
  type Energy,
  type Outdoor,
  estimate,
  zoneSource,
  zones,
} from "@/lib/valuation";

type Props = { initialZone?: string; initialSqm?: string };

const conditions: [Condition, string][] = [
  ["da-ristrutturare", "Da ristrutturare"],
  ["buono", "Buono"],
  ["ristrutturato", "Ristrutturato"],
  ["nuovo", "Nuovo"],
];
const outdoors: [Outdoor, string][] = [
  ["nessuno", "Nessuno"],
  ["balcone", "Balcone"],
  ["terrazzo", "Terrazzo"],
];
const energies: [Energy, string][] = [
  ["non-so", "Non so"],
  ["alta", "A o B"],
  ["media", "C o D"],
  ["bassa", "E, F o G"],
];

function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="field full">
      <legend>{legend}</legend>
      <div className="segmented" style={{ marginTop: "0.35rem" }}>
        {options.map(([v, label]) => (
          <label key={v}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const pct = (n: number) => `${n > 0 ? "+" : "−"}${Math.abs(Math.round(n * 100))}%`;

export function ValuationTool({ initialZone, initialSqm }: Props) {
  const [zoneId, setZoneId] = useState(
    zones.some((z) => z.id === initialZone) ? initialZone! : (zones[0]?.id ?? ""),
  );
  const [sqm, setSqm] = useState(initialSqm?.replace(/\D/g, "") ?? "");
  const [condition, setCondition] = useState<Condition>("buono");
  const [floor, setFloor] = useState("1");
  const [lift, setLift] = useState(true);
  const [outdoor, setOutdoor] = useState<Outdoor>("balcone");
  const [garage, setGarage] = useState(false);
  const [energy, setEnergy] = useState<Energy>("non-so");

  const result = useMemo(
    () =>
      estimate({
        zoneId,
        sqm: Number(sqm),
        condition,
        floor: Number(floor),
        lift,
        outdoor,
        garage,
        energy,
      }),
    [zoneId, sqm, condition, floor, lift, outdoor, garage, energy],
  );

  const sqmNumber = Number(sqm);
  const sqmError = sqm !== "" && (sqmNumber < 15 || sqmNumber > 1000) ? "Inserisci un valore tra 15 e 1000 m²." : "";

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()} aria-describedby="tool-help">
        <p id="tool-help" className="full muted small">
          La stima si aggiorna mentre compili. Nessun dato viene inviato finché non ci chiedi di ricontattarti.
        </p>
        <div className="field">
          <label htmlFor="zone">Zona</label>
          <select id="zone" className="select" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sqm">Superficie commerciale (m²)</label>
          <input
            id="sqm"
            className="input"
            inputMode="numeric"
            placeholder="72"
            value={sqm}
            aria-invalid={sqmError ? true : undefined}
            aria-describedby={sqmError ? "sqm-err" : undefined}
            onChange={(e) => setSqm(e.target.value.replace(/\D/g, ""))}
          />
          {sqmError && (
            <span id="sqm-err" className="small" style={{ color: "var(--mattone)" }}>
              {sqmError}
            </span>
          )}
        </div>
        <p className="full small muted" style={{ marginTop: "-0.4rem" }}>
          {zones.find((z) => z.id === zoneId)?.areas}
        </p>

        <Segmented name="cond" legend="Stato della casa" options={conditions} value={condition} onChange={setCondition} />

        <div className="field">
          <label htmlFor="floor">Piano</label>
          <select id="floor" className="select" value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="0">Terra</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n === 8 ? "8 o più" : n}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="lift">Ascensore</label>
          <select id="lift" className="select" value={lift ? "si" : "no"} onChange={(e) => setLift(e.target.value === "si")}>
            <option value="si">Sì</option>
            <option value="no">No</option>
          </select>
        </div>

        <Segmented name="out" legend="Spazi esterni" options={outdoors} value={outdoor} onChange={setOutdoor} />
        <Segmented name="energy" legend="Classe energetica" options={energies} value={energy} onChange={setEnergy} />

        <label className="check full" style={{ fontSize: "var(--t-s)" }}>
          <input type="checkbox" checked={garage} onChange={(e) => setGarage(e.target.checked)} />
          <span>C&apos;è un box o un posto auto compreso nella vendita</span>
        </label>
      </form>

      <aside className="result" aria-live="polite">
        <div className="dossier">
          <div className="dossier-head">
            <strong>La tua stima</strong>
            <span className="small muted">{zoneSource.label}</span>
          </div>
          {result ? (
            <>
              <div className="dossier-estimate">
                <span className="small">Valore stimato</span>
                <span className="value">
                  {euro(result.low)} – {euro(result.high)}
                </span>
              </div>
              <ul className="adjustments">
                <li>
                  <span>Prezzo al m² nella zona</span>
                  <span>
                    {euro(result.zone.min)} – {euro(result.zone.max)}
                  </span>
                </li>
                {result.adjustments.map((a) => (
                  <li key={a.label}>
                    <span>{a.label}</span>
                    <span>{pct(a.pct)}</span>
                  </li>
                ))}
                <li>
                  <span>Prezzo al m² per la tua casa</span>
                  <span>
                    {euro(result.sqmLow)} – {euro(result.sqmHigh)}
                  </span>
                </li>
                <li>
                  <strong>Prezzo d&apos;annuncio consigliato</strong>
                  <strong>{euro(result.listingPrice)}</strong>
                </li>
              </ul>
              <p className="small muted" style={{ padding: "0 1.25rem 1rem" }}>
                L&apos;annuncio parte circa il 6% sopra il centro della stima, lo sconto medio in trattativa a
                Milano. È una stima, non una perizia.
              </p>
            </>
          ) : (
            <p className="result-empty muted">Inserisci i metri quadri per vedere la stima.</p>
          )}
          {zoneSource.isSample && (
            <p className="sample-flag">
              Prototipo: le fasce di prezzo sono valori di esempio, non ancora le quotazioni OMI ufficiali. Non usare
              questa cifra per decidere il prezzo.
            </p>
          )}
        </div>

        {result && (
          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "var(--t-xl)" }}>Vuoi la quotazione completa?</h2>
            <p className="muted" style={{ margin: "0.5rem 0 1.25rem" }}>
              Con i prezzi delle compravendite recenti nella tua zona e il controllo dei documenti. È gratis.
            </p>
            <LeadForm
              sourcePage="quotazione"
              zone={result.zone.name}
              valuation={{ sqm: sqmNumber, condition, floor: Number(floor), lift, outdoor, garage, energy, low: result.low, high: result.high }}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
