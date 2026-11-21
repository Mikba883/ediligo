// Simbolo: una casa disegnata con un solo tratto che diventa una spunta.
// "Casa venduta, tutto a posto."
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="10" fill="var(--blue)" />
      <path
        d="M8 16.5 L16 9.5 L24 16.5 M10.5 15 V23 H21.5 V15"
        fill="none"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 18.8 L15.3 21 L19.2 17" fill="none" stroke="var(--lime)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo${light ? " logo-light" : ""}`}>
      <LogoMark />
      <span className="logo-word">ediligo</span>
    </span>
  );
}
