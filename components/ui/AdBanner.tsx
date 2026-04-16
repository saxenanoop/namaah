"use client";

import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
}

// Extend Window to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdBanner({
  slot,
  format = "auto",
  className,
  style,
}: AdBannerProps) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (e.g. ad blocker) — fail silently
    }
  }, [isDev]);

  // ── Dimension helpers ──────────────────────────────────────────────────────
  const dims: Record<string, React.CSSProperties> = {
    auto:       { display: "block", width: "100%", minHeight: "90px" },
    horizontal: { display: "block", width: "100%", height: "90px" },
    rectangle:  { display: "block", width: "300px", height: "250px", maxWidth: "100%" },
  };

  // ── Dev placeholder ────────────────────────────────────────────────────────
  if (isDev) {
    return (
      <div
        className={className}
        style={{
          ...dims[format],
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
          border:         "1px dashed #D0D0DC",
          borderRadius:   "6px",
          color:          "#9898A8",
          fontSize:       "11px",
          fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
          letterSpacing:  "0.06em",
          userSelect:     "none",
          ...style,
        }}
        aria-hidden="true"
        data-ad-slot={slot}
      >
        Ad space · {format} · slot: {slot}
      </div>
    );
  }

  // ── Production AdSense ins element ─────────────────────────────────────────
  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ ...dims[format], ...style }}
      data-ad-client="ca-pub-YOUR-ADSENSE-ID"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={format === "auto" || format === "horizontal" ? "true" : "false"}
      aria-label="Advertisement"
    />
  );
}
