import Link from "next/link";
import { Logo } from "./Logo";

export function TopBar() {
  return (
    <header className="topbar">
      <a className="skip" href="#contenuto">
        Vai al contenuto
      </a>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Ediligo, home">
          <Logo />
        </Link>
        <nav className="topnav" aria-label="Principale">
          <Link href="/#servizi">Servizi</Link>
          <Link href="/#prezzi">Prezzi</Link>
          <Link href="/#domande">Domande</Link>
          <Link href="/valuta" className="btn btn-ink">
            Valuta casa gratis
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div style={{ maxWidth: 440 }}>
          <Logo />
          <p style={{ marginTop: "0.9rem" }}>
            L&apos;app per vendere casa da privato a Milano. Ediligo non è un&apos;agenzia immobiliare: non tratta al
            posto tuo e non prende percentuali sulla vendita.
          </p>
        </div>
        <nav aria-label="Link utili">
          <Link href="/valuta">Valuta casa</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/brand">Studio grafico</Link>
        </nav>
      </div>
    </footer>
  );
}
