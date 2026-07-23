"use client";

import React, { useState } from "react";
import { BabyName } from "@/data/names";
import { useToast } from "@/components/ui/Toast";

interface CorrectionModalProps {
  name: BabyName | null;
  onClose: () => void;
}

export default function CorrectionModal({ name, onClose }: CorrectionModalProps) {
  const [suggestion, setSuggestion] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { showToast } = useToast();

  if (!name) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    showToast(`Thank you! Your correction for "${name.name}" has been submitted for review. 🙏`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-saffron/20 relative animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-charcoal/5 hover:bg-saffron-light text-charcoal-muted flex items-center justify-center"
        >
          ✕
        </button>

        <h3 className="font-heading text-xl font-bold text-charcoal mb-1">
          Suggest a Correction
        </h3>
        <p className="text-xs text-charcoal-muted mb-4">
          Helping us keep <span className="font-semibold text-saffron-deep">{name.name} ({name.nameHindi})</span> accurate for all parents.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Your Correction / Suggested Edit *
            </label>
            <textarea
              required
              rows={4}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Tell us what needs updating (e.g. Devanagari spelling, meaning nuance, origin)..."
              className="w-full text-xs sm:text-sm p-3 bg-cream/60 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron/40 text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Your Email (Optional for updates)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs sm:text-sm p-2.5 bg-cream/60 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron/40 text-charcoal"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal-muted hover:bg-charcoal/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-saffron text-white hover:bg-saffron-dark shadow-sm transition-all"
            >
              Submit Correction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
