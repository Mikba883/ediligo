"use client";

import { useState } from "react";
import { euro, packages, vatRate } from "@/lib/site";

const PRESETS = [2, 3, 4];

function PctField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset className="pct-field">
      <legend>{label}</legend>
      <div className="pct-row">
        {PRESETS.map((p) => (
          <button key={p} type="button" className="pct-chip" aria-pressed={value === p} onClick={() => onChange(p)}>
            {p}%
          </button>
        ))}
        <label className="pct-custom">
          <span className="sr-only">{label}, percentuale personalizzata</span>
          <input
            id={id}
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={value}
            onChange={(e) => onChange(Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
          />
          <span aria-hidden="true">%</span>
        </label>
      </div>
    </fieldset>
  );
}

export function CommissionCalc() {
  const [price, setPrice] = useState(400000);
  const [sellerPct, setSellerPct] = useState(3);
  const [buyerPct, setBuyerPct] = useState(3);
  const [withVat, setWithVat] = useState(true);

  const vat = withVat ? 1 + vatRate : 1;
  const seller = price * (sellerPct / 100) * vat;
  const buyer = price * (buyerPct / 100) * vat;
  const ediligo = packages.find((p) => p.id === "completo")!.price;

  return (
    <div className="calc" id="provvigione">
      <div className="calc-inputs">
        <h2>Quanto ti costa l&apos;agenzia?</h2>
        <p className="sub">Metti il prezzo e le percentuali che ti hanno chiesto. Ti diciamo quanto paghi tu e quanto chi compra.</p>

        <div className="field" style={{ marginTop: "2rem" }}>
          <label htmlFor="calc-price">Prezzo di vendita</label>
          <div className="price-input">
            <input
              id="calc-price"
              inputMode="numeric"
              value={price.toLocaleString("it-IT")}
              onChange={(e) => setPrice(Math.min(5_000_000, Number(e.target.value.replace(/\D/g, "")) || 0))}
            />
            <span aria-hidden="true">€</span>
          </div>
          <input
            className="slider"
            type="range"
            min={100000}
            max={1500000}
            step={5000}
            value={Math.min(1500000, Math.max(100000, price))}
            onChange={(e) => setPrice(Number(e.target.value))}
            aria-label="Prezzo di vendita"
          />
        </div>

        <PctField id="pct-seller" label="Provvigione di chi vende (tu)" value={sellerPct} onChange={setSellerPct} />
        <PctField id="pct-buyer" label="Provvigione di chi compra" value={buyerPct} onChange={setBuyerPct} />

        <label className="consent" style={{ marginTop: "1.25rem" }}>
          <input type="checkbox" checked={withVat} onChange={(e) => setWithVat(e.target.checked)} />
          <span>Aggiungi l&apos;IVA al 22% (l&apos;agenzia la applica quasi sempre sulla provvigione)</span>
        </label>
      </div>

      <div className="calc-out" aria-live="polite">
        <div className="calc-row">
          <span>Paghi tu</span>
          <strong>{euro(seller)}</strong>
        </div>
        <div className="calc-row">
          <span>Paga chi compra</span>
          <strong>{euro(buyer)}</strong>
        </div>
        <div className="calc-row calc-total">
          <span>All&apos;agenzia in totale</span>
          <strong>{euro(seller + buyer)}</strong>
        </div>

        <div className="calc-ediligo">
          <p className="calc-kicker">Con Ediligo</p>
          <div className="calc-row">
            <span>Paghi tu, prezzo fisso</span>
            <strong>{euro(ediligo)}</strong>
          </div>
          <div className="calc-row">
            <span>Paga chi compra</span>
            <strong>0 €</strong>
          </div>
        </div>

        <p className="calc-save-label">Risparmi tu</p>
        <p className="big-number">{euro(Math.max(0, seller - ediligo))}</p>
        <p className="calc-note">
          E chi compra risparmia {euro(buyer)}: un argomento in più in trattativa, perché a parità di spesa può offrirti
          di più.
        </p>
      </div>
    </div>
  );
}
