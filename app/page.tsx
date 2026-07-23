"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import AZSidebar from "@/components/names/AZSidebar";
import NameCard from "@/components/names/NameCard";
import NameDetailModal from "@/components/names/NameDetailModal";
import CorrectionModal from "@/components/names/CorrectionModal";
import ShortlistDrawer from "@/components/shortlist/ShortlistDrawer";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { names, BabyName } from "@/data/names";

const SHORTLIST_KEY = "namaah-shortlist-ids";

function MainContent() {
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<"all" | "boy" | "girl" | "unisex">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [sortBy, setSortBy] = useState<"popularity" | "a-z" | "z-a" | "meaning">("popularity");

  // Shortlist State (stored as array of name IDs in LocalStorage)
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals
  const [activeDetailName, setActiveDetailName] = useState<BabyName | null>(null);
  const [activeCorrectionName, setActiveCorrectionName] = useState<BabyName | null>(null);

  const { showToast } = useToast();

  // Load shortlist from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHORTLIST_KEY);
      if (stored) {
        setShortlistIds(JSON.parse(stored));
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save shortlist to LocalStorage whenever it changes
  const saveShortlist = (ids: string[]) => {
    setShortlistIds(ids);
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
    } catch {}
  };

  // Toggle Shortlist item
  const handleToggleShortlist = (name: BabyName) => {
    const exists = shortlistIds.includes(name.id);
    if (exists) {
      const next = shortlistIds.filter((id) => id !== name.id);
      saveShortlist(next);
      showToast(`Removed "${name.name}" from shortlist`, "info");
    } else {
      const next = [...shortlistIds, name.id];
      saveShortlist(next);
      showToast(`Added "${name.name}" to shortlist ❤️`, "heart");
    }
  };

  const handleClearShortlist = () => {
    saveShortlist([]);
    showToast("Cleared all items from shortlist", "info");
  };

  // Available letters in dataset for A-Z sidebar
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    names.forEach((n) => {
      if (n.name) letters.add(n.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, []);

  // Filtered & Sorted Names
  const filteredNames = useMemo(() => {
    let result = [...names];

    // 1. Search Query filter (name, Hindi name, meaning, or starting letter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.nameHindi.includes(q) ||
          n.meaning.toLowerCase().includes(q) ||
          n.meaningFull.toLowerCase().includes(q) ||
          n.origin.toLowerCase().includes(q) ||
          n.name.toLowerCase().startsWith(q)
      );
    }

    // 2. Gender Filter
    if (selectedGender !== "all") {
      result = result.filter((n) => n.gender === selectedGender || n.gender === "unisex");
    }

    // 3. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((n) => n.categories?.includes(selectedCategory));
    }

    // 4. Letter Filter
    if (selectedLetter !== "all") {
      result = result.filter((n) => n.name.toUpperCase().startsWith(selectedLetter));
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === "a-z") return a.name.localeCompare(b.name);
      if (sortBy === "z-a") return b.name.localeCompare(a.name);
      if (sortBy === "meaning") return a.meaning.length - b.meaning.length;
      // Default: Popularity (Trending -> Classic -> Rare)
      const popOrder = { trending: 1, classic: 2, rare: 3 };
      return popOrder[a.popularity] - popOrder[b.popularity];
    });

    return result;
  }, [searchQuery, selectedGender, selectedCategory, selectedLetter, sortBy]);

  // Shortlisted BabyName objects
  const shortlistedNames = useMemo(() => {
    return names.filter((n) => shortlistIds.includes(n.id));
  }, [shortlistIds]);

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedGender("all");
    setSelectedCategory("all");
    setSelectedLetter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Fixed Navbar */}
      <Navbar
        shortlistCount={shortlistIds.length}
        onOpenShortlist={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Category Grid */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Name Browsing Main Section */}
        <section id="browse-section" className="py-12 max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: A-Z Sticky Alphabet Sidebar (Desktop) / Horizontal Pills (Mobile) */}
            <div className="lg:col-span-3">
              <AZSidebar
                selectedLetter={selectedLetter}
                onSelectLetter={setSelectedLetter}
                availableLetters={availableLetters}
              />
            </div>

            {/* Right Column: Name Grid, Sort Header & Results */}
            <div className="lg:col-span-9 space-y-6">
              {/* Header: Results Count & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-saffron/15 shadow-soft">
                <div>
                  <h2 className="font-heading text-xl font-bold text-charcoal">
                    Hindu Baby Names
                  </h2>
                  <p className="text-xs text-charcoal-muted font-medium mt-0.5">
                    Showing <span className="text-saffron-deep font-bold">{filteredNames.length}</span> of{" "}
                    {names.length} names
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                    {selectedLetter !== "all" && ` starting with "${selectedLetter}"`}
                  </p>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label htmlFor="sort-by" className="text-xs font-semibold text-charcoal-muted">
                    Sort by:
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "popularity" | "a-z" | "z-a" | "meaning")}
                    className="text-xs font-medium bg-saffron-light/60 border border-saffron/20 text-charcoal px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron"
                  >
                    <option value="popularity">Popularity (Trending first)</option>
                    <option value="a-z">Alphabetical (A to Z)</option>
                    <option value="z-a">Alphabetical (Z to A)</option>
                    <option value="meaning">Concise Meaning</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips Bar */}
              {(selectedGender !== "all" ||
                selectedCategory !== "all" ||
                selectedLetter !== "all" ||
                searchQuery !== "") && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-charcoal-muted">Active Filters:</span>

                  {searchQuery && (
                    <span className="text-xs bg-saffron-light text-saffron-deep px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Search: &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")} className="hover:text-charcoal">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedGender !== "all" && (
                    <span className="text-xs bg-saffron-light text-saffron-deep px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium capitalize">
                      Gender: {selectedGender}
                      <button onClick={() => setSelectedGender("all")} className="hover:text-charcoal">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedCategory !== "all" && (
                    <span className="text-xs bg-saffron-light text-saffron-deep px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Theme: {selectedCategory}
                      <button onClick={() => setSelectedCategory("all")} className="hover:text-charcoal">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedLetter !== "all" && (
                    <span className="text-xs bg-saffron-light text-saffron-deep px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Letter: {selectedLetter}
                      <button onClick={() => setSelectedLetter("all")} className="hover:text-charcoal">
                        ✕
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-charcoal-muted hover:text-saffron-deep font-semibold underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Name Grid (3 cols desktop, 2 tablet, 1 mobile) */}
              {filteredNames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredNames.map((nameItem, idx) => (
                    <div
                      key={nameItem.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}
                    >
                      <NameCard
                        name={nameItem}
                        isShortlisted={shortlistIds.includes(nameItem.id)}
                        onToggleShortlist={handleToggleShortlist}
                        onViewDetails={(item) => setActiveDetailName(item)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="p-12 text-center bg-white rounded-3xl border border-saffron/20 shadow-soft max-w-md mx-auto space-y-4 my-8">
                  <div className="w-16 h-16 rounded-full bg-saffron-light flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-charcoal mb-1">
                      No matching names found
                    </h3>
                    <p className="text-xs text-charcoal-muted leading-relaxed">
                      We couldn&apos;t find any names matching your current filters. Try searching with a different term or clearing your filters.
                    </p>
                  </div>
                  <button
                    onClick={handleClearAllFilters}
                    className="px-6 py-2.5 rounded-full bg-saffron text-white text-xs font-semibold hover:bg-saffron-dark transition-all shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {activeDetailName && (
        <NameDetailModal
          name={activeDetailName}
          onClose={() => setActiveDetailName(null)}
          isShortlisted={shortlistIds.includes(activeDetailName.id)}
          onToggleShortlist={handleToggleShortlist}
          onSelectSimilarName={(sim) => setActiveDetailName(sim)}
          onOpenCorrection={(item) => {
            setActiveDetailName(null);
            setActiveCorrectionName(item);
          }}
        />
      )}

      {/* Correction Modal */}
      {activeCorrectionName && (
        <CorrectionModal
          name={activeCorrectionName}
          onClose={() => setActiveCorrectionName(null)}
        />
      )}

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        shortlist={shortlistedNames}
        onRemove={handleToggleShortlist}
        onClearAll={handleClearShortlist}
        onViewDetails={(item) => setActiveDetailName(item)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <MainContent />
    </ToastProvider>
  );
}
