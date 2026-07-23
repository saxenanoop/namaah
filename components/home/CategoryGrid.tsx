"use client";

import React from "react";

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  sub: string;
  count: number;
  bgGradient: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "Deity Names",
    title: "Deity Names",
    icon: "✦",
    sub: "Krishna, Shiva, Durga, Vishnu",
    count: 24,
    bgGradient: "from-amber-500/10 to-saffron/20 border-saffron/30",
  },
  {
    id: "Nature & Earth",
    title: "Nature & Earth",
    icon: "◈",
    sub: "Mountains, rivers, dawn, sky",
    count: 18,
    bgGradient: "from-emerald-500/10 to-teal/20 border-teal/30",
  },
  {
    id: "Vedic Virtues",
    title: "Vedic Virtues",
    icon: "◉",
    sub: "Wisdom, peace, courage, truth",
    count: 22,
    bgGradient: "from-blue-500/10 to-indigo-500/20 border-blue-300/40",
  },
  {
    id: "Mythological Heroes",
    title: "Mythological Heroes",
    icon: "◇",
    sub: "Ramayana, Mahabharata, Puranas",
    count: 15,
    bgGradient: "from-purple-500/10 to-pink-500/20 border-purple-300/40",
  },
  {
    id: "South Indian",
    title: "South Indian",
    icon: "◆",
    sub: "Tamil, Telugu, Kannada traditions",
    count: 16,
    bgGradient: "from-orange-500/10 to-amber-500/20 border-orange-300/40",
  },
  {
    id: "Short & Sweet",
    title: "Short & Sweet",
    icon: "○",
    sub: "1-2 syllable global-friendly",
    count: 28,
    bgGradient: "from-rose-500/10 to-pink-500/20 border-rose-300/40",
  },
  {
    id: "Celebrity Picks",
    title: "Celebrity Picks",
    icon: "★",
    sub: "Bollywood & cricket star choices",
    count: 19,
    bgGradient: "from-yellow-500/10 to-amber-500/20 border-yellow-400/40",
  },
  {
    id: "Royal & Rare",
    title: "Royal & Rare",
    icon: "◍",
    sub: "Uncommon heritage names",
    count: 14,
    bgGradient: "from-teal-500/10 to-cyan-500/20 border-cyan-300/40",
  },
];

export default function CategoryGrid({
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <section id="categories-section" className="py-10 max-w-[1200px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-saffron-deep uppercase tracking-widest block mb-1">
            Explore Themes
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal">
            Browse Baby Names by Category
          </h2>
        </div>
        {selectedCategory !== "all" && (
          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs font-medium text-saffron-deep hover:text-saffron underline self-start sm:self-auto"
          >
            Show All Themes
          </button>
        )}
      </div>

      {/* Grid of 8 visually distinct cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(isSelected ? "all" : cat.id);
                // Scroll smoothly down to the browsing grid
                const el = document.getElementById("browse-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-40 relative overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-br " +
                    cat.bgGradient +
                    " ring-2 ring-saffron shadow-md scale-[1.02]"
                  : "bg-white hover:bg-saffron-light/30 border-saffron/15 hover:border-saffron/40 shadow-soft hover:shadow-card hover:-translate-y-1"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-saffron/20 flex items-center justify-center text-saffron-deep text-lg group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-charcoal-muted bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/10">
                  {cat.count}+ names
                </span>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-charcoal group-hover:text-saffron-deep transition-colors mb-0.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-charcoal-muted line-clamp-1">{cat.sub}</p>
              </div>

              {/* Active Indicator Accent */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-saffron animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
