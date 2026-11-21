"use client";

import Link from "next/link";
import { useState } from "react";
import { packages, whatsappHref } from "@/lib/site";

type Props = {
  defaultNeed?: string;
  valuation?: unknown;
  zone?: string;
  sourcePage: string;
};

const needs = [
  "Voglio la quotazione completa",
  "Voglio il pacchetto Annuncio",
  "Voglio il pacchetto Completo",
  "Ho un dubbio sui documenti",
  "Voglio solo informazioni",
];

export function LeadForm({ defaultNeed = needs[0], valuation, zone, sourcePage }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const wa = whatsappHref("Ciao, vorrei vendere casa da privato a Milano.");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const need = String(data.get("need"));
    const pkg = packages.find((p) => need.includes(p.name));
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          need,
          zone: zone ?? null,
          packageId: pkg?.id ?? null,
          valuation: valuation ?? null,
          privacyConsent: data.get("privacy") === "on",
          marketingConsent: data.get("marketing") === "on",
          sourcePage,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(json.error ?? "Invio non riuscito. Riprova tra poco.");
        return;
      }
      setState("sent");
      setMessage("Richiesta inviata. Ti ricontattiamo entro un giorno lavorativo.");
    } catch {
      setState("error");
      setMessage("Connessione assente. Controlla la rete e riprova.");
    }
  }

  if (state === "sent") {
    return (
      <p className="form-msg ok" role="status">
        {message}
      </p>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" className="input" autoComplete="given-name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="contact">Email o telefono</label>
        <input id="contact" name="contact" className="input" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field full">
        <label htmlFor="need">Cosa ti serve</label>
        <select id="need" name="need" className="select" defaultValue={defaultNeed}>
          {needs.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>
      <label className="check full">
        <input type="checkbox" name="privacy" required />
        <span>
          Ho letto l&apos;<Link href="/privacy">informativa privacy</Link> e accetto di essere ricontattato per questa
          richiesta.
        </span>
      </label>
      <label className="check full">
        <input type="checkbox" name="marketing" />
        <span>Facoltativo: voglio ricevere aggiornamenti e offerte di Ediligo. Puoi revocarlo quando vuoi.</span>
      </label>
      {state === "error" && (
        <p className="form-msg err full" role="alert">
          {message}
        </p>
      )}
      <div className="full" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Invio in corso" : "Invia la richiesta"}
        </button>
        {wa && (
          <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
            Scrivici su WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
