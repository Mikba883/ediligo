"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zones } from "@/lib/valuation";

export function QuickQuote() {
  const router = useRouter();
  const [zone, setZone] = useState(zones[0]?.id ?? "");
  const [sqm, setSqm] = useState("");

  return (
    <form
      className="quick"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams({ zona: zone });
        if (sqm) params.set("mq", sqm);
        router.push(`/quotazione?${params.toString()}`);
      }}
    >
      <div className="quick-row">
        <div className="field">
          <label htmlFor="q-zone">Zona di Milano</label>
          <select id="q-zone" className="select" value={zone} onChange={(e) => setZone(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-sqm">Metri quadri</label>
          <input
            id="q-sqm"
            className="input"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="72"
            value={sqm}
            onChange={(e) => setSqm(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Calcola il valore
        </button>
      </div>
      <p className="quick-note small muted">Gratis, senza registrazione. Ti servono due minuti.</p>
    </form>
  );
}
