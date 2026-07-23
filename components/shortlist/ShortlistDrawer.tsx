"use client";

import React, { useState } from "react";
import { BabyName } from "@/data/names";
import { useToast } from "@/components/ui/Toast";
import CompareModal from "./CompareModal";

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: BabyName[];
  onRemove: (name: BabyName) => void;
  onClearAll: () => void;
  onViewDetails: (name: BabyName) => void;
}

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlist,
  onRemove,
  onClearAll,
  onViewDetails,
}: ShortlistDrawerProps) {
  const [showCompare, setShowCompare] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleShareShortlist = () => {
    if (shortlist.length === 0) return;
    const text = `My Favorite Hindu Baby Names from Namaah:\n` +
      shortlist.map((n, i) => `${i + 1}. ${n.name} (${n.nameHindi}) - ${n.meaning}`).join("\n") +
      `\n\nDiscover more at https://www.namaah.in`;

    navigator.clipboard.writeText(text);
    showToast(`Shortlist copied to clipboard (${shortlist.length} names)! 📋`, "success");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer from Right */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-right border-l border-saffron/20">
        {/* Drawer Header */}
        <div className="p-5 border-b border-saffron/15 bg-gradient-to-r from-saffron-light to-cream flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-charcoal">My Shortlist</h2>
              <p className="text-xs text-charcoal-muted font-medium">
                {shortlist.length} saved {shortlist.length === 1 ? "name" : "names"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-saffron/20 text-charcoal-muted hover:text-charcoal flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body: Saved Names List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {shortlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-charcoal-muted">
              <div className="w-16 h-16 rounded-full bg-saffron-light flex items-center justify-center text-3xl">
                🤍
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-charcoal mb-1">
                  Your shortlist is empty
                </h3>
                <p className="text-xs leading-relaxed max-w-xs">
                  Click the heart icon on any name card while browsing to save it to your personal shortlist.
                </p>
              </div>
            </div>
          ) : (
            shortlist.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-cream/70 border border-saffron/15 flex items-center justify-between gap-3 hover:border-saffron/30 transition-all group"
              >
                <div
                  onClick={() => {
                    onViewDetails(item);
                    onClose();
                  }}
                  className="cursor-pointer flex-1"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-base font-bold text-charcoal group-hover:text-saffron-deep transition-colors">
                      {item.name}
                    </span>
                    <span className="font-devanagari text-xs text-saffron-deep font-semibold">
                      {item.nameHindi}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted line-clamp-1">{item.meaning}</p>
                </div>

                <button
                  onClick={() => onRemove(item)}
                  className="p-2 rounded-xl text-charcoal/30 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Actions */}
        {shortlist.length > 0 && (
          <div className="p-5 border-t border-saffron/15 bg-white space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Compare Names Button */}
              <button
                onClick={() => setShowCompare(true)}
                className="py-2.5 px-3 rounded-xl bg-teal-light text-teal-dark font-semibold text-xs border border-teal/20 hover:bg-teal/15 transition-all flex items-center justify-center gap-1.5"
              >
                <span>📊</span>
                <span>Compare Names</span>
              </button>

              {/* Share Shortlist Button */}
              <button
                onClick={handleShareShortlist}
                className="py-2.5 px-3 rounded-xl bg-saffron text-white font-semibold text-xs hover:bg-saffron-dark transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>🔗</span>
                <span>Share Shortlist</span>
              </button>
            </div>

            <button
              onClick={onClearAll}
              className="w-full text-center text-xs text-charcoal-muted hover:text-rose-600 font-medium transition-colors pt-1"
            >
              Clear All Saved Names
            </button>
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompare && (
        <CompareModal
          shortlist={shortlist}
          onClose={() => setShowCompare(false)}
          onRemove={(item) => onRemove(item)}
        />
      )}
    </>
  );
}
