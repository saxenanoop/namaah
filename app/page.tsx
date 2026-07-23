"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import NameOfTheDay from "@/components/home/NameOfTheDay";
import CategoryGrid from "@/components/home/CategoryGrid";
import AdvancedFilters, { AdvancedFilterState } from "@/components/home/AdvancedFilters";
import AZSidebar from "@/components/names/AZSidebar";
import NameCard from "@/components/names/NameCard";
import NameDetailModal from "@/components/names/NameDetailModal";
import CorrectionModal from "@/components/names/CorrectionModal";
import SuggestNameModal from "@/components/names/SuggestNameModal";
import ShortlistDrawer from "@/components/shortlist/ShortlistDrawer";
import AnalyticsTracker from "@/components/ui/AnalyticsTracker";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { names, BabyName } from "@/data/names";

const SHORTLIST_KEY = "namaah-shortlist-ids";

const DEFAULT_ADVANCED: AdvancedFilterState = {
  rashi: "all",
  nakshatra: "all",
  syllables: "all",
  origin: "all",
};

function MainContent() {
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<"all" | "boy" | "girl" | "unisex">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [sortBy, setSortBy] = useState<"popularity" | "a-z" | "z-a" | "meaning">("popularity");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(DEFAULT_ADVANCED);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Shortlist State
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals
  const [activeDetailName, setActiveDetailName] = useState<BabyName | null>(null);
  const [activeCorrectionName, setActiveCorrectionName] = useState<BabyName | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  const { showToast } = useToast();

  // Load shortlist from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SHORTLIST_KEY);
      if (stored) {
        setShortlistIds(JSON.parse(stored));
      }
    } catch {
      // Storage fallback
    }
  }, []);

  // Save shortlist to LocalStorage
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

  // Extract unique options for advanced filters
  const { allRashis, allNakshatras, allOrigins, availableLetters } = useMemo(() => {
    const rashis = new Set<string>();
    const nakshatras = new Set<string>();
    const origins = new Set<string>();
    const letters = new Set<string>();

    names.forEach((n) => {
      if (n.rashi) rashis.add(n.rashi);
      if (n.nakshatra) nakshatras.add(n.nakshatra);
      if (n.origin) origins.add(n.origin);
      if (n.name) letters.add(n.name.charAt(0).toUpperCase());
    });

    return {
      allRashis: Array.from(rashis).sort(),
      allNakshatras: Array.from(nakshatras).sort(),
      allOrigins: Array.from(origins).sort(),
      availableLetters: Array.from(letters).sort(),
    };
  }, []);

  // Brief loading simulation for smooth filter transitions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGender, selectedCategory, selectedLetter, sortBy, advancedFilters]);

  // Filtered & Sorted Names
  const filteredNames = useMemo(() => {
    let result = [...names];

    // 1. Search Query filter
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

    // 5. Advanced Filters (Rashi, Nakshatra, Syllables, Origin)
    if (advancedFilters.rashi !== "all") {
      result = result.filter((n) => n.rashi === advancedFilters.rashi);
    }
    if (advancedFilters.nakshatra !== "all") {
      result = result.filter((n) => n.nakshatra === advancedFilters.nakshatra);
    }
    if (advancedFilters.origin !== "all") {
      result = result.filter((n) => n.origin === advancedFilters.origin);
    }
    if (advancedFilters.syllables !== "all") {
      if (advancedFilters.syllables === "1") {
        result = result.filter((n) => n.syllables === 1);
      } else if (advancedFilters.syllables === "2") {
        result = result.filter((n) => n.syllables === 2);
      } else if (advancedFilters.syllables === "3+") {
        result = result.filter((n) => n.syllables >= 3);
      }
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === "a-z") return a.name.localeCompare(b.name);
      if (sortBy === "z-a") return b.name.localeCompare(a.name);
      if (sortBy === "meaning") return a.meaning.length - b.meaning.length;
      const popOrder = { trending: 1, classic: 2, rare: 3 };
      return popOrder[a.popularity] - popOrder[b.popularity];
    });

    return result;
  }, [searchQuery, selectedGender, selectedCategory, selectedLetter, sortBy, advancedFilters]);

  // Shortlisted BabyName objects
  const shortlistedNames = useMemo(() => {
    return names.filter((n) => shortlistIds.includes(n.id));
  }, [shortlistIds]);

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedGender("all");
    setSelectedCategory("all");
    setSelectedLetter("all");
    setAdvancedFilters(DEFAULT_ADVANCED);
  };

  const hasAdvancedFilters =
    advancedFilters.rashi !== "all" ||
    advancedFilters.nakshatra !== "all" ||
    advancedFilters.syllables !== "all" ||
    advancedFilters.origin !== "all";

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-slate-900 text-charcoal dark:text-slate-100 transition-colors">
      <AnalyticsTracker />

      {/* Fixed Top Navbar */}
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

        {/* Feature 3: Name of the Day Featured Widget */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <NameOfTheDay
            onViewDetails={(item) => setActiveDetailName(item)}
            isShortlisted={shortlistIds.includes(names[0]?.id)}
            onToggleShortlist={handleToggleShortlist}
          />
        </div>

        {/* Category Grid */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Name Browsing Main Section */}
        <section id="browse-section" className="py-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: A-Z Sticky Alphabet Sidebar (Desktop) / Horizontal Pills (Mobile) */}
            <div className="lg:col-span-3">
              <AZSidebar
                selectedLetter={selectedLetter}
                onSelectLetter={setSelectedLetter}
                availableLetters={availableLetters}
              />
            </div>

            {/* Right Column: Controls, Advanced Filters, Name Grid */}
            <div className="lg:col-span-9 space-y-6">
              {/* Header: Results Count, Advanced Filter Toggle & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-saffron/15 dark:border-saffron/20 shadow-soft">
                <div>
                  <h2 className="font-heading text-xl font-bold text-charcoal dark:text-white">
                    Hindu Baby Names
                  </h2>
                  <p className="text-xs text-charcoal-muted dark:text-slate-400 font-medium mt-0.5">
                    Showing <span className="text-saffron-deep dark:text-saffron font-bold">{filteredNames.length}</span> of{" "}
                    {names.length} names
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                    {selectedLetter !== "all" && ` starting with "${selectedLetter}"`}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Advanced Filters Toggle */}
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      showAdvanced || hasAdvancedFilters
                        ? "bg-saffron text-white border-saffron shadow-sm"
                        : "bg-saffron-light/60 dark:bg-slate-700 text-charcoal dark:text-slate-200 border-saffron/20 hover:border-saffron"
                    }`}
                  >
                    <span>⚙️</span>
                    <span>Filters</span>
                    {hasAdvancedFilters && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </button>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="sort-by" className="text-xs font-semibold text-charcoal-muted dark:text-slate-400 hidden sm:inline">
                      Sort:
                    </label>
                    <select
                      id="sort-by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "popularity" | "a-z" | "z-a" | "meaning")}
                      className="text-xs font-medium bg-saffron-light/60 dark:bg-slate-700 border border-saffron/20 text-charcoal dark:text-white px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron"
                    >
                      <option value="popularity">Popularity (Trending first)</option>
                      <option value="a-z">Alphabetical (A to Z)</option>
                      <option value="z-a">Alphabetical (Z to A)</option>
                      <option value="meaning">Concise Meaning</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Feature 4: Expandable Advanced Filters Panel */}
              {showAdvanced && (
                <AdvancedFilters
                  filters={advancedFilters}
                  onChange={setAdvancedFilters}
                  onReset={() => setAdvancedFilters(DEFAULT_ADVANCED)}
                  allRashis={allRashis}
                  allNakshatras={allNakshatras}
                  allOrigins={allOrigins}
                />
              )}

              {/* Active Filter Chips Bar */}
              {(selectedGender !== "all" ||
                selectedCategory !== "all" ||
                selectedLetter !== "all" ||
                searchQuery !== "" ||
                hasAdvancedFilters) && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
                  <span className="text-xs font-bold text-charcoal-muted dark:text-slate-400">Active Filters:</span>

                  {searchQuery && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Search: &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedGender !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium capitalize">
                      Gender: {selectedGender}
                      <button onClick={() => setSelectedGender("all")} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedCategory !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Theme: {selectedCategory}
                      <button onClick={() => setSelectedCategory("all")} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {selectedLetter !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Letter: {selectedLetter}
                      <button onClick={() => setSelectedLetter("all")} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {advancedFilters.rashi !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Rashi: {advancedFilters.rashi}
                      <button onClick={() => setAdvancedFilters({ ...advancedFilters, rashi: "all" })} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {advancedFilters.nakshatra !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Nakshatra: {advancedFilters.nakshatra}
                      <button onClick={() => setAdvancedFilters({ ...advancedFilters, nakshatra: "all" })} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {advancedFilters.syllables !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Syllables: {advancedFilters.syllables}
                      <button onClick={() => setAdvancedFilters({ ...advancedFilters, syllables: "all" })} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  {advancedFilters.origin !== "all" && (
                    <span className="text-xs bg-saffron-light dark:bg-saffron/20 text-saffron-deep dark:text-saffron px-3 py-1 rounded-full border border-saffron/20 flex items-center gap-1.5 font-medium">
                      Origin: {advancedFilters.origin}
                      <button onClick={() => setAdvancedFilters({ ...advancedFilters, origin: "all" })} className="hover:text-charcoal dark:hover:text-white">
                        ✕
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-charcoal-muted dark:text-slate-400 hover:text-saffron-deep font-semibold underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Feature 8: Skeleton Loading State vs Name Grid */}
              {isLoading ? (
                <SkeletonGrid count={6} />
              ) : filteredNames.length > 0 ? (
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
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-saffron/20 shadow-soft max-w-md mx-auto space-y-4 my-8">
                  <div className="w-16 h-16 rounded-full bg-saffron-light dark:bg-slate-700 flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-charcoal dark:text-white mb-1">
                      No matching names found
                    </h3>
                    <p className="text-xs text-charcoal-muted dark:text-slate-400 leading-relaxed">
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

              {/* Feature 7 Trigger Banner: Suggest a Name */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-saffron-light via-cream to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 border border-saffron/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-soft">
                <div>
                  <h3 className="font-heading text-base font-bold text-charcoal dark:text-white">
                    Know a sacred Hindu name missing here?
                  </h3>
                  <p className="text-xs text-charcoal-muted dark:text-slate-300">
                    Help us expand Namaah for parents worldwide by suggesting a new name.
                  </p>
                </div>
                <button
                  onClick={() => setIsSuggestModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-saffron text-white hover:bg-saffron-dark text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  Suggest a Name 💡
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
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

      {activeCorrectionName && (
        <CorrectionModal
          name={activeCorrectionName}
          onClose={() => setActiveCorrectionName(null)}
        />
      )}

      {/* Feature 7: Suggest a Name Modal */}
      <SuggestNameModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />

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
