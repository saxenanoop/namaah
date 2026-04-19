"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import { NAKSHATRA_LIST, RASHI_LIST } from "@/data/nakshatra";
import NameCard from "@/components/names/NameCard";
import BackToTop from "@/components/ui/BackToTop";

// ─── Constants & Types ───────────────────────────────────────────────────────

interface Filters {
  q: string;
  gender: string[];
  length: string;
  region: string[];
  theme: string[];
  rashi: string;
  popularity: string[];
  nakshatra: string;
  sort: "popular" | "az" | "za";
}

const DEFAULT_FILTERS: Filters = {
  q: "", gender: [], length: "", region: [], theme: [],
  rashi: "", popularity: [], nakshatra: "", sort: "popular",
};

const EDITORIAL_INSERTS = [
  "Did you know? These names are trending in Guwahati this season.",
  "Hidden gems: Rare Vedic names worth knowing.",
  "Mythological picks: Names from the Mahabharata.",
  "Timeless classics: Names that have graced generations.",
];

type ProfileData = {
  gender: string;
  priorities: string[];
  nakshatra: string;
  hasNakshatra: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyFilters(all: BabyName[], f: Filters): BabyName[] {
  let result = all;

  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    result = result.filter(
      (n) => n.name.toLowerCase().includes(q) || n.nameHindi.includes(q)
    );
  }
  if (f.gender.length) result = result.filter((n) => f.gender.includes(n.gender));
  if (f.length === "short") result = result.filter((n) => n.syllables <= 2);
  else if (f.length === "medium") result = result.filter((n) => n.syllables === 3);
  if (f.region.length) result = result.filter((n) => f.region.includes(n.region));
  if (f.theme.length) result = result.filter((n) => f.theme.includes(n.theme));
  if (f.rashi) result = result.filter((n) => n.rashi === f.rashi);
  if (f.popularity.length) result = result.filter((n) => f.popularity.includes(n.popularity));
  if (f.nakshatra) result = result.filter((n) => n.nakshatra === f.nakshatra);

  if (f.sort === "az") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (f.sort === "za") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }
  return result;
}

function paramsToFilters(searchParams: URLSearchParams): Filters {
  const f = { ...DEFAULT_FILTERS };
  if (searchParams.has("q")) f.q = searchParams.get("q")!;
  if (searchParams.has("gender")) f.gender = searchParams.get("gender")!.split(",");
  if (searchParams.has("length")) f.length = searchParams.get("length")!;
  if (searchParams.has("region")) f.region = searchParams.get("region")!.split(",");
  if (searchParams.has("theme")) f.theme = searchParams.get("theme")!.split(",");
  if (searchParams.has("rashi")) f.rashi = searchParams.get("rashi")!;
  if (searchParams.has("popularity")) f.popularity = searchParams.get("popularity")!.split(",");
  if (searchParams.has("nakshatra")) f.nakshatra = searchParams.get("nakshatra")!;
  if (searchParams.has("sort")) f.sort = searchParams.get("sort") as Filters["sort"];
  return f;
}

function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.gender.length) p.set("gender", f.gender.join(","));
  if (f.length) p.set("length", f.length);
  if (f.region.length) p.set("region", f.region.join(","));
  if (f.theme.length) p.set("theme", f.theme.join(","));
  if (f.rashi) p.set("rashi", f.rashi);
  if (f.popularity.length) p.set("popularity", f.popularity.join(","));
  if (f.nakshatra) p.set("nakshatra", f.nakshatra);
  if (f.sort !== "popular") p.set("sort", f.sort);
  return p;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync profile & URL
  useEffect(() => {
    try {
      const stored = localStorage.getItem("namaah-profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    setFilters(paramsToFilters(searchParams));
  }, [searchParams]);

  const updateParamURL = useCallback((newFilters: Filters) => {
    const p = filtersToParams(newFilters);
    const qs = p.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  }, [router]);

  const updateFilter = <K extends keyof Filters>(key: K, val: Filters[K]) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    updateParamURL(next);
  };

  const removeFilter = (key: keyof Filters, val: string | null = null) => {
    const next = { ...filters };
    if (val !== null && Array.isArray(next[key])) {
      next[key] = (next[key] as string[]).filter(x => x !== val) as Extract<Filters[keyof Filters], string[]>;
    } else {
      next[key] = DEFAULT_FILTERS[key] as Extract<Filters[keyof Filters], string>;
    }
    setFilters(next);
    updateParamURL(next);
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    updateParamURL(DEFAULT_FILTERS);
  };

  const results = useMemo(() => applyFilters(names, filters), [filters]);

  // Derived Header logic
  let headerText = "Explore all 2,000+ Hindu baby names";
  if (filters.nakshatra) headerText = `Showing names for ${filters.nakshatra} birth star`;
  else if (filters.theme.includes("mythological")) headerText = "Sacred names with the deepest stories";
  else if (filters.popularity.includes("rare")) headerText = "Rare Vedic gems — names fewer than 1% of parents choose";
  else if (profile?.nakshatra && profile.hasNakshatra && !filters.q) headerText = `Showing names for your baby's Nakshatra: ${profile.nakshatra}`;
  else if (profile?.priorities.includes("mythology") && !filters.q) headerText = "Sacred names with the deepest stories";

  // Dropdown Logic
  const queryWords = filters.q.trim().toLowerCase();
  const suggestionsExact = queryWords ? names.filter(n => n.name.toLowerCase().includes(queryWords) || n.nameHindi.includes(queryWords)).slice(0,2) : [];
  const suggestionsMeaning = queryWords ? names.filter(n => n.meaning.toLowerCase().includes(queryWords)).slice(0,2) : [];
  const suggestionsDeity = queryWords ? names.filter(n => n.deity?.toLowerCase().includes(queryWords)).slice(0,2) : [];

  return (
    <div style={s.pageWrapper}>
      
      {/* ── ZONE 1: Contextual Header ────────────────────────────────────── */}
      <div style={s.zone1Header}>
        <h1 style={s.zone1Text}>{headerText}</h1>
      </div>

      {/* ── ZONE 2: Smart Filter Bar (Sticky) ─────────────────────────────── */}
      <div style={s.zone2StickyBar}>
        <div style={s.searchContainer}>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search by name, meaning, deity..."
            value={filters.q}
            onChange={(e) => updateFilter("q", e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {/* Autocomplete Dropdown */}
          {showDropdown && filters.q.trim() && (
            <div style={s.dropdown}>
              {suggestionsExact.length > 0 && <div style={s.dropdownGroup}>
                <div style={s.dropdownGroupLabel}>🔍 Exact Matches</div>
                {suggestionsExact.map(n => (
                   <div key={n.id} style={s.dropdownItem} onClick={() => router.push(`/name/${n.slug}`)}>
                     <strong>{n.name}</strong> <span style={{color:"#9898A8"}}>{n.nameHindi}</span> — {n.meaning}
                   </div>
                ))}
              </div>}
              {suggestionsMeaning.length > 0 && <div style={s.dropdownGroup}>
                <div style={s.dropdownGroupLabel}>📖 Meaning Matches</div>
                <div style={s.dropdownItem} onClick={() => router.push(`/search?q=${filters.q}`)}>
                   Show all names that mean &quot;{filters.q}&quot; &rarr;
                </div>
              </div>}
              {suggestionsDeity.length > 0 && <div style={s.dropdownGroup}>
                <div style={s.dropdownGroupLabel}>🪔 Deity Matches</div>
                <div style={s.dropdownItem} onClick={() => router.push(`/search?q=${filters.q}`)}>
                   Show all names connected to {filters.q} &rarr;
                </div>
              </div>}
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div style={s.filterRowDesktop}>
          <select style={s.pillSelect} value={filters.gender[0] || ""} onChange={e => {
            const v = e.target.value; updateFilter("gender", v ? [v] : []);
          }}>
            <option value="">Any Gender</option>
            <option value="boy">Boys</option>
            <option value="girl">Girls</option>
            <option value="unisex">Unisex</option>
          </select>

          <select style={s.pillSelect} value={filters.popularity[0] || ""} onChange={e => {
             const v = e.target.value; updateFilter("popularity", v ? [v] : []);
          }}>
            <option value="">Any Popularity</option>
            <option value="trending">Trending</option>
            <option value="classic">Classic</option>
            <option value="rare">Rare Gems</option>
          </select>

          <select style={s.pillSelect} value={filters.theme[0] || ""} onChange={e => {
             const v = e.target.value; updateFilter("theme", v ? [v] : []);
          }}>
            <option value="">Any Theme</option>
            <option value="mythological">Mythological</option>
            <option value="nature">Nature</option>
            <option value="deity">Deity</option>
            <option value="modern">Modern</option>
          </select>

          <select style={s.pillSelect} value={filters.nakshatra || ""} onChange={e => updateFilter("nakshatra", e.target.value)}>
            <option value="">Nakshatra...</option>
            {NAKSHATRA_LIST.map(nk => <option key={nk.id} value={nk.name}>{nk.name}</option>)}
          </select>

          <button style={s.mobileMoreFiltersBtn} onClick={() => setMobileSheetOpen(true)}>
            + More Filters
          </button>
        </div>

        {/* Active Chips Row */}
        <div style={s.activeChipsRow}>
           {filters.gender.map(g => (
             <span key={g} style={s.chip}>{g} <button onClick={()=>removeFilter("gender", g)} style={s.chipX}>×</button></span>
           ))}
           {filters.popularity.map(p => (
             <span key={p} style={s.chip}>{p} <button onClick={()=>removeFilter("popularity", p)} style={s.chipX}>×</button></span>
           ))}
           {filters.theme.map(t => (
             <span key={t} style={s.chip}>{t} <button onClick={()=>removeFilter("theme", t)} style={s.chipX}>×</button></span>
           ))}
           {filters.nakshatra && (
             <span style={s.chip}>{filters.nakshatra} <button onClick={()=>removeFilter("nakshatra")} style={s.chipX}>×</button></span>
           )}
           {filters.rashi && (
             <span style={s.chip}>{filters.rashi} <button onClick={()=>removeFilter("rashi")} style={s.chipX}>×</button></span>
           )}
           
           {(filters.gender.length > 0 || filters.popularity.length > 0 || filters.theme.length > 0 || filters.nakshatra || filters.rashi) && (
             <button style={s.clearAllBtn} onClick={clearAll}>Clear all</button>
           )}
        </div>
      </div>

      {/* ── ZONE 3: Results Area ──────────────────────────────────────────── */}
      <div style={s.zone3ResultsWrap}>
        <div style={s.resultsMetaBar}>
          <span style={s.resultsCount}>Showing {results.length} names</span>
          <select style={s.sortSelect} value={filters.sort} onChange={e => updateFilter("sort", e.target.value as Filters["sort"])}>
            <option value="popular">Most Popular</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>

        {results.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.lotusSvg}>🪷</div>
            <h3 style={s.emptyTitle}>No names match these filters</h3>
            <p style={s.emptySubtitle}>Try one of these popular combinations:</p>
            <div style={s.emptyOptions}>
               <button onClick={() => { clearAll(); updateFilter("gender", ["boy"]); updateFilter("popularity", ["trending"]); }} style={s.emptyPromptPill}>Trending Boys</button>
               <button onClick={() => { clearAll(); updateFilter("theme", ["mythological"]); }} style={s.emptyPromptPill}>Mythological Names</button>
               <button onClick={() => { clearAll(); updateFilter("popularity", ["rare"]); updateFilter("gender", ["girl"]); }} style={s.emptyPromptPill}>Rare Girl Gems</button>
            </div>
          </div>
        ) : (
          <div style={s.grid}>
            {results.map((name, idx) => (
              <div style={{ display: 'contents' }} key={name.id}>
                <NameCard name={name} compact={true} />
                {/* Break every 12 items (idx count 11, 23, 35...) */}
                {(idx + 1) % 12 === 0 && (
                  <div style={s.editorialBreak}>
                    <p style={s.editorialCopy}>{EDITORIAL_INSERTS[Math.floor(idx / 12) % EDITORIAL_INSERTS.length]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {mobileSheetOpen && (
        <div style={s.bottomSheetOverlay} onClick={() => setMobileSheetOpen(false)}>
          <div style={s.bottomSheetModal} onClick={e => e.stopPropagation()}>
             <div style={s.sheetHeader}>
               <h3>More Filters</h3>
               <button onClick={() => setMobileSheetOpen(false)} style={s.closeBtn}>✕</button>
             </div>
             
             <div style={s.sheetBody}>
                <label style={s.sheetLabel}>Select Rashi</label>
                <select style={s.sheetSelect} value={filters.rashi} onChange={e => updateFilter("rashi", e.target.value)}>
                   <option value="">All Rashis</option>
                   {RASHI_LIST.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>

                <label style={s.sheetLabel}>Name Length</label>
                <select style={s.sheetSelect} value={filters.length} onChange={e => updateFilter("length", e.target.value)}>
                   <option value="">Any Length</option>
                   <option value="short">Short (1-2 syllables)</option>
                   <option value="medium">Medium (3 syllables)</option>
                </select>
             </div>
          </div>
        </div>
      )}
      
      <BackToTop />
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#FCFDFE",
  },
  zone1Header: {
    backgroundColor: "#FDF4EE",
    padding: "24px 32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #F0E6DD",
  },
  zone1Text: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "24px",
    color: "#C8601A",
    fontWeight: 500,
    margin: 0,
    textAlign: "center",
  },
  zone2StickyBar: {
    top: 0,
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #E8ECF5",
    padding: "16px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchInput: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "15px",
    fontFamily: "var(--font-body), sans-serif",
    border: "1.5px solid #2E3A5C",
    borderRadius: "12px",
    outline: "none",
    boxShadow: "0 4px 12px rgba(46, 58, 92, 0.05)",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #E8ECF5",
    borderRadius: "8px",
    marginTop: "8px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    zIndex: 200,
    overflow: "hidden",
  },
  dropdownGroup: {
    padding: "8px 0",
    borderBottom: "1px solid #F0F2F8",
  },
  dropdownGroupLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#9898A8",
    padding: "4px 16px",
    textTransform: "uppercase",
  },
  dropdownItem: {
    fontSize: "14px",
    fontFamily: "var(--font-body), sans-serif",
    padding: "10px 16px",
    color: "#2E3A5C",
    cursor: "pointer",
  },
  filterRowDesktop: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  pillSelect: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #E8ECF5",
    backgroundColor: "#ffffff",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    color: "#2E3A5C",
    fontWeight: 500,
    cursor: "pointer",
  },
  mobileMoreFiltersBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1.5px solid #C8601A",
    backgroundColor: "transparent",
    color: "#C8601A",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  activeChipsRow: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
    minHeight: "24px",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    backgroundColor: "#F4F6F9",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#4A5A82",
    fontFamily: "var(--font-body), sans-serif",
  },
  chipX: {
    background: "none", border: "none", color: "#9898A8", cursor: "pointer",
    fontSize: "14px", lineHeight: 1, padding: 0
  },
  clearAllBtn: {
    background: "none", border: "none", color: "#C8601A", fontSize: "12px", textDecoration: "underline", cursor: "pointer"
  },
  zone3ResultsWrap: {
    padding: "32px",
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
  },
  resultsMetaBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  resultsCount: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    color: "#9898A8",
  },
  sortSelect: {
    border: "none",
    background: "transparent",
    color: "#2E3A5C",
    fontFamily: "var(--font-body), sans-serif",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
  editorialBreak: {
    gridColumn: "1 / -1",
    backgroundColor: "#2E3A5C",
    padding: "24px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "16px 0",
  },
  editorialCopy: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "24px",
    color: "#ffffff",
    margin: 0,
    fontStyle: "italic",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 0",
  },
  lotusSvg: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontFamily: "var(--font-display), serif",
    fontSize: "28px",
    color: "#2E3A5C",
    margin: "0 0 8px 0",
  },
  emptySubtitle: {
    fontFamily: "var(--font-body), sans-serif",
    color: "#6B6B80",
    marginBottom: "24px",
  },
  emptyOptions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyPromptPill: {
    padding: "10px 20px",
    backgroundColor: "#FDF4EE",
    border: "1px solid #C8601A",
    color: "#C8601A",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
  bottomSheetOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", alignItems: "flex-end",
  },
  bottomSheetModal: {
    width: "100%", backgroundColor: "#fff", borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
    padding: "24px", paddingBottom: "48px",
  },
  sheetHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px",
  },
  closeBtn: {
    background: "none", border: "none", fontSize: "20px", color: "#9898A8", cursor: "pointer",
  },
  sheetBody: {
    display: "flex", flexDirection: "column", gap: "16px",
  },
  sheetLabel: {
    fontSize: "13px", fontWeight: 600, color: "#2E3A5C",
  },
  sheetSelect: {
    padding: "12px", borderRadius: "8px", border: "1px solid #E8ECF5", width: "100%",
  }
};
