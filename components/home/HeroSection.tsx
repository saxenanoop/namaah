"use client";

import React from "react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGender: "all" | "boy" | "girl" | "unisex";
  onGenderChange: (gender: "all" | "boy" | "girl" | "unisex") => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CATEGORIES = [
  "All Themes",
  "Deity Names",
  "Nature & Earth",
  "Vedic Virtues",
  "Mythological Heroes",
  "South Indian",
  "Short & Sweet",
  "Celebrity Picks",
  "Royal & Rare",
];

export default function HeroSection({
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
  selectedCategory,
  onCategorySelect,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 text-center">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-saffron/15 via-saffron/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-12 left-10 w-24 h-24 bg-teal/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-4">
        {/* Sacred Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-light border border-saffron/30 text-saffron-deep text-xs font-medium mb-6 animate-fade-in shadow-sm">
          <span>✨</span>
          <span>Curated Vedic & Sanskrit Name Collection</span>
          <span>✦</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.15] mb-5">
          Find the Perfect Name for Your Little One
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Discover 500+ meaningful Hindu baby names rooted in Sanskrit, mythology, nature, and tradition.
        </p>

        {/* Prominent Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-card border border-saffron/30 focus-within:border-saffron focus-within:ring-4 focus-within:ring-saffron/15 transition-all">
            <div className="pl-3.5 pr-2 text-saffron">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, meaning, or starting letter..."
              className="w-full py-2.5 px-2 text-sm sm:text-base text-charcoal placeholder-charcoal/40 bg-transparent focus:outline-none font-body"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="px-3 text-xs text-charcoal-muted hover:text-charcoal font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips: Gender & Category */}
        <div className="space-y-4">
          {/* Gender Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mr-1">
              Gender:
            </span>
            <button
              onClick={() => onGenderChange("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedGender === "all"
                  ? "bg-charcoal text-white shadow-sm"
                  : "bg-white border border-charcoal/15 text-charcoal-muted hover:border-charcoal/40"
              }`}
            >
              All Genders
            </button>
            <button
              onClick={() => onGenderChange("boy")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedGender === "boy"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Baby Boy
            </button>
            <button
              onClick={() => onGenderChange("girl")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedGender === "girl"
                  ? "bg-pink-600 text-white shadow-sm"
                  : "bg-white border border-pink-200 text-pink-700 hover:bg-pink-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              Baby Girl
            </button>
            <button
              onClick={() => onGenderChange("unisex")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedGender === "unisex"
                  ? "bg-teal-dark text-white shadow-sm"
                  : "bg-white border border-teal/30 text-teal-dark hover:bg-teal-light"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal"></span>
              Unisex
            </button>
          </div>

          {/* Popular Category Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mr-1">
              Popular:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive =
                (cat === "All Themes" && selectedCategory === "all") ||
                selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat === "All Themes" ? "all" : cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-saffron text-white shadow-sm"
                      : "bg-saffron-light/70 text-saffron-deep border border-saffron/20 hover:bg-saffron-light"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
