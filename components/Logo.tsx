// Simbolo: l'arco di apertura della porta, come nelle planimetrie.
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M5 27 H27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M7 27 V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M7 7 A20 20 0 0 1 27 27" stroke="var(--giallo)" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">ediligo</span>
    </span>
  );
}
