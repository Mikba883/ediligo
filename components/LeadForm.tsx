"use client";

import Link from "next/link";
import { useState } from "react";
import { whatsappHref } from "@/lib/site";

type Props = {
  need: string;
  payload?: Record<string, unknown>;
  zone?: string;
  sourcePage: string;
  submitLabel?: string;
};

export function LeadForm({ need, payload, zone, sourcePage, submitLabel = "Invia" }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const wa = whatsappHref("Ciao, vorrei vendere casa da privato a Milano.");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
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
          valuation: payload ?? null,
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
      setMessage("Fatto. Ti scriviamo entro un giorno lavorativo.");
    } catch {
      setState("error");
      setMessage("Sei offline. Controlla la connessione e riprova.");
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
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" className="input" autoComplete="given-name" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="contact">Email o cellulare</label>
        <input id="contact" name="contact" className="input" autoComplete="email" required maxLength={200} />
      </div>
      <label className="consent full">
        <input type="checkbox" name="privacy" required />
        <span>
          Ho letto l&apos;<Link href="/privacy">informativa privacy</Link> e voglio essere ricontattato per questa
          richiesta.
        </span>
      </label>
      <label className="consent full">
        <input type="checkbox" name="marketing" />
        <span>Facoltativo: mandatemi consigli e offerte di Ediligo. Posso disiscrivermi quando voglio.</span>
      </label>
      {state === "error" && (
        <p className="form-msg err full" role="alert">
          {message}
        </p>
      )}
      <div className="full" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn-blue" disabled={state === "sending"}>
          {state === "sending" ? "Invio in corso" : submitLabel}
        </button>
        {wa && (
          <a className="btn btn-soft" href={wa} target="_blank" rel="noopener noreferrer">
            Scrivici su WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
