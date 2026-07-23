"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShortlistDrawer from "@/components/shortlist/ShortlistDrawer";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { names } from "@/data/names";
import { useState, useEffect, useMemo } from "react";

const SHORTLIST_KEY = "namaah-shortlist-ids";

function OriginsContent() {
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHORTLIST_KEY);
      if (stored) setShortlistIds(JSON.parse(stored));
    } catch {}
  }, []);

  const shortlistedNames = useMemo(
    () => names.filter((n) => shortlistIds.includes(n.id)),
    [shortlistIds]
  );

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-slate-900 text-charcoal dark:text-slate-100">
      <Navbar
        shortlistCount={shortlistIds.length}
        onOpenShortlist={() => setIsDrawerOpen(true)}
      />

      <main className="flex-1 max-w-[1000px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-light dark:bg-saffron/20 border border-saffron/30 text-saffron-deep dark:text-saffron text-xs font-semibold">
            <span>📜</span>
            <span>Vedic Naming Heritage & Traditions</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-charcoal dark:text-white tracking-tight">
            Understanding Hindu Baby Name Origins
          </h1>
          <p className="text-base sm:text-lg text-charcoal-muted dark:text-slate-300 leading-relaxed">
            In Vedic culture, a name is not merely an identifier — it is a sacred sound vibration (Mantric Shabda) that shapes personality, destiny, and cosmic alignment.
          </p>
        </div>

        {/* Section 1: The Namakarana Ceremony */}
        <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-saffron/20 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h2 className="font-heading text-2xl font-bold text-charcoal dark:text-white">
              The Namakarana Samskara (Vedic Naming Ritual)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-charcoal-muted dark:text-slate-300 leading-relaxed">
            The <strong>Namakarana</strong> is the 11th or 12th day Vedic ritual after birth where the newborn receives their official name. According to the <em>Gryhya Sutras</em>, the father or priest whispers the child’s secret astronomical name (Nakshatra Nama) into the baby’s right ear, followed by their public name.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cream/70 dark:bg-slate-700/60 border border-saffron/15">
              <h3 className="font-bold text-sm text-saffron-deep dark:text-saffron mb-1">
                ✦ Nakshatra Nama
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-slate-300">
                Determined by the lunar birth star. Aligns the child with cosmic planetary energies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-cream/70 dark:bg-slate-700/60 border border-saffron/15">
              <h3 className="font-bold text-sm text-saffron-deep dark:text-saffron mb-1">
                ✦ Masa Nama
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-slate-300">
                Based on the Hindu month of birth, linking the child to Vishnu&apos;s 12 sacred epithets.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-cream/70 dark:bg-slate-700/60 border border-saffron/15">
              <h3 className="font-bold text-sm text-saffron-deep dark:text-saffron mb-1">
                ✦ Vyavaharika Nama
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-slate-300">
                The popular public name used in daily life, education, and society.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Rashi & Nakshatra Syllable Matrix */}
        <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-saffron/20 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-light dark:bg-teal/20 text-teal-dark dark:text-teal-light flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h2 className="font-heading text-2xl font-bold text-charcoal dark:text-white">
              Rashi & Nakshatra Starting Syllable Matrix
            </h2>
          </div>
          <p className="text-sm text-charcoal-muted dark:text-slate-300 leading-relaxed">
            In Vedic astrology (Jyotish), each of the 27 Nakshatras is divided into 4 quarters (Padas). Each quarter corresponds to a specific starting sound syllable. Choosing a name starting with this sound harmonizes the child&apos;s aura.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-saffron-light dark:bg-slate-700 text-saffron-deep dark:text-saffron border-b border-saffron/20">
                  <th className="p-3 font-bold">Rashi (Zodiac)</th>
                  <th className="p-3 font-bold">English Sign</th>
                  <th className="p-3 font-bold">Auspicious Starting Syllables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saffron/10 dark:divide-slate-700">
                <tr>
                  <td className="p-3 font-bold">Mesha (मेष)</td>
                  <td className="p-3">Aries</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">A, L, E, I, O</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Vrishabha (वृषभ)</td>
                  <td className="p-3">Taurus</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">B, V, U, W</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Mithuna (मिथुन)</td>
                  <td className="p-3">Gemini</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">K, CHH, GH, Q</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Karka (कर्क)</td>
                  <td className="p-3">Cancer</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">DD, H</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Simha (सिंह)</td>
                  <td className="p-3">Leo</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">M, TT</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Kanya (कन्या)</td>
                  <td className="p-3">Virgo</td>
                  <td className="p-3 font-semibold text-saffron-deep dark:text-saffron">P, T, N</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: 5 Golden Rules for Choosing a Name */}
        <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-saffron/20 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h2 className="font-heading text-2xl font-bold text-charcoal dark:text-white">
              5 Golden Rules for Choosing a Hindu Baby Name
            </h2>
          </div>

          <div className="space-y-3 text-sm text-charcoal-muted dark:text-slate-300">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50 dark:bg-slate-700/50">
              <span className="text-base font-bold text-saffron-deep dark:text-saffron">1.</span>
              <p>
                <strong>Check Syllable Rhythm:</strong> Choose 2-syllable names for boys and 3-syllable names for girls to align with classical phonetics.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50 dark:bg-slate-700/50">
              <span className="text-base font-bold text-saffron-deep dark:text-saffron">2.</span>
              <p>
                <strong>Verify Meaning Purity:</strong> Ensure the name has an uplifting, positive Sanskrit definition rooted in wisdom, nature, or virtue.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50 dark:bg-slate-700/50">
              <span className="text-base font-bold text-saffron-deep dark:text-saffron">3.</span>
              <p>
                <strong>Test Surname Harmony:</strong> Speak the full name aloud 5 times to ensure smooth phonetic transitions.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50 dark:bg-slate-700/50">
              <span className="text-base font-bold text-saffron-deep dark:text-saffron">4.</span>
              <p>
                <strong>Global Ease of Pronunciation:</strong> Choose names with simple phonetic spellings if living abroad.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/50 dark:bg-slate-700/50">
              <span className="text-base font-bold text-saffron-deep dark:text-saffron">5.</span>
              <p>
                <strong>Check Numerology & Vastu:</strong> Ensure the name&apos;s numerology number complements the birth date.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-saffron to-saffron-dark text-white space-y-4 shadow-lg">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">
            Ready to Find Your Child&apos;s Sacred Name?
          </h2>
          <p className="text-sm opacity-90 max-w-lg mx-auto">
            Browse our curated 500+ Hindu baby names with meanings, Devanagari script, Rashi, Nakshatra, and phonetic guides.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-saffron-deep font-bold px-8 py-3 rounded-full hover:bg-cream transition-all shadow-md"
          >
            Start Browsing Names →
          </Link>
        </div>
      </main>

      <ShortlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        shortlist={shortlistedNames}
        onRemove={(item) => {
          const next = shortlistIds.filter((id) => id !== item.id);
          setShortlistIds(next);
          localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
          showToast(`Removed "${item.name}" from shortlist`, "info");
        }}
        onClearAll={() => {
          setShortlistIds([]);
          localStorage.setItem(SHORTLIST_KEY, JSON.stringify([]));
          showToast("Cleared shortlist", "info");
        }}
        onViewDetails={() => {}}
      />

      <Footer />
    </div>
  );
}

export default function OriginsPage() {
  return (
    <ToastProvider>
      <OriginsContent />
    </ToastProvider>
  );
}
