// Planimetria di esempio disegnata a linea: è l'immagine di marca di Ediligo.
// La veranda chiusa evidenziata è la difformità più comune nelle case milanesi.

export function Planimetria() {
  return (
    <svg
      className="plan"
      viewBox="0 0 560 470"
      role="img"
      aria-labelledby="plan-title plan-desc"
    >
      <title id="plan-title">Planimetria di esempio di un trilocale di 72 metri quadri</title>
      <desc id="plan-desc">
        Soggiorno con cucina, camera, cameretta, bagno e una veranda chiusa evidenziata in rosso perché da verificare in
        Comune.
      </desc>

      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--mattone)" strokeWidth="1.6" />
        </pattern>
      </defs>

      {/* Quote */}
      <g className="plan-dim">
        <line x1="60" y1="26" x2="420" y2="26" />
        <line x1="60" y1="19" x2="60" y2="33" />
        <line x1="420" y1="19" x2="420" y2="33" />
        <text x="240" y="18" textAnchor="middle">8,40 m</text>
        <line x1="30" y1="50" x2="30" y2="418" />
        <line x1="23" y1="50" x2="37" y2="50" />
        <line x1="23" y1="418" x2="37" y2="418" />
        <text x="22" y="234" textAnchor="middle" transform="rotate(-90 22 234)">8,60 m</text>
      </g>

      {/* Veranda chiusa: la difformità */}
      <g className="plan-issue">
        <rect x="420" y="262" width="74" height="156" fill="url(#hatch)" />
        <rect x="420" y="262" width="74" height="156" fill="none" className="plan-issue-line" />
        <text x="508" y="330" className="plan-issue-text">veranda</text>
        <text x="508" y="348" className="plan-issue-text">chiusa</text>
      </g>

      {/* Muri */}
      <g className="plan-walls">
        <rect x="60" y="50" width="360" height="368" pathLength={1} />
        <path d="M280 50 V250" pathLength={1} />
        <path d="M60 250 H190" pathLength={1} />
        <path d="M232 250 H420" pathLength={1} />
        <path d="M200 250 V418" pathLength={1} />
        <path d="M280 250 V340 H420" pathLength={1} />
      </g>

      {/* Finestre */}
      <g className="plan-windows">
        <path d="M110 47 H200 M110 53 H200" />
        <path d="M320 47 H390 M320 53 H390" />
        <path d="M57 300 V370 M63 300 V370" />
        <path d="M417 130 V200 M423 130 V200" />
      </g>

      {/* Porte: lo stesso arco del logo */}
      <g className="plan-doors">
        <path d="M280 205 L245 205 M245 205 A35 35 0 0 0 280 240" />
        <path d="M190 250 L190 285 M190 285 A42 42 0 0 0 232 250" />
        <path d="M280 300 L315 300 M315 300 A35 35 0 0 0 280 265" />
        <path d="M200 300 L165 300 M165 300 A35 35 0 0 1 200 335" />
        <path d="M240 418 L240 383 M240 383 A38 38 0 0 1 278 418" />
        <path d="M280 395 L312 395 M312 395 A32 32 0 0 0 280 363" />
      </g>

      {/* Ambienti */}
      <g className="plan-rooms">
        <text x="170" y="145" textAnchor="middle">Soggiorno e cucina</text>
        <text x="170" y="165" textAnchor="middle" className="plan-sqm">24 m²</text>
        <text x="350" y="145" textAnchor="middle">Camera</text>
        <text x="350" y="165" textAnchor="middle" className="plan-sqm">15 m²</text>
        <text x="130" y="345" textAnchor="middle">Cameretta</text>
        <text x="130" y="365" textAnchor="middle" className="plan-sqm">13 m²</text>
        <text x="350" y="290" textAnchor="middle">Bagno</text>
        <text x="350" y="310" textAnchor="middle" className="plan-sqm">6 m²</text>
        <text x="350" y="375" textAnchor="middle">Lavanderia</text>
        <text x="350" y="395" textAnchor="middle" className="plan-sqm">6 m²</text>
      </g>
    </svg>
  );
}
