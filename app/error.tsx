"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for monitoring / debugging
    console.error("[Namaah error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={s.body}>
        <main style={s.page}>
          <p style={s.symbol} aria-hidden="true">✦</p>
          <h1 style={s.heading}>Something went wrong</h1>
          <p style={s.sub}>
            We&apos;re sorry — something unexpected happened. This has been noted and
            we&apos;ll look into it. Please try again or go back to the homepage.
          </p>

          <div style={s.btnRow}>
            <button onClick={reset} style={{ ...s.btn, ...s.primary }}>
              Try again
            </button>
            <Link href="/" style={{ ...s.btn, ...s.secondary }}>
              Go to homepage
            </Link>
          </div>

          {error.digest && (
            <p style={s.digest}>Error ref: {error.digest}</p>
          )}
        </main>
      </body>
    </html>
  );
}

const s: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#FDFCFA",
  },
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
    textAlign: "center" as const,
  },
  symbol: {
    fontSize: "32px",
    color: "#C8601A",
    margin: "0 0 24px",
    opacity: 0.6,
  },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "0 0 16px",
  },
  sub: {
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
  },
  btn: {
    fontSize: "13px",
    fontWeight: 500,
    padding: "11px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
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
  digest: {
    fontSize: "11px",
    color: "#C0C0CC",
    marginTop: 24,
    fontFamily: "monospace",
  },
};
