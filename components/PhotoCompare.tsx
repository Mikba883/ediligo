"use client";

import { useState } from "react";

// Stanza disegnata in SVG: "prima" spenta, "dopo" luminosa e arredata. Il cursore lo muove l'utente.
function Room({ staged }: { staged: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className="room" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="200" fill="#f3efe8" />
      <rect y="150" width="320" height="50" fill="#d9c7ad" />
      <rect x="196" y="28" width="86" height="96" rx="4" fill="#cfe3ff" stroke="#ffffff" strokeWidth="6" />
      <line x1="239" y1="28" x2="239" y2="124" stroke="#ffffff" strokeWidth="4" />
      {staged && (
        <>
          <rect x="30" y="112" width="130" height="44" rx="12" fill="#2d5bff" />
          <rect x="38" y="96" width="44" height="28" rx="8" fill="#7cf0b0" />
          <rect x="108" y="96" width="44" height="28" rx="8" fill="#ffe7d6" />
          <rect x="176" y="146" width="60" height="8" rx="4" fill="#0f1b2d" />
          <circle cx="292" cy="140" r="16" fill="#0b6b41" />
          <rect x="288" y="150" width="8" height="12" fill="#a4441a" />
          <rect x="60" y="40" width="70" height="44" rx="4" fill="#ebe6ff" stroke="#ffffff" strokeWidth="4" />
        </>
      )}
    </svg>
  );
}

export function PhotoCompare() {
  const [pos, setPos] = useState(55);
  return (
    <div className="compare">
      <div className="room before">
        <Room staged={false} />
      </div>
      <div className="after-wrap" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Room staged />
      </div>
      <span className="lbl" style={{ left: "0.6rem" }}>
        Prima
      </span>
      <span className="lbl" style={{ right: "0.6rem" }}>
        Dopo, con arredo virtuale
      </span>
      <span className="handle" style={{ left: `${pos}%` }} />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Confronta la foto prima e dopo"
      />
    </div>
  );
}
