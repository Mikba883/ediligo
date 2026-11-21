import { Icon } from "./Icon";

// Il telefono con l'app: mostra cosa ottiene il cliente, non come è fatto il servizio.
export function PhoneHero() {
  return (
    <div className="stage" aria-label="Anteprima dell'app Ediligo" role="img">
      <div className="phone" aria-hidden="true">
        <div className="screen">
          <div className="notch" />
          <div className="app-head">
            <strong>Casa tua</strong>
            <span className="muted">Via Pacini, 72 m²</span>
          </div>

          <div className="app-card">
            <div className="label">Valore di mercato</div>
            <div className="app-value">355–455 mila €</div>
            <div className="range">
              <i />
            </div>
            <div className="range-legend">
              <span>min</span>
              <span>Annuncio consigliato 430 mila €</span>
            </div>
          </div>

          <div className="app-card">
            <div className="label" style={{ marginBottom: "0.3rem" }}>
              Pronta per vendere
            </div>
            <div className="check-row">
              <span>Valutazione</span>
              <span className="dot dot-ok">Fatto</span>
            </div>
            <div className="check-row">
              <span>Annuncio e foto</span>
              <span className="dot dot-ok">Pronti</span>
            </div>
            <div className="check-row">
              <span>APE</span>
              <span className="dot dot-warn">Sopralluogo giovedì</span>
            </div>
            <div className="check-row">
              <span>Veranda chiusa</span>
              <span className="dot dot-bad">Da verificare</span>
            </div>
          </div>

          <div className="app-card" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <span className="ico" style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 12, background: "var(--sky)", color: "var(--sky-ink)" }}>
              <Icon name="calendar" size={18} />
            </span>
            <span>
              <strong style={{ display: "block" }}>3 visite questa settimana</strong>
              <span className="muted">Tutti con mutuo già approvato</span>
            </span>
          </div>

          <div className="app-tabbar">
            <span className="on">
              <i />
              Casa
            </span>
            <span>
              <i />
              Documenti
            </span>
            <span>
              <i />
              Visite
            </span>
            <span>
              <i />
              Chat
            </span>
          </div>
        </div>
      </div>

      <div className="toast toast-1" aria-hidden="true">
        <span className="ico" style={{ background: "var(--mint)", color: "var(--mint-ink)" }}>
          <Icon name="check" />
        </span>
        <span>
          <strong>Annuncio pubblicato</strong>
          Immobiliare.it, Idealista, Casa.it
        </span>
      </div>
      <div className="toast toast-2" aria-hidden="true">
        <span className="ico" style={{ background: "var(--lilac)", color: "var(--lilac-ink)" }}>
          <Icon name="chat" />
        </span>
        <span>
          <strong>Nuovo contatto filtrato</strong>
          Giulia, mutuo approvato, vuole visitare sabato
        </span>
      </div>
      <div className="toast toast-3" aria-hidden="true">
        <span className="ico" style={{ background: "var(--butter)", color: "var(--butter-ink)" }}>
          <Icon name="euro" />
        </span>
        <span>
          <strong>Provvigione risparmiata</strong>
          13.650 € restano a te
        </span>
      </div>
    </div>
  );
}
