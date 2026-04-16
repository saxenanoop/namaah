"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import { NAKSHATRA_LIST, RASHI_LIST } from "@/data/nakshatra";
import NameCard from "@/components/names/NameCard";
import AdBanner from "@/components/ui/AdBanner";
import BackToTop from "@/components/ui/BackToTop";

// ─── Filter state type ────────────────────────────────────────────────────────

interface Filters {
  q: string;
  gender: string[];          // "boy" | "girl" | "unisex"
  length: string;            // "" | "short" | "medium"
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

// ─── Filter helpers ───────────────────────────────────────────────────────────

function applyFilters(all: BabyName[], f: Filters): BabyName[] {
  let result = all;

  // Query
  if (f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    result = result.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.nameHindi.includes(q) ||
        n.nakshatra.toLowerCase().includes(q)
    );
  }

  // Gender
  if (f.gender.length)
    result = result.filter((n) => f.gender.includes(n.gender));

  // Length (syllables)
  if (f.length === "short")
    result = result.filter((n) => n.syllables <= 2);
  else if (f.length === "medium")
    result = result.filter((n) => n.syllables === 3);

  // Region
  if (f.region.length)
    result = result.filter((n) => f.region.includes(n.region));

  // Theme
  if (f.theme.length)
    result = result.filter((n) => f.theme.includes(n.theme));

  // Rashi
  if (f.rashi)
    result = result.filter((n) =>
      n.rashi.toLowerCase().includes(f.rashi.toLowerCase())
    );

  // Popularity
  if (f.popularity.length)
    result = result.filter((n) => f.popularity.includes(n.popularity));

  // Nakshatra
  if (f.nakshatra)
    result = result.filter((n) =>
      n.nakshatra.toLowerCase().includes(f.nakshatra.toLowerCase())
    );

  // Sort
  if (f.sort === "az") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  else if (f.sort === "za") result = [...result].sort((a, b) => b.name.localeCompare(a.name));
  // "popular" keeps original order (trending first)

  return result;
}

function paramsToFilters(params: URLSearchParams): Filters {
  const get = (k: string) => params.get(k) ?? "";
  const getArr = (k: string) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const syllables = get("syllables");
  return {
    q:          get("q"),
    gender:     getArr("gender"),
    length:     syllables === "1" || syllables === "short" ? "short"
              : syllables === "medium" ? "medium" : "",
    region:     getArr("region"),
    theme:      getArr("theme"),
    rashi:      get("rashi"),
    popularity: getArr("popularity"),
    nakshatra:  get("nakshatra"),
    sort:       (get("sort") as Filters["sort"]) || "popular",
  };
}

function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q)               p.set("q",          f.q);
  if (f.gender.length)   p.set("gender",      f.gender.join(","));
  if (f.length)          p.set("syllables",   f.length);
  if (f.region.length)   p.set("region",      f.region.join(","));
  if (f.theme.length)    p.set("theme",       f.theme.join(","));
  if (f.rashi)           p.set("rashi",       f.rashi);
  if (f.popularity.length) p.set("popularity", f.popularity.join(","));
  if (f.nakshatra)       p.set("nakshatra",   f.nakshatra);
  if (f.sort !== "popular") p.set("sort",     f.sort);
  return p;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() =>
    paramsToFilters(searchParams)
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce the text query by 200 ms so filtering doesn't fire on every keystroke.
  const [debouncedQ, setDebouncedQ] = useState(filters.q);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(filters.q), 200);
    return () => clearTimeout(timer);
  }, [filters.q]);

  // Memoised filtering — only re-runs when filters change (using debouncedQ for text).
  const results = useMemo(
    () => applyFilters(names, { ...filters, q: debouncedQ }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQ, filters.gender, filters.length, filters.region, filters.theme,
     filters.rashi, filters.popularity, filters.nakshatra, filters.sort]
  );

  // Sync URL when filters change
  useEffect(() => {
    const p = filtersToParams(filters);
    const qs = p.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  }, [filters, router]);

  // Sync filters when URL changes externally (e.g. browser back)
  useEffect(() => {
    setFilters(paramsToFilters(searchParams));
  }, [searchParams]);

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) =>
      setFilters((f) => ({ ...f, [key]: value })),
    []
  );

  const toggleArr = useCallback(
    <K extends keyof Filters>(key: K, val: string) =>
      setFilters((f) => {
        const arr = f[key] as string[];
        return {
          ...f,
          [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
        };
      }),
    []
  );

  const clearAll = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <>
      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <div style={s.mobileOverlay}>
          <div style={s.mobileOverlayInner}>
            <div style={s.mobileOverlayHeader}>
              <span style={s.mobileOverlayTitle}>Filters</span>
              <button
                style={s.mobileCloseBtn}
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >✕</button>
            </div>
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              toggleArr={toggleArr}
              clearAll={() => { clearAll(); setMobileFiltersOpen(false); }}
            />
          </div>
        </div>
      )}

      <div style={s.pageWrap}>
        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <aside style={s.sidebar} aria-label="Search filters">
          <FilterPanel
            filters={filters}
            updateFilter={updateFilter}
            toggleArr={toggleArr}
            clearAll={clearAll}
          />
        </aside>

        {/* ── Results Area ─────────────────────────────────────────── */}
        <div style={s.resultsArea}>
          {/* Mobile filter toggle */}
          <button
            className="mobile-filter-btn"
            style={s.mobileFilterToggle}
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
          >
            <FilterIcon /> Filters
            {Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : v && v !== "popular"))
              ? " (active)" : ""}
          </button>

          {/* Top bar */}
          <div style={s.topBar}>
            <span style={s.countLabel}>
              Showing <strong>{results.length}</strong> name{results.length !== 1 ? "s" : ""}
            </span>
            <select
              style={s.sortSelect}
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value as Filters["sort"])}
              aria-label="Sort results"
            >
              <option value="popular">Most Popular</option>
              <option value="az">A – Z</option>
              <option value="za">Z – A</option>
            </select>
          </div>

          {/* Ad unit — rectangle below top bar */}
          <div style={s.adWrap}>
            <AdBanner slot="search-sidebar" format="rectangle" />
          </div>

          {/* Results grid */}
          {results.length > 0 ? (
            <div style={s.grid}>
              {results.map((n) => (
                <NameCard key={n.id} name={n} />
              ))}
            </div>
          ) : (
            <div style={s.emptyState}>
              {/* Lotus SVG illustration */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
                style={{ marginBottom: 20, opacity: 0.55 }}
              >
                {/* Central petal */}
                <path d="M32 48 C28 36 26 26 32 16 C38 26 36 36 32 48Z" fill="#C8601A" />
                {/* Left petals */}
                <path d="M32 44 C22 38 14 30 18 18 C26 26 30 34 32 44Z" fill="#E8A87C" />
                <path d="M32 40 C18 36 10 24 16 12 C22 22 26 32 32 40Z" fill="#F0C8A0" opacity="0.7"/>
                {/* Right petals */}
                <path d="M32 44 C42 38 50 30 46 18 C38 26 34 34 32 44Z" fill="#E8A87C" />
                <path d="M32 40 C46 36 54 24 48 12 C42 22 38 32 32 40Z" fill="#F0C8A0" opacity="0.7"/>
                {/* Stem */}
                <path d="M32 48 C32 52 31 58 30 62" stroke="#C8601A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                {/* Water ripple */}
                <ellipse cx="32" cy="52" rx="12" ry="3" stroke="#E8ECF5" strokeWidth="1" fill="none" />
                <ellipse cx="32" cy="52" rx="20" ry="5" stroke="#E8ECF5" strokeWidth="0.8" fill="none" opacity="0.5"/>
              </svg>

              <h2 style={s.emptyHeading}>No names match these filters</h2>
              <p style={s.emptyText}>
                Try removing one filter, or search by a different Rashi
              </p>
              <button style={s.clearLink} onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  filters,
  updateFilter,
  toggleArr,
  clearAll,
}: {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  toggleArr: <K extends keyof Filters>(k: K, v: string) => void;
  clearAll: () => void;
}) {
  return (
    <div style={fp.panel}>
      <p style={fp.panelTitle}>Filter names</p>

      {/* Search */}
      <FilterSection label="Search">
        <input
          type="search"
          value={filters.q}
          onChange={(e) => updateFilter("q", e.target.value)}
          placeholder="Name, meaning, or syllable…"
          style={fp.textInput}
          aria-label="Search names"
        />
      </FilterSection>

      {/* Gender */}
      <FilterSection label="Gender">
        <PillGroup
          options={[
            { value: "boy",    label: "Boys" },
            { value: "girl",   label: "Girls" },
            { value: "unisex", label: "Unisex" },
          ]}
          active={filters.gender}
          onToggle={(v) => toggleArr("gender", v)}
        />
      </FilterSection>

      {/* Length */}
      <FilterSection label="Length">
        <PillGroup
          options={[
            { value: "short",  label: "Short (1–2)" },
            { value: "medium", label: "Medium (3)" },
          ]}
          active={filters.length ? [filters.length] : []}
          onToggle={(v) =>
            updateFilter("length", filters.length === v ? "" : v)
          }
        />
      </FilterSection>

      {/* Region */}
      <FilterSection label="Region">
        {[
          { value: "north", label: "North India" },
          { value: "south", label: "South India" },
          { value: "west",  label: "West India" },
          { value: "east",  label: "East India" },
          { value: "pan-india", label: "Pan India" },
        ].map((r) => (
          <CheckItem
            key={r.value}
            label={r.label}
            checked={filters.region.includes(r.value)}
            onChange={() => toggleArr("region", r.value)}
          />
        ))}
      </FilterSection>

      {/* Theme */}
      <FilterSection label="Theme">
        {[
          { value: "deity",        label: "Deity" },
          { value: "nature",       label: "Nature" },
          { value: "virtue",       label: "Virtue" },
          { value: "mythological", label: "Mythological" },
          { value: "modern",       label: "Modern" },
          { value: "vedic",        label: "Vedic" },
        ].map((t) => (
          <CheckItem
            key={t.value}
            label={t.label}
            checked={filters.theme.includes(t.value)}
            onChange={() => toggleArr("theme", t.value)}
          />
        ))}
      </FilterSection>

      {/* Rashi */}
      <FilterSection label="Rashi">
        <select
          value={filters.rashi}
          onChange={(e) => updateFilter("rashi", e.target.value)}
          style={fp.selectInput}
          aria-label="Filter by Rashi"
        >
          <option value="">Any Rashi</option>
          {RASHI_LIST.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name} ({r.westernSign})
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Popularity */}
      <FilterSection label="Popularity">
        <PillGroup
          options={[
            { value: "trending", label: "Trending" },
            { value: "classic",  label: "Classic" },
            { value: "rare",     label: "Rare gem" },
          ]}
          active={filters.popularity}
          onToggle={(v) => toggleArr("popularity", v)}
        />
      </FilterSection>

      {/* Nakshatra */}
      <FilterSection label="Nakshatra">
        <select
          value={filters.nakshatra}
          onChange={(e) => updateFilter("nakshatra", e.target.value)}
          style={fp.selectInput}
          aria-label="Filter by Nakshatra"
        >
          <option value="">Any Nakshatra</option>
          {NAKSHATRA_LIST.map((n) => (
            <option key={n.id} value={n.name}>
              {n.name} — {n.nameHindi}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Clear All */}
      <button style={fp.clearBtn} onClick={clearAll}>
        Clear all filters
      </button>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={fp.section}>
      <p style={fp.sectionLabel}>{label.toUpperCase()}</p>
      {children}
    </div>
  );
}

function PillGroup({
  options,
  active,
  onToggle,
}: {
  options: { value: string; label: string }[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={fp.pillRow}>
      {options.map((o) => {
        const on = active.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() => onToggle(o.value)}
            style={{
              ...fp.pill,
              backgroundColor: on ? "#2E3A5C" : "#ffffff",
              color:           on ? "#ffffff" : "#6B6B80",
              borderColor:     on ? "#2E3A5C" : "#E8ECF5",
            }}
            aria-pressed={on}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  const id = `chk-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} style={fp.checkRow}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={fp.checkbox}
      />
      <span style={fp.checkLabel}>{label}</span>
    </label>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ marginRight: 6 }}>
      <line x1="4" y1="6"  x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="12" y1="18" x2="20" y2="18" />
    </svg>
  );
}

// ─── Page styles ──────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  pageWrap: {
    display:   "flex",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 60px)",
    maxWidth:  "1280px",
    margin:    "0 auto",
    padding:   "0",
  },
  sidebar: {
    width:       "260px",
    flexShrink:  0,
    position:    "sticky",
    top:         "60px",
    maxHeight:   "calc(100vh - 60px)",
    overflowY:   "auto" as const,
    borderRight: "1px solid #E8ECF5",
    backgroundColor: "#ffffff",
  },
  resultsArea: {
    flex:    1,
    padding: "24px",
    minWidth: 0,
  },
  topBar: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   "16px",
    flexWrap:       "wrap" as const,
    gap:            "8px",
  },
  countLabel: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#6B6B80",
  },
  sortSelect: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    color:           "#2E3A5C",
    border:          "1px solid #E8ECF5",
    borderRadius:    "6px",
    padding:         "5px 10px",
    backgroundColor: "#ffffff",
    cursor:          "pointer",
    outline:         "none",
  },
  adWrap: {
    marginBottom: "24px",
    display:      "flex",
  },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "16px",
  },
  emptyState: {
    textAlign:      "center" as const,
    padding:        "80px 24px",
    display:        "flex",
    flexDirection:  "column" as const,
    alignItems:     "center",
  },
  emptyHeading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 8px",
  },
  emptyText: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "15px",
    color:       "#6B6B80",
    marginBottom: "16px",
  },
  clearLink: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#C8601A",
    background:      "none",
    border:          "1px solid #C8601A",
    borderRadius:    "20px",
    padding:         "7px 18px",
    cursor:          "pointer",
  },
  // Mobile
  mobileFilterToggle: {
    display:         "none",
    alignItems:      "center",
    marginBottom:    "16px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#2E3A5C",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "20px",
    padding:         "8px 16px",
    cursor:          "pointer",
  },
  mobileOverlay: {
    position:        "fixed",
    inset:           0,
    zIndex:          200,
    backgroundColor: "rgba(20,20,40,0.45)",
  },
  mobileOverlayInner: {
    position:        "absolute",
    top:             0,
    left:            0,
    bottom:          0,
    width:           "min(320px, 100vw)",
    backgroundColor: "#ffffff",
    overflowY:       "auto" as const,
  },
  mobileOverlayHeader: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "16px 20px",
    borderBottom:   "1px solid #E8ECF5",
    position:       "sticky",
    top:            0,
    backgroundColor: "#ffffff",
    zIndex:         1,
  },
  mobileOverlayTitle: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "18px",
    fontWeight: 600,
    color:      "#2E3A5C",
  },
  mobileCloseBtn: {
    background:  "none",
    border:      "none",
    fontSize:    "18px",
    cursor:      "pointer",
    color:       "#6B6B80",
    padding:     "4px",
  },
};

// ─── Filter panel styles ──────────────────────────────────────────────────────

const fp: Record<string, React.CSSProperties> = {
  panel: {
    padding: "24px",
  },
  panelTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "18px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 20px",
  },
  section: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #F0F2F8",
  },
  sectionLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.08em",
    color:         "#9898A8",
    margin:        "0 0 10px",
  },
  textInput: {
    width:           "100%",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    color:           "#1A1A2E",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "9px 12px",
    outline:         "none",
    backgroundColor: "#FDFCFA",
    boxSizing:       "border-box" as const,
  },
  selectInput: {
    width:           "100%",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    color:           "#2E3A5C",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "9px 10px",
    backgroundColor: "#FDFCFA",
    cursor:          "pointer",
    outline:         "none",
    boxSizing:       "border-box" as const,
  },
  pillRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "6px",
  },
  pill: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "12px",
    border:       "1px solid",
    borderRadius: "20px",
    padding:      "4px 12px",
    cursor:       "pointer",
    transition:   "all 0.15s ease",
    lineHeight:   1.5,
  },
  checkRow: {
    display:    "flex",
    alignItems: "center",
    gap:        "8px",
    marginBottom: "8px",
    cursor:     "pointer",
  },
  checkbox: {
    width:       "14px",
    height:      "14px",
    cursor:      "pointer",
    flexShrink:  0,
    accentColor: "#2E3A5C",
  },
  checkLabel: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#2E3A5C",
    lineHeight: 1.4,
  },
  clearBtn: {
    width:           "100%",
    marginTop:       "8px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    fontWeight:      500,
    color:           "#6B6B80",
    backgroundColor: "#F8F9FA",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "9px 0",
    cursor:          "pointer",
    transition:      "all 0.15s ease",
  },
};
