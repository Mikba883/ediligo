"use client";

import Link from "next/link";
import { useState } from "react";
import { agencyRate, euro, packages, vatRate } from "@/lib/site";

export function Savings() {
  const [price, setPrice] = useState(400000);
  const agency = price * agencyRate * (1 + vatRate);
  const ediligo = packages.find((p) => p.id === "completo")!.price;

  return (
    <div className="savings-card">
      <div>
        <h2>La provvigione resta a te.</h2>
        <p className="sub">
          Con un&apos;agenzia al 3% più IVA, una casa da {euro(price)} ti costa {euro(agency)}. Con Ediligo paghi un
          prezzo fisso.
        </p>
        <div className="slider-label">
          <label htmlFor="price">Prezzo della tua casa</label>
          <strong>{euro(price)}</strong>
        </div>
        <input
          id="price"
          className="slider"
          type="range"
          min={150000}
          max={1200000}
          step={10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <p style={{ color: "#b8c2d3" }}>Risparmi</p>
        <p className="big-number" aria-live="polite">
          {euro(agency - ediligo)}
        </p>
        <div className="compare-lines">
          <div>
            <span>Agenzia, 3% più IVA</span>
            <span>{euro(agency)}</span>
          </div>
          <div>
            <span>Ediligo Completo</span>
            <span>{euro(ediligo)}</span>
          </div>
        </div>
        <Link href="/valuta" className="btn btn-white" style={{ marginTop: "1.5rem" }}>
          Scopri quanto vale casa tua
        </Link>
      </div>
    </div>
  );
}
