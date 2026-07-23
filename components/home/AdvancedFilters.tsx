"use client";

import React from "react";

export interface AdvancedFilterState {
  rashi: string;
  nakshatra: string;
  syllables: string; // "all" | "1" | "2" | "3+"
  origin: string;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterState;
  onChange: (filters: AdvancedFilterState) => void;
  onReset: () => void;
  allRashis: string[];
  allNakshatras: string[];
  allOrigins: string[];
}

export default function AdvancedFilters({
  filters,
  onChange,
  onReset,
  allRashis,
  allNakshatras,
  allOrigins,
}: AdvancedFiltersProps) {
  const hasActiveFilters =
    filters.rashi !== "all" ||
    filters.nakshatra !== "all" ||
    filters.syllables !== "all" ||
    filters.origin !== "all";

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-saffron/20 shadow-soft space-y-4 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-saffron/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚙️</span>
          <h3 className="font-heading text-base font-bold text-charcoal dark:text-white">
            Advanced Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-saffron-deep hover:text-saffron underline"
          >
            Reset Advanced Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rashi Filter */}
        <div>
          <label htmlFor="rashi-filter" className="block text-xs font-bold text-charcoal-muted dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Rashi (Zodiac)
          </label>
          <select
            id="rashi-filter"
            value={filters.rashi}
            onChange={(e) => onChange({ ...filters, rashi: e.target.value })}
            className="w-full text-xs font-medium bg-cream/70 dark:bg-slate-700 text-charcoal dark:text-white border border-saffron/20 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option value="all">All Rashis (zodiac signs)</option>
            {allRashis.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Nakshatra Filter */}
        <div>
          <label htmlFor="nakshatra-filter" className="block text-xs font-bold text-charcoal-muted dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Nakshatra (Birth Star)
          </label>
          <select
            id="nakshatra-filter"
            value={filters.nakshatra}
            onChange={(e) => onChange({ ...filters, nakshatra: e.target.value })}
            className="w-full text-xs font-medium bg-cream/70 dark:bg-slate-700 text-charcoal dark:text-white border border-saffron/20 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option value="all">All 27 Nakshatras</option>
            {allNakshatras.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Syllables Filter */}
        <div>
          <label htmlFor="syllables-filter" className="block text-xs font-bold text-charcoal-muted dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Syllable Count
          </label>
          <select
            id="syllables-filter"
            value={filters.syllables}
            onChange={(e) => onChange({ ...filters, syllables: e.target.value })}
            className="w-full text-xs font-medium bg-cream/70 dark:bg-slate-700 text-charcoal dark:text-white border border-saffron/20 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option value="all">Any Syllable Length</option>
            <option value="1">1 Syllable (Crisp & Short)</option>
            <option value="2">2 Syllables (Classic & Balanced)</option>
            <option value="3+">3+ Syllables (Melodic & Royal)</option>
          </select>
        </div>

        {/* Origin Filter */}
        <div>
          <label htmlFor="origin-filter" className="block text-xs font-bold text-charcoal-muted dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Origin Language
          </label>
          <select
            id="origin-filter"
            value={filters.origin}
            onChange={(e) => onChange({ ...filters, origin: e.target.value })}
            className="w-full text-xs font-medium bg-cream/70 dark:bg-slate-700 text-charcoal dark:text-white border border-saffron/20 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            <option value="all">All Origins</option>
            {allOrigins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
