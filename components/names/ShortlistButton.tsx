"use client";

import { useState } from "react";
import { useShortlist } from "@/components/names/NameCard";

import type { BabyName } from "@/data/names";

interface ShortlistButtonProps {
  nameObj: BabyName;
}

export default function ShortlistButton({ nameObj }: ShortlistButtonProps) {
  const { isSaved, toggle } = useShortlist();
  const saved = isSaved(nameObj.slug);
  const [pulse, setPulse] = useState(false);

  function handleClick() {
    toggle(nameObj);
    if (!saved) {
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? `Remove ${nameObj.name} from shortlist` : `Save ${nameObj.name} to shortlist`}
      aria-pressed={saved}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        gap:             "8px",
        padding:         "10px 24px",
        borderRadius:    "10px",
        border:          `1.5px solid ${saved ? "#2E3A5C" : "#C8601A"}`,
        backgroundColor: saved ? "#2E3A5C" : "transparent",
        color:           saved ? "#ffffff" : "#C8601A",
        fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
        fontWeight:      500,
        fontSize:        "14px",
        cursor:          "pointer",
        transition:      "all 0.2s ease",
        transform:       pulse ? "scale(1.05)" : "scale(1)",
        letterSpacing:   "0.01em",
      }}
    >
      <span style={{ fontSize: "18px", lineHeight: 1 }}>
        {saved ? "♥" : "♡"}
      </span>
      {saved ? "Saved to Shortlist" : "Save to Shortlist"}
    </button>
  );
}
