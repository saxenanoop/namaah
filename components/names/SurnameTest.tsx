"use client";

import { useState } from "react";

interface SurnameTestProps {
  name: string;
}

export default function SurnameTest({ name }: SurnameTestProps) {
  const [surname, setSurname] = useState("");

  return (
    <div style={s.wrap}>
      <p style={s.label}>HOW DOES IT SOUND WITH YOUR SURNAME?</p>

      <input
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        placeholder="Type your surname here…"
        style={s.input}
        maxLength={40}
        aria-label="Enter your surname to preview the full name"
      />

      {/* Live preview */}
      <div style={s.preview} aria-live="polite" aria-label="Name preview">
        {name}
        {surname.trim() ? (
          <span style={s.surname}> {surname.trim()}</span>
        ) : (
          <span style={s.surnamePlaceholder}> Sharma</span>
        )}
      </div>

      <p style={s.note}>
        💬 Say it out loud! A name flows best when the syllable stress alternates.
      </p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop:    "28px",
    padding:      "20px",
    backgroundColor: "#FDFCFA",
    borderRadius: "12px",
    border:       "1px solid #E8ECF5",
  },
  label: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.08em",
    color:         "#9898A8",
    margin:        "0 0 12px",
  },
  input: {
    width:           "100%",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "14px",
    color:           "#1A1A2E",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "10px 14px",
    outline:         "none",
    backgroundColor: "#ffffff",
    boxSizing:       "border-box" as const,
    marginBottom:    "16px",
    transition:      "border-color 0.15s ease",
  },
  preview: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "32px",
    fontWeight:  600,
    color:       "#2E3A5C",
    lineHeight:  1.2,
    marginBottom: "12px",
    minHeight:   "42px",
  },
  surname: {
    color: "#C8601A",
  },
  surnamePlaceholder: {
    color:   "#C8D0E0",
    fontStyle: "italic",
  },
  note: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#9898A8",
    margin:     0,
    lineHeight: 1.5,
  },
};
