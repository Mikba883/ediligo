import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Logo, LogoMark } from "@/components/Logo";
import { Footer, TopBar } from "@/components/Site";

export const metadata: Metadata = { title: "Studio grafico — Ediligo", robots: { index: false } };

const core = [
  { name: "Inchiostro", hex: "#0F1B2D", use: "Testo, sezioni scure" },
  { name: "Blu Navigli", hex: "#2D5BFF", use: "Azioni e colore firma" },
  { name: "Menta viva", hex: "#7CF0B0", use: "Dettagli su fondo scuro, risparmio" },
  { name: "Superficie", hex: "#F4F5F7", use: "Campi, card neutre" },
  { name: "Bianco", hex: "#FFFFFF", use: "Sfondo" },
];
const tints = [
  { name: "Valutazione", bg: "#DCF6E8", ink: "#0B6B41" },
  { name: "Documenti", bg: "#EBE6FF", ink: "#4A39B8" },
  { name: "Annuncio", bg: "#FFE7D6", ink: "#A4441A" },
  { name: "Foto", bg: "#DDEBFF", ink: "#1D4FC0" },
  { name: "Segretaria", bg: "#FFF3C4", ink: "#7A5600" },
  { name: "Visite", bg: "#FFE1E7", ink: "#A12748" },
];

export default function BrandPage() {
  return (
    <>
      <TopBar />
      <main id="contenuto" className="section" style={{ paddingTop: "3rem" }}>
        <div className="wrap" style={{ display: "grid", gap: "4.5rem" }}>
          <div className="head" style={{ marginBottom: 0 }}>
            <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)" }}>Un&apos;app, non un&apos;agenzia.</h1>
            <p className="sub">
              Studio grafico v2 di Ediligo. Il ragionamento completo, dal punto di vista del cliente, è in
              docs/studio-cliente.md.
            </p>
          </div>

          <section aria-labelledby="b-logo">
            <h2 id="b-logo">Logo</h2>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <span style={{ transform: "scale(1.8)", transformOrigin: "left center", marginRight: "6rem" }}>
                <Logo />
              </span>
              <LogoMark size={72} />
              <span style={{ background: "var(--ink)", padding: "1.25rem", borderRadius: 24 }}>
                <Logo light />
              </span>
            </div>
            <p className="sub" style={{ marginTop: "1.5rem" }}>
              Una casa disegnata con un tratto solo, con dentro una spunta: casa venduta, tutto a posto. Funziona come
              icona dell&apos;app.
            </p>
          </section>

          <section aria-labelledby="b-colori">
            <h2 id="b-colori">Colori</h2>
            <div className="swatches" style={{ marginTop: "1.5rem" }}>
              {core.map((c) => (
                <div className="swatch" key={c.hex}>
                  <div style={{ background: c.hex, borderBottom: "1px solid var(--line)" }} />
                  <p>
                    <strong>{c.name}</strong>
                    <br />
                    {c.hex}
                    <br />
                    <span className="muted">{c.use}</span>
                  </p>
                </div>
              ))}
            </div>
            <h3 style={{ margin: "2.5rem 0 1rem" }}>Una tinta per ogni servizio</h3>
            <div className="swatches">
              {tints.map((t) => (
                <div key={t.name} style={{ background: t.bg, color: t.ink, borderRadius: 20, padding: "1.25rem", minHeight: 120 }}>
                  <strong>{t.name}</strong>
                  <p className="small" style={{ marginTop: "0.4rem" }}>
                    {t.bg} / {t.ink}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="b-type">
            <h2 id="b-type">Caratteri</h2>
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              <p className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                Bricolage Grotesque per i titoli
              </p>
              <p style={{ fontSize: "1.3rem", maxWidth: "34em" }}>
                Geist per testo e interfaccia: pulito, leggibile, da app. Si parla al cliente con il tu, frasi corte,
                verbi concreti.
              </p>
            </div>
          </section>

          <section aria-labelledby="b-ui">
            <h2 id="b-ui">Elementi di interfaccia</h2>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem", alignItems: "center" }}>
              <span className="btn btn-blue">
                Scopri quanto vale casa tua
                <span className="btn-icon">
                  <Icon name="arrow" size={16} />
                </span>
              </span>
              <span className="btn btn-ink">Valuta casa gratis</span>
              <span className="btn btn-soft">Come funziona</span>
              <span className="dot dot-ok">Fatto</span>
              <span className="dot dot-warn">Da aggiornare</span>
              <span className="dot dot-bad">Da sistemare</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
