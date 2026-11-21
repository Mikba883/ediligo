import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { LogoMark } from "@/components/Logo";
import { Planimetria } from "@/components/Planimetria";

export const metadata: Metadata = { title: "Studio grafico — Ediligo", robots: { index: false } };

const colors = [
  { name: "Verde persiana", hex: "#1D4A3A", use: "Colore principale, titoli, sezioni scure" },
  { name: "Inchiostro", hex: "#17302A", use: "Testo" },
  { name: "Giallo Maria Teresa", hex: "#E6B54A", use: "Accento: bottone principale, porte nella planimetria" },
  { name: "Intonaco", hex: "#ECEAE4", use: "Sfondi alternati" },
  { name: "Bianco", hex: "#FFFFFF", use: "Sfondo principale" },
  { name: "Rosso mattone", hex: "#B5432F", use: "Solo stato «da sistemare» ed errori" },
];

export default function BrandPage() {
  return (
    <>
      <Header />
      <main id="contenuto" className="section" style={{ paddingTop: "3rem" }}>
        <div className="wrap" style={{ display: "grid", gap: "4rem" }}>
          <div>
            <h1>Studio grafico</h1>
            <p className="lead" style={{ marginTop: "1rem" }}>
              L&apos;idea: il fascicolo della casa. Chi vende da solo ha paura delle carte, quindi la marca nasce dalla
              planimetria, dal semaforo dei documenti e dai colori della Milano costruita. Il documento completo è in
              docs/studio-grafico.md.
            </p>
          </div>

          <section aria-labelledby="b-logo">
            <h2 id="b-logo">Logo</h2>
            <div style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <span className="logo" style={{ transform: "scale(2)", transformOrigin: "left center" }}>
                <LogoMark />
                <span className="logo-word">ediligo</span>
              </span>
              <span style={{ marginLeft: "8rem", color: "var(--verde)" }}>
                <LogoMark size={64} />
              </span>
              <span style={{ background: "var(--verde)", color: "white", padding: "1rem", borderRadius: 6 }}>
                <LogoMark size={48} />
              </span>
            </div>
            <p className="muted" style={{ marginTop: "1.5rem" }}>
              Il simbolo è l&apos;arco di apertura della porta, come si disegna nelle planimetrie: apri la tua casa al
              mercato, con le chiavi in mano tua.
            </p>
          </section>

          <section aria-labelledby="b-colori">
            <h2 id="b-colori">Colori</h2>
            <div className="swatches" style={{ marginTop: "1.5rem" }}>
              {colors.map((c) => (
                <div className="swatch" key={c.hex}>
                  <div style={{ background: c.hex }} />
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
          </section>

          <section aria-labelledby="b-type">
            <h2 id="b-type">Caratteri</h2>
            <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
              <p style={{ fontStretch: "118%", fontWeight: 700, fontSize: "var(--t-3xl)", color: "var(--verde)", lineHeight: 1.05 }}>
                Archivo esteso per i titoli
              </p>
              <p style={{ fontSize: "var(--t-l)" }}>Archivo normale per il testo, leggibile anche in piccolo.</p>
              <p style={{ fontStretch: "75%", fontSize: "var(--t-l)" }}>Archivo condensato per le quote: 8,40 m, 72 m²</p>
            </div>
          </section>

          <section aria-labelledby="b-stati">
            <h2 id="b-stati">Semaforo dei documenti</h2>
            <ul className="status-list" style={{ maxWidth: 520, padding: 0, marginTop: "1rem" }}>
              <li>
                <span>Documento in regola</span>
                <span className="status status-ok">In regola</span>
              </li>
              <li>
                <span>Da aggiornare o completare</span>
                <span className="status status-warn">Da aggiornare</span>
              </li>
              <li>
                <span>Può bloccare il rogito</span>
                <span className="status status-bad">Da sistemare</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="b-plan" style={{ maxWidth: 560 }}>
            <h2 id="b-plan">Immagine di marca</h2>
            <div className="dossier" style={{ marginTop: "1.5rem", padding: "1rem" }}>
              <Planimetria />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
