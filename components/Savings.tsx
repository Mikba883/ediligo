"use client";

import { useState } from "react";
import { agencyRate, euro, packages, vatRate } from "@/lib/site";

export function Savings() {
  const [price, setPrice] = useState(400000);
  const agency = price * agencyRate * (1 + vatRate);
  const ediligo = packages.find((p) => p.id === "completo")!.price;

  return (
    <div className="savings">
      <div>
        <h3>Quanto risparmi rispetto a un&apos;agenzia</h3>
        <p className="muted" style={{ marginTop: "0.5rem" }}>
          Calcolo con una provvigione del 3% più IVA a carico di chi vende, frequente a Milano. Le agenzie possono
          chiedere di più o di meno: verifica sempre l&apos;incarico.
        </p>
        <label htmlFor="price" className="small" style={{ display: "block", marginTop: "1.5rem", fontWeight: 600 }}>
          Prezzo di vendita: {euro(price)}
        </label>
        <input
          id="price"
          type="range"
          min={150000}
          max={1200000}
          step={10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <table className="savings-table">
        <caption className="small muted" style={{ textAlign: "left", paddingBottom: "0.5rem" }}>
          Costi per chi vende una casa da {euro(price)}
        </caption>
        <tbody>
          <tr>
            <td>Agenzia, 3% più IVA</td>
            <td>{euro(agency)}</td>
          </tr>
          <tr>
            <td>Ediligo, pacchetto Completo</td>
            <td>{euro(ediligo)}</td>
          </tr>
          <tr className="total">
            <td>Ti restano in tasca</td>
            <td>{euro(agency - ediligo)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
