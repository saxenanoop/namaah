"use client";

import React from "react";
import { BabyName } from "@/data/names";

interface CompareModalProps {
  shortlist: BabyName[];
  onClose: () => void;
  onRemove: (name: BabyName) => void;
}

export default function CompareModal({
  shortlist,
  onClose,
  onRemove,
}: CompareModalProps) {
  if (shortlist.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-saffron/20 relative animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/5 hover:bg-saffron-light text-charcoal-muted hover:text-saffron-deep flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-saffron-deep uppercase tracking-wider block mb-1">
            Side-by-Side Matrix
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal">
            Compare Shortlisted Names ({shortlist.length})
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-saffron/20 rounded-2xl shadow-soft bg-cream/30">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-saffron-light/80 text-saffron-deep border-b border-saffron/20">
                <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] w-32">Attribute</th>
                {shortlist.map((item) => (
                  <th key={item.id} className="p-3.5 font-bold min-w-[140px] text-charcoal border-l border-saffron/15">
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <span className="font-heading text-base font-bold text-charcoal block">{item.name}</span>
                        <span className="font-devanagari text-xs text-saffron-deep">{item.nameHindi}</span>
                      </div>
                      <button
                        onClick={() => onRemove(item)}
                        className="text-xs text-charcoal/40 hover:text-rose-500 p-1"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-saffron/10 text-charcoal">
              {/* Meaning */}
              <tr className="bg-white">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Meaning</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 font-medium">
                    {item.meaning}
                  </td>
                ))}
              </tr>

              {/* Gender */}
              <tr className="bg-cream/20">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Gender</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 capitalize font-medium">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.gender === "boy" ? "bg-blue-100 text-blue-800" : item.gender === "girl" ? "bg-pink-100 text-pink-800" : "bg-teal-light text-teal-dark"
                    }`}>
                      {item.gender}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Rashi */}
              <tr className="bg-white">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Rashi (Zodiac)</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10">
                    <span className="font-semibold">{item.rashi}</span>{" "}
                    <span className="font-devanagari text-saffron-deep">({item.rashiHindi})</span>
                  </td>
                ))}
              </tr>

              {/* Nakshatra */}
              <tr className="bg-cream/20">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Nakshatra</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 font-medium">
                    {item.nakshatra}
                  </td>
                ))}
              </tr>

              {/* Origin */}
              <tr className="bg-white">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Origin</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 font-medium">
                    {item.origin}
                  </td>
                ))}
              </tr>

              {/* Numerology */}
              <tr className="bg-cream/20">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Numerology</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 font-bold text-saffron-deep">
                    #{item.numerologyNumber}
                  </td>
                ))}
              </tr>

              {/* Syllables */}
              <tr className="bg-white">
                <td className="p-3.5 font-bold text-charcoal-muted bg-cream/50 text-xs uppercase">Syllables</td>
                {shortlist.map((item) => (
                  <td key={item.id} className="p-3.5 border-l border-saffron/10 font-medium">
                    {item.syllables}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
