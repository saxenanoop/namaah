"use client";

import { useState, useEffect } from "react";

/**
 * BackToTop — a fixed round indigo button that appears after scrolling 400px.
 * Import and render this anywhere on a page that needs it.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={s.btn}
      aria-label="Back to top"
      title="Back to top"
    >
      {/* Up arrow SVG */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

const s: React.CSSProperties & Record<string, React.CSSProperties> = {
  btn: {
    position:        "fixed",
    bottom:          "60px",
    right:           "60px",
    zIndex:          150,
    width:           "44px",
    height:          "44px",
    borderRadius:    "50%",
    backgroundColor: "#2E3A5C",
    border:          "none",
    cursor:          "pointer",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    boxShadow:       "0 4px 16px rgba(46,58,92,0.25)",
    transition:      "opacity 0.2s ease, transform 0.2s ease",
  },
} as Record<string, React.CSSProperties>;
