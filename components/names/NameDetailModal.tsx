"use client";

import React from "react";
import { BabyName, names } from "@/data/names";
import { useToast } from "@/components/ui/Toast";

interface NameDetailModalProps {
  name: BabyName | null;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (name: BabyName) => void;
  onSelectSimilarName: (name: BabyName) => void;
  onOpenCorrection: (name: BabyName) => void;
}

// Numerology interpretation helper
const NUMEROLOGY_MAP: Record<number, { trait: string; desc: string }> = {
  1: { trait: "Leader & Visionary", desc: "Independent, pioneering, driven, and courageous." },
  2: { trait: "Peacemaker & Harmonizer", desc: "Gentle, intuitive, diplomatic, and deeply empathetic." },
  3: { trait: "Creative Expresser", desc: "Artistic, optimistic, charismatic, and communicative." },
  4: { trait: "Builder & Mastermind", desc: "Disciplined, practical, loyal, and methodical." },
  5: { trait: "Free Spirit & Adventurer", desc: "Versatile, curious, energetic, and adaptable." },
  6: { trait: "Nurturer & Caregiver", desc: "Loving, responsible, protective, and family-focused." },
  7: { trait: "Seeker & Spiritual Scholar", desc: "Analytical, profound, contemplative, and wise." },
  8: { trait: "Powerhouse & Achiever", desc: "Ambitious, resilient, authoritative, and successful." },
  9: { trait: "Humanitarian & Universalist", desc: "Compassionate, idealist, selfless, and inspiring." },
};

export default function NameDetailModal({
  name,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onSelectSimilarName,
  onOpenCorrection,
}: NameDetailModalProps) {
  const { showToast } = useToast();

  if (!name) return null;

  // Find 3-4 similar names based on category, gender, or rashi
  const similarNames = names
    .filter(
      (n) =>
        n.id !== name.id &&
        (n.gender === name.gender || n.rashi === name.rashi || Boolean(n.categories?.some((c) => name.categories?.includes(c))))
    )
    .slice(0, 4);

  // Share handlers
  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/?name=${name.slug}` : "";
    navigator.clipboard.writeText(url);
    showToast(`Copied link for ${name.name} to clipboard! 📋`, "success");
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this beautiful Hindu name "${name.name}" (${name.nameHindi}) - Meaning: ${name.meaning} on Namaah!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(
      `Discovering sacred Hindu baby names on Namaah: "${name.name}" (${name.nameHindi}) — ${name.meaning}.`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const numInfo = NUMEROLOGY_MAP[name.numerologyNumber] || NUMEROLOGY_MAP[7];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-saffron/20 relative animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close detail modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-charcoal/5 hover:bg-saffron-light text-charcoal-muted hover:text-saffron-deep flex items-center justify-center transition-colors z-10"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-saffron-light via-cream to-white p-6 sm:p-8 border-b border-saffron/15 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-12 w-48 h-48 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                name.gender === "boy"
                  ? "bg-blue-100 text-blue-800"
                  : name.gender === "girl"
                  ? "bg-pink-100 text-pink-800"
                  : "bg-teal-light text-teal-dark"
              }`}
            >
              {name.gender} Name
            </span>
            <span className="text-xs text-charcoal-muted font-medium bg-white/80 px-2.5 py-0.5 rounded-full border border-charcoal/10">
              {name.origin}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
                {name.name}
              </h2>
              <p className="font-devanagari text-2xl font-bold text-saffron-deep mt-1">
                {name.nameHindi}
              </p>
            </div>

            {/* Shortlist Action */}
            <button
              onClick={() => onToggleShortlist(name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all ${
                isShortlisted
                  ? "bg-saffron text-white shadow-md"
                  : "bg-white border border-saffron/30 text-saffron-deep hover:bg-saffron-light"
              }`}
            >
              <svg
                className={`w-4 h-4 ${isShortlisted ? "fill-current" : "fill-none stroke-current stroke-2"}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{isShortlisted ? "Shortlisted" : "Add to Shortlist"}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Meaning & Extended Story */}
          <div>
            <h3 className="text-xs font-bold text-saffron-deep uppercase tracking-wider mb-1">
              Meaning & Spiritual Significance
            </h3>
            <p className="text-base font-medium text-charcoal leading-snug mb-2">
              &quot;{name.meaning}&quot;
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed bg-cream p-4 rounded-2xl border border-saffron/10">
              {name.meaningFull}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-cream/60 p-3 rounded-xl border border-saffron/10 text-center">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Rashi (Zodiac)</span>
              <span className="font-heading font-bold text-charcoal text-sm">{name.rashi}</span>
              <span className="font-devanagari text-xs text-saffron-deep block">{name.rashiHindi}</span>
            </div>
            <div className="bg-cream/60 p-3 rounded-xl border border-saffron/10 text-center">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Nakshatra</span>
              <span className="font-heading font-bold text-charcoal text-sm">{name.nakshatra}</span>
            </div>
            <div className="bg-cream/60 p-3 rounded-xl border border-saffron/10 text-center">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Numerology</span>
              <span className="font-heading font-extrabold text-saffron-deep text-lg">#{name.numerologyNumber}</span>
            </div>
            <div className="bg-cream/60 p-3 rounded-xl border border-saffron/10 text-center">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Syllables</span>
              <span className="font-heading font-bold text-charcoal text-sm">{name.syllables} Syllables</span>
            </div>
          </div>

          {/* Numerology Interpretation */}
          <div className="p-4 rounded-2xl bg-teal-light/40 border border-teal/20">
            <div className="flex items-center gap-2 mb-1 text-teal-dark">
              <span className="text-base">🔮</span>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Numerology #{name.numerologyNumber} — {numInfo.trait}
              </h4>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {numInfo.desc} In Vedic numerology, number {name.numerologyNumber} brings distinct cosmic vibrations shaping character and life path.
            </p>
          </div>

          {/* Categories */}
          <div>
            <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-2">
              Associated Themes & Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {name.categories?.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-saffron-light text-saffron-deep font-semibold px-3 py-1 rounded-full border border-saffron/20"
                >
                  ✦ {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Celebrity Connection if any */}
          {name.celebrityConnection && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base">⭐</span>
              <div>
                <span className="font-bold block">Celebrity Choice</span>
                <span>{name.celebrityConnection}</span>
              </div>
            </div>
          )}

          {/* Similar Names */}
          {similarNames.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                Similar Names You Might Love
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {similarNames.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onSelectSimilarName(sim)}
                    className="p-2.5 rounded-xl bg-cream hover:bg-saffron-light text-left border border-saffron/15 hover:border-saffron/40 transition-all group"
                  >
                    <span className="font-heading font-bold text-sm text-charcoal group-hover:text-saffron-deep block">
                      {sim.name}
                    </span>
                    <span className="font-devanagari text-xs text-saffron-deep block">
                      {sim.nameHindi}
                    </span>
                    <span className="text-[10px] text-charcoal-muted line-clamp-1">
                      {sim.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions: Share & Correction */}
          <div className="pt-4 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-charcoal-muted">Share:</span>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-charcoal/5 hover:bg-saffron-light text-charcoal hover:text-saffron-deep text-xs font-medium transition-colors"
                title="Copy Link"
              >
                📋 Copy
              </button>
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition-colors"
                title="Share on WhatsApp"
              >
                💬 WhatsApp
              </button>
              <button
                onClick={handleTwitter}
                className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-medium transition-colors"
                title="Share on X / Twitter"
              >
                🐦 Twitter
              </button>
            </div>

            {/* Correction Link */}
            <button
              onClick={() => onOpenCorrection(name)}
              className="text-xs text-charcoal-muted hover:text-saffron-deep underline font-medium"
            >
              Suggest a Correction ✍️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
