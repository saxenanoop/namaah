"use client";

import React, { useMemo } from "react";
import { BabyName, names } from "@/data/names";

interface NameOfTheDayProps {
  onViewDetails: (name: BabyName) => void;
  isShortlisted: boolean;
  onToggleShortlist: (name: BabyName) => void;
}

export default function NameOfTheDay({
  onViewDetails,
  isShortlisted,
  onToggleShortlist,
}: NameOfTheDayProps) {
  // Select a name deterministically based on current day of year
  const featuredName = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % names.length;
    return names[index] || names[0];
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-saffron-light/90 via-cream to-white border border-saffron/30 shadow-card relative overflow-hidden dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800 dark:border-saffron/30 text-left">
      {/* Decorative Glow & Badge */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-saffron/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron text-white text-xs font-bold shadow-sm uppercase tracking-wider">
          <span>🌟</span>
          <span>Name of the Day</span>
        </div>
        <span className="text-[11px] font-semibold text-charcoal-muted dark:text-slate-400">
          {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
              {featuredName.name}
            </h3>
            <span className="font-devanagari text-xl font-bold text-saffron-deep dark:text-saffron">
              {featuredName.nameHindi}
            </span>
          </div>

          {featuredName.phonetic && (
            <p className="text-xs font-semibold text-teal dark:text-teal-light mt-0.5">
              🗣️ {featuredName.phonetic}
            </p>
          )}

          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            &quot;{featuredName.meaning}&quot;
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-semibold">
            <span className="bg-white/80 dark:bg-slate-700 text-charcoal dark:text-slate-200 px-2.5 py-0.5 rounded-full border border-saffron/10">
              {featuredName.rashi} ({featuredName.rashiHindi})
            </span>
            <span className="bg-white/80 dark:bg-slate-700 text-charcoal dark:text-slate-200 px-2.5 py-0.5 rounded-full border border-saffron/10">
              {featuredName.nakshatra}
            </span>
            <span className="bg-saffron-light text-saffron-deep dark:bg-saffron/20 dark:text-saffron px-2.5 py-0.5 rounded-full">
              #{featuredName.numerologyNumber} Numerology
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-saffron/10">
          <button
            onClick={() => onViewDetails(featuredName)}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-saffron text-white hover:bg-saffron-dark text-xs font-bold shadow-sm transition-all text-center"
          >
            Explore Name ✨
          </button>

          <button
            onClick={() => onToggleShortlist(featuredName)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
              isShortlisted
                ? "bg-saffron-light text-saffron-deep border-saffron/30 dark:bg-saffron/20 dark:text-saffron"
                : "bg-white dark:bg-slate-800 text-charcoal-muted dark:text-slate-300 border-charcoal/15 hover:border-saffron"
            }`}
            title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
          >
            <span>{isShortlisted ? "❤️" : "🤍"}</span>
            <span className="sm:hidden">{isShortlisted ? "Shortlisted" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
