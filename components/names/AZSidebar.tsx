"use client";

import React from "react";

interface AZSidebarProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  availableLetters: string[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AZSidebar({
  selectedLetter,
  onSelectLetter,
  availableLetters,
}: AZSidebarProps) {
  return (
    <div>
      {/* Mobile Horizontal Scrollable Pills */}
      <div className="lg:hidden w-full overflow-x-auto pb-2 flex items-center gap-1.5 no-scrollbar scroll-smooth">
        <button
          onClick={() => onSelectLetter("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedLetter === "all"
              ? "bg-saffron text-white shadow-sm"
              : "bg-white border border-saffron/20 text-charcoal-muted hover:border-saffron"
          }`}
        >
          ALL
        </button>
        {ALPHABET.map((letter) => {
          const hasNames = availableLetters.includes(letter);
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              disabled={!hasNames}
              onClick={() => onSelectLetter(letter)}
              className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? "bg-saffron text-white shadow-sm"
                  : hasNames
                  ? "bg-white border border-saffron/20 text-charcoal hover:bg-saffron-light"
                  : "bg-charcoal/5 text-charcoal/30 cursor-not-allowed"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Desktop Sticky Vertical Alphabet Sidebar */}
      <div className="hidden lg:flex flex-col bg-white p-3 rounded-card border border-saffron/20 shadow-soft sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        <span className="text-[11px] font-bold text-saffron-deep uppercase tracking-wider text-center mb-2 pb-2 border-b border-saffron/10">
          A-Z Index
        </span>
        <button
          onClick={() => onSelectLetter("all")}
          className={`w-full py-1 rounded-lg text-xs font-bold text-center transition-all mb-1 ${
            selectedLetter === "all"
              ? "bg-saffron text-white shadow-sm"
              : "text-charcoal-muted hover:bg-saffron-light hover:text-saffron-deep"
          }`}
        >
          ALL
        </button>
        <div className="grid grid-cols-2 gap-1 text-center">
          {ALPHABET.map((letter) => {
            const hasNames = availableLetters.includes(letter);
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                disabled={!hasNames}
                onClick={() => onSelectLetter(letter)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all mx-auto ${
                  isSelected
                    ? "bg-saffron text-white shadow-sm"
                    : hasNames
                    ? "text-charcoal hover:bg-saffron-light hover:text-saffron-deep"
                    : "text-charcoal/25 cursor-not-allowed"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
