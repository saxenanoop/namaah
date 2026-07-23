"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface SuggestNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestNameModal({ isOpen, onClose }: SuggestNameModalProps) {
  const [name, setName] = useState("");
  const [nameHindi, setNameHindi] = useState("");
  const [meaning, setMeaning] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | "unisex">("boy");
  const [userEmail, setUserEmail] = useState("");
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !meaning.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("namaah-suggestions") || "[]");
      existing.push({
        name,
        nameHindi,
        meaning,
        gender,
        userEmail,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("namaah-suggestions", JSON.stringify(existing));
    } catch {
      // Storage unavailable
    }

    showToast(`Thank you! "${name}" has been submitted for review. 🙏`, "success");
    setName("");
    setNameHindi("");
    setMeaning("");
    setUserEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-saffron/20 relative animate-modal-in text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close suggestion modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-charcoal/5 dark:bg-slate-700 hover:bg-saffron-light text-charcoal-muted dark:text-slate-300 flex items-center justify-center"
        >
          ✕
        </button>

        <h3 className="font-heading text-xl font-bold text-charcoal dark:text-white mb-1">
          Suggest a Baby Name 💡
        </h3>
        <p className="text-xs text-charcoal-muted dark:text-slate-300 mb-4">
          Know a beautiful Hindu baby name that is missing from Namaah? Share it with our community!
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-slate-200 mb-1">
                Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full text-xs sm:text-sm p-2.5 bg-cream/60 dark:bg-slate-700 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron text-charcoal dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-slate-200 mb-1">
                Name (Devanagari)
              </label>
              <input
                type="text"
                value={nameHindi}
                onChange={(e) => setNameHindi(e.target.value)}
                placeholder="e.g. आरव"
                className="w-full text-xs sm:text-sm p-2.5 bg-cream/60 dark:bg-slate-700 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron text-charcoal dark:text-white font-devanagari"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal dark:text-slate-200 mb-1">
              Gender *
            </label>
            <div className="flex gap-2">
              {(["boy", "girl", "unisex"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    gender === g
                      ? "bg-saffron text-white border-saffron"
                      : "bg-cream/40 dark:bg-slate-700 text-charcoal-muted dark:text-slate-300 border-saffron/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal dark:text-slate-200 mb-1">
              Meaning & Significance *
            </label>
            <textarea
              required
              rows={3}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Explain the meaning and Sanskrit root..."
              className="w-full text-xs sm:text-sm p-2.5 bg-cream/60 dark:bg-slate-700 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron text-charcoal dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal dark:text-slate-200 mb-1">
              Your Email (Optional)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs sm:text-sm p-2.5 bg-cream/60 dark:bg-slate-700 border border-saffron/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron text-charcoal dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal-muted hover:bg-charcoal/5 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-saffron text-white hover:bg-saffron-dark shadow-sm transition-all"
            >
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
