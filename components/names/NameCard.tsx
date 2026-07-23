"use client";

import React, { useState } from "react";
import { BabyName } from "@/data/names";

export interface NameCardProps {
  name: BabyName;
  isShortlisted?: boolean;
  onToggleShortlist?: (name: BabyName) => void;
  onViewDetails?: (name: BabyName) => void;
  onDismiss?: (slug: string) => void;
  compact?: boolean;
}

export default function NameCard({
  name,
  isShortlisted = false,
  onToggleShortlist,
  onViewDetails,
}: NameCardProps) {
  const [bouncing, setBouncing] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBouncing(true);
    if (onToggleShortlist) {
      onToggleShortlist(name);
    }
    setTimeout(() => setBouncing(false), 450);
  };

  // Gender colors
  const genderBadgeClass =
    name.gender === "boy"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : name.gender === "girl"
      ? "bg-pink-50 text-pink-700 border-pink-200"
      : "bg-teal-light text-teal-dark border-teal/30";

  const genderDotClass =
    name.gender === "boy"
      ? "bg-blue-500"
      : name.gender === "girl"
      ? "bg-pink-500"
      : "bg-teal";

  return (
    <div
      onClick={() => onViewDetails?.(name)}
      className="card-hover-effect group bg-white dark:bg-slate-800 rounded-card p-5 border border-saffron/15 dark:border-saffron/20 shadow-soft hover:border-saffron/40 flex flex-col justify-between cursor-pointer relative text-left"
    >
      {/* Card Header: Name + Devanagari & Heart Button */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            {/* English Name (Large, bold) */}
            <h3 className="font-heading text-xl font-bold text-charcoal dark:text-white group-hover:text-saffron-deep dark:group-hover:text-saffron transition-colors tracking-tight">
              {name.name}
            </h3>
            {/* Devanagari Script & Phonetic */}
            <div className="flex items-center gap-2 mt-0.5">
              <p className="font-devanagari text-sm font-semibold text-saffron-deep dark:text-saffron">
                {name.nameHindi}
              </p>
              {name.phonetic && (
                <span className="text-[10px] font-semibold text-teal dark:text-teal-light bg-teal-light/60 dark:bg-teal/20 px-2 py-0.5 rounded-md">
                  🗣️ {name.phonetic}
                </span>
              )}
            </div>
          </div>

          {/* Heart Icon Button with animation */}
          <button
            onClick={handleHeartClick}
            aria-label={isShortlisted ? `Remove ${name.name} from shortlist` : `Add ${name.name} to shortlist`}
            className={`p-2.5 rounded-full transition-all ${
              bouncing ? "animate-heart-bounce" : ""
            } ${
              isShortlisted
                ? "bg-saffron-light text-saffron-deep"
                : "bg-charcoal/5 text-charcoal/40 hover:bg-saffron-light hover:text-saffron"
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isShortlisted ? "fill-saffron text-saffron scale-110" : "fill-none stroke-current stroke-2"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Gender Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium my-2.5 capitalize ${genderBadgeClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${genderDotClass}`}></span>
          <span>{name.gender}</span>
          <span className="text-charcoal/30">•</span>
          <span className="text-charcoal/70">{name.origin}</span>
        </div>

        {/* Concise Meaning */}
        <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-4">
          {name.meaning}
        </p>
      </div>

      {/* Card Footer: Category Pills & View Details Link */}
      <div className="pt-3 border-t border-charcoal/5 flex items-center justify-between gap-2">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1 max-w-[65%]">
          {name.categories?.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-[10px] bg-saffron-light/80 text-saffron-deep font-medium px-2 py-0.5 rounded-md"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* View Details Link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(name);
          }}
          className="text-xs font-semibold text-saffron-deep hover:text-saffron flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Details</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
