import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip" href="#contenuto">
        Vai al contenuto
      </a>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Ediligo, home">
          <Logo />
        </Link>
        <nav className="nav" aria-label="Principale">
          <Link href="/#come-funziona">Come funziona</Link>
          <Link href="/#prezzi">Prezzi</Link>
          <Link href="/#domande">Domande</Link>
          <Link href="/quotazione" className="btn btn-dark">
            Calcola il valore
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <span className="logo">
            <Logo />
          </span>
          <p style={{ marginTop: "0.75rem" }}>
            Servizi per chi vende casa da privato a Milano. Ediligo non è un&apos;agenzia immobiliare: non tratta per
            conto tuo e non prende percentuali sulla vendita.
          </p>
        </div>
        <div>
          <p>
            <Link href="/privacy">Informativa privacy</Link>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <Link href="/brand">Studio grafico</Link>
          </p>
          <p style={{ marginTop: "0.5rem" }}>Ragione sociale e partita IVA: da completare</p>
        </div>
      </div>
    </footer>
  );
}
