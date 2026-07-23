"use client";

import React from "react";
import type { BabyName } from "@/data/names";

interface ShortlistButtonProps {
  nameObj: BabyName;
  isSaved?: boolean;
  onToggle?: (name: BabyName) => void;
}

export default function ShortlistButton({
  nameObj,
  isSaved = false,
  onToggle,
}: ShortlistButtonProps) {
  return (
    <button
      onClick={() => onToggle?.(nameObj)}
      aria-label={isSaved ? `Remove ${nameObj.name} from shortlist` : `Save ${nameObj.name} to shortlist`}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-xs sm:text-sm transition-all ${
        isSaved
          ? "bg-saffron text-white border-saffron shadow-sm"
          : "bg-white border-saffron/30 text-saffron-deep hover:bg-saffron-light"
      }`}
    >
      <span className="text-base">{isSaved ? "♥" : "♡"}</span>
      <span>{isSaved ? "Saved to Shortlist" : "Save to Shortlist"}</span>
    </button>
  );
}
