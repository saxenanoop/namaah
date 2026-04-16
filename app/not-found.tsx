import Link from "next/link";

export default function NotFound() {
  return (
    <main style={s.page}>
      {/* Decorative */}
      <p style={s.emoji} aria-hidden="true">॰ Om ॰</p>

      <h1 style={s.heading}>Name not found</h1>
      <p style={s.sub}>
        We couldn&apos;t find that name. It may have moved or the spelling might be different.
      </p>

      <div style={s.btnRow}>
        <Link href="/search" style={{ ...s.btn, ...s.primary }}>
          Search all names →
        </Link>
        <Link href="/" style={{ ...s.btn, ...s.secondary }}>
          Go to homepage →
        </Link>
      </div>

      {/* Suggestion strip */}
      <div style={s.suggest}>
        <p style={s.suggestText}>
          You might also like:{" "}
          {["Aarav", "Saanvi", "Vihaan", "Avani", "Rudra"].map((n, i, arr) => (
            <span key={n}>
              <Link href={`/name/${n.toLowerCase()}`} style={s.suggestLink}>{n}</Link>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 120px)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    textAlign: "center" as const,
    backgroundColor: "#FDFCFA",
  },
  emoji: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "18px",
    color: "#C8601A",
    letterSpacing: "0.1em",
    margin: "0 0 24px",
    opacity: 0.8,
  },
  heading: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "36px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  sub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "15px",
    color: "#6B6B80",
    maxWidth: 440,
    lineHeight: 1.65,
    margin: "0 0 32px",
  },
  btnRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap" as const,
    justifyContent: "center",
    marginBottom: 40,
  },
  btn: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    padding: "11px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    transition: "all 0.15s ease",
  },
  primary: {
    backgroundColor: "#2E3A5C",
    color: "#ffffff",
    border: "1px solid #2E3A5C",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#2E3A5C",
    border: "1px solid #E8ECF5",
  },
  suggest: {
    borderTop: "1px solid #E8ECF5",
    paddingTop: 20,
    maxWidth: 480,
  },
  suggestText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#9898A8",
    margin: 0,
  },
  suggestLink: {
    color: "#C8601A",
    textDecoration: "none",
  },
};
