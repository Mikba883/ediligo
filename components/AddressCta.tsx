"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";

// La CTA principale: il primo gesto è scrivere l'indirizzo.
export function AddressCta({ id, dark = false }: { id: string; dark?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className={`addr-cta${dark ? " addr-cta-dark" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v.length < 4) return setError("Scrivi via e numero civico.");
        if (!/\d/.test(v)) return setError("Aggiungi il numero civico.");
        router.push(`/valuta?indirizzo=${encodeURIComponent(v)}`);
      }}
    >
      <label htmlFor={id} className="addr-label">
        Indirizzo della casa a Milano
      </label>
      <div className="addr-row">
        <span className="addr-pin" aria-hidden="true">
          <Icon name="pin" size={22} />
        </span>
        <input
          id={id}
          className="addr-input"
          autoComplete="street-address"
          placeholder="Via e numero civico"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : `${id}-hint`}
        />
        <button type="submit" className="btn btn-blue addr-btn">
          Scopri quanto vale
        </button>
      </div>
      {error ? (
        <p className="err" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : (
        <p className="addr-hint" id={`${id}-hint`}>
          Gratis, in 2 minuti, senza impegno.{" "}
          <Link href="/valuta?da=link">Hai già un annuncio? Incolla il link</Link>
        </p>
      )}
    </form>
  );
}

// Barra fissa in basso su telefono.
export function StickyCta() {
  return (
    <div className="sticky-cta">
      <Link href="/valuta" className="btn btn-blue">
        Scopri quanto vale casa tua
      </Link>
    </div>
  );
}
