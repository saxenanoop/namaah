"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import NameCard from "@/components/names/NameCard";
import AdBanner from "@/components/ui/AdBanner";

// ─────────────────────────────────────────────────────────────────────────────
// Quick-filter pill config
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_PILLS = [
  { label: "Boys",             href: "/search?gender=boy" },
  { label: "Girls",            href: "/search?gender=girl" },
  { label: "North India",      href: "/search?region=north" },
  { label: "South India",      href: "/search?region=south" },
  { label: "Sanskrit roots",   href: "/search?origin=sanskrit" },
  { label: "Short names",      href: "/search?syllables=1" },
  { label: "Nature-inspired",  href: "/search?theme=nature" },
  { label: "Mythological",     href: "/search?theme=mythological" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrendingStrip />
      {/* Ad unit — horizontal between trending and theme sections */}
      <div style={{ padding: "20px 48px", backgroundColor: "#F8F9FA" }} className="ad-section">
        <AdBanner slot="homepage-horizontal" format="horizontal" />
      </div>
      <BrowseByTheme />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [activePill, setActivePill] = useState<string | null>(null);

  return (
    <section style={styles.hero} className="hero-section" aria-label="Hero">
      {/* Decorative mandala */}
      <MandalaDecor />

      <div style={styles.heroContent}>
        {/* Tag line */}
        <p style={styles.tagLine}>Sacred names for a new generation</p>

        {/* Main heading */}
        <h1 style={styles.heading} className="hero-heading">
          Find a name rooted in{" "}
          <br />
          <em style={styles.headingAccent}>tradition,</em>{" "}
          made for
          <br />
          tomorrow.
        </h1>

        {/* Subheading */}
        <p style={styles.subheading} className="hero-subheading">
          Search 20,000+ Hindu names by meaning, Nakshatra, region, or deity —
          with trend data so you know if it&apos;s rising, classic, or rare.
        </p>

        {/* Search Bar */}
        <HeroSearchBar />

        {/* Quick filter pills */}
        <div style={styles.pillsRow} className="hero-pills-row" role="group" aria-label="Quick filters">
          {FILTER_PILLS.map((pill) => (
            <FilterPill
              key={pill.href}
              label={pill.label}
              href={pill.href}
              active={activePill === pill.href}
              onClick={() =>
                setActivePill((p) => (p === pill.href ? null : pill.href))
              }
            />
          ))}
        </div>

        {/* Nakshatra CTA */}
        <Link href="/nakshatra" style={styles.nakshatraCta} className="hero-nakshatra-cta">
          <StarIcon />
          Find names by your baby&apos;s birth star
        </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trending Strip — horizontal scroll of trending names
// ─────────────────────────────────────────────────────────────────────────────

function TrendingStrip() {
  const trending = names.filter((n) => n.popularity === "trending").slice(0, 8);
  return (
    <section style={secStyles.trendingSection} className="trending-section" aria-label="Trending names">
      <div style={secStyles.sectionHeader} className="trending-section-header">
        <div>
          <h2 style={secStyles.sectionTitle}>Trending Right Now</h2>
          <p style={secStyles.sectionSub}>Names Indian parents are loving in 2026</p>
        </div>
        <Link href="/trending" style={secStyles.seeAll}>See all trends →</Link>
      </div>
      <div style={secStyles.scrollTrack} className="trending-track">
        {trending.map((n) => (
          <div key={n.id} style={{ flexShrink: 0 }}>
            <NameCard name={n} compact />
          </div>
        ))}
      </div>
      {/* Bottom divider */}
      <div style={secStyles.stripDivider} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Browse by theme — grid of category cards
// ─────────────────────────────────────────────────────────────────────────────

const THEME_CARDS = [
  {
    id: "deity",
    icon: "✦",
    title: "Deity names",
    sub: "Krishna, Shiva, Durga and their many forms",
    href: "/search?theme=deity",
  },
  {
    id: "nature",
    icon: "◈",
    title: "Nature & earth",
    sub: "Mountains, rivers, dawn, sky, lotus",
    href: "/search?theme=nature",
  },
  {
    id: "virtue",
    icon: "◉",
    title: "Vedic virtues",
    sub: "Wisdom, peace, courage, devotion",
    href: "/search?theme=virtue",
  },
  {
    id: "mythological",
    icon: "◇",
    title: "Mythological heroes",
    sub: "Ramayana, Mahabharata characters",
    href: "/search?theme=mythological",
  },
  {
    id: "south",
    icon: "◆",
    title: "South Indian",
    sub: "Tamil, Telugu, Kannada traditions",
    href: "/search?region=south",
  },
  {
    id: "short",
    icon: "○",
    title: "Short micro-names",
    sub: "2–3 syllable global-friendly names",
    href: "/search?syllables=short",
  },
  {
    id: "celebrity",
    icon: "★",
    title: "Celebrity picks",
    sub: "Bollywood and cricket star choices",
    href: "/trending#celebrity",
  },
  {
    id: "rare",
    icon: "◍",
    title: "Royal & rare",
    sub: "Uncommon names with royal heritage",
    href: "/search?popularity=rare",
  },
];

function BrowseByTheme() {
  return (
    <section aria-label="Browse by theme">
      {/* Header — has its own padding */}
      <div style={secStyles.themeHeader} className="theme-header">
        <h2 style={secStyles.sectionTitle}>Browse by theme</h2>
      </div>
      {/* Grid — separate padding */}
      <div style={secStyles.themeGrid} className="theme-grid">
        {THEME_CARDS.map((card) => (
          <ThemeCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

function ThemeCard({
  card,
}: {
  card: (typeof THEME_CARDS)[number];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={card.href}
      style={{
        ...secStyles.themeCard,
        borderColor: hovered ? "#4A5A82" : "#E8ECF5",
        boxShadow: hovered
          ? "0 4px 16px rgba(74,90,130,0.10)"
          : "0 1px 3px rgba(46,58,92,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={secStyles.themeIcon}>{card.icon}</span>
      <span style={secStyles.themeTitle}>{card.title}</span>
      <span style={secStyles.themeSub}>{card.sub}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Search Bar — live filtering with dropdown
// ─────────────────────────────────────────────────────────────────────────────

function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BabyName[]>([]);
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter names on query change
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setOpen(false); return; }

    const filtered = names
      .filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.meaning.toLowerCase().includes(q) ||
          n.nakshatra.toLowerCase().includes(q) ||
          (n.nameHindi && n.nameHindi.includes(q))
      )
      .slice(0, 8);

    setResults(filtered);
    setOpen(filtered.length > 0);
    setFocusedIdx(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusedIdx >= 0) {
      e.preventDefault();
      router.push(`/name/${results[focusedIdx].slug}`);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} style={styles.searchWrap}>
      <form style={styles.searchBar} onSubmit={handleSubmit} role="search">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by name, meaning, or syllable…"
          style={styles.searchInput}
          aria-label="Search names"
          aria-autocomplete="list"
          autoComplete="off"
        />
        <button type="submit" style={styles.searchBtn}>
          Search
        </button>
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul style={styles.dropdown} role="listbox" aria-label="Search suggestions">
          {results.map((n, i) => (
            <li
              key={n.id}
              role="option"
              aria-selected={focusedIdx === i}
              style={{
                ...styles.dropdownItem,
                backgroundColor: focusedIdx === i ? "#FDF4EE" : "transparent",
              }}
              onMouseEnter={() => setFocusedIdx(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // keep input focused
                router.push(`/name/${n.slug}`);
                setOpen(false);
              }}
            >
              <span style={styles.dropdownName}>{n.name}</span>
              <span style={styles.dropdownHindi}>{n.nameHindi}</span>
              <span style={styles.dropdownMeaning}>{n.meaning}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Pill
// ─────────────────────────────────────────────────────────────────────────────

function FilterPill({
  label,
  href,
  active,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  onClick: () => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const isActive = active || hovered;

  return (
    <button
      onClick={() => { onClick(); router.push(href); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.pill,
        backgroundColor: isActive ? "#FDF4EE" : "#ffffff",
        borderColor:     isActive ? "#C8601A" : "#E8ECF5",
        color:           isActive ? "#C8601A" : "#6B6B80",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mandala Decorative SVG
// ─────────────────────────────────────────────────────────────────────────────

function MandalaDecor() {
  const cx = 150;
  const cy = 150;
  const color = "#2E3A5C";

  // Equilateral triangle points centred at cx,cy with radius r
  function triPoints(r: number, rotate: number): string {
    return [0, 1, 2]
      .map((i) => {
        const angle = (i * 120 + rotate) * (Math.PI / 180);
        return `${cx + r * Math.sin(angle)},${cy - r * Math.cos(angle)}`;
      })
      .join(" ");
  }

  return (
    <svg
      width={300}
      height={300}
      viewBox="0 0 300 300"
      aria-hidden="true"
      style={styles.mandala}
    >
      <g stroke={color} strokeWidth={0.5} fill="none" opacity={1}>
        {/* Concentric circles */}
        {[140, 110, 80, 50].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} />
        ))}
        {/* Cross lines */}
        <line x1={cx - 145} y1={cy} x2={cx + 145} y2={cy} />
        <line x1={cx} y1={cy - 145} x2={cx} y2={cy + 145} />
        {/* Diagonal lines */}
        <line
          x1={cx - 103} y1={cy - 103}
          x2={cx + 103} y2={cy + 103}
        />
        <line
          x1={cx + 103} y1={cy - 103}
          x2={cx - 103} y2={cy + 103}
        />
        {/* Star of David — two overlapping equilateral triangles */}
        <polygon points={triPoints(110, 0)} />
        <polygon points={triPoints(110, 180)} />
        {/* Inner petal ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = cx + 50 * Math.sin(angle);
          const y1 = cy - 50 * Math.cos(angle);
          const x2 = cx + 80 * Math.sin(angle);
          const y2 = cy - 80 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Icon (5-pointed)
// ─────────────────────────────────────────────────────────────────────────────

function StarIcon() {
  // 5-pointed star path centred in 16×16
  const cx = 8; const cy = 8;
  const outer = 7; const inner = 3;
  const points = Array.from({ length: 10 }).map((_, i) => {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? outer : inner;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <polygon points={points} suppressHydrationWarning />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    position:       "relative",
    width:          "100%",
    backgroundColor: "#FDF4EE",
    padding:        "56px 48px 48px",
    overflow:       "hidden",
  },
  heroContent: {
    position:  "relative",
    zIndex:    1,
    maxWidth:  "680px",
  },

  // Mandala
  mandala: {
    position:   "absolute",
    top:        "-20px",
    right:      "-40px",
    opacity:    0.04,
    userSelect: "none",
    pointerEvents: "none",
  },

  // ── Typography ────────────────────────────────────────────────────────────
  tagLine: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontWeight:    500,
    fontSize:      "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color:         "#C8601A",
    margin:        "0 0 18px",
  },
  heading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontWeight:  600,
    fontSize:    "48px",
    lineHeight:  1.18,
    color:       "#2E3A5C",
    margin:      "0 0 20px",
  },
  headingAccent: {
    fontStyle: "italic",
    color:     "#C8601A",
  },
  subheading: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontWeight:  300,
    fontSize:    "15px",
    color:       "#6B6B80",
    lineHeight:  1.65,
    maxWidth:    "480px",
    margin:      "0 0 28px",
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchWrap: {
    position:  "relative",
    maxWidth:  "560px",
    marginBottom: "0",
  },
  searchBar: {
    display:       "flex",
    alignItems:    "center",
    backgroundColor: "#ffffff",
    border:        "1.5px solid #E8ECF5",
    borderRadius:  "12px",
    overflow:      "hidden",
    transition:    "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  searchInput: {
    flex:        1,
    border:      "none",
    outline:     "none",
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "15px",
    color:       "#1A1A2E",
    padding:     "14px 18px",
    background:  "transparent",
    minWidth:    0,
  },
  searchBtn: {
    flexShrink:      0,
    border:          "none",
    cursor:          "pointer",
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontWeight:      500,
    fontSize:        "13px",
    padding:         "12px 22px",
    margin:          "4px",
    borderRadius:    "8px",
    transition:      "background-color 0.15s ease",
    whiteSpace:      "nowrap" as const,
  },

  // Dropdown
  dropdown: {
    position:        "absolute",
    top:             "calc(100% + 4px)",
    left:            0,
    right:           0,
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "10px",
    boxShadow:       "0 8px 24px rgba(46,58,92,0.12)",
    listStyle:       "none",
    margin:          0,
    padding:         "6px 0",
    zIndex:          100,
    overflow:        "hidden",
  },
  dropdownItem: {
    display:   "flex",
    alignItems: "center",
    gap:       "8px",
    padding:   "10px 16px",
    cursor:    "pointer",
    transition: "background-color 0.1s",
  },
  dropdownName: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "17px",
    fontWeight:  600,
    color:       "#2E3A5C",
    flexShrink:  0,
  },
  dropdownHindi: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    color:       "#9898A8",
    flexShrink:  0,
  },
  dropdownMeaning: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    color:       "#6B6B80",
    overflow:    "hidden",
    textOverflow: "ellipsis",
    whiteSpace:  "nowrap" as const,
  },

  // ── Filter pills ──────────────────────────────────────────────────────────
  pillsRow: {
    display:   "flex",
    flexWrap:  "wrap" as const,
    gap:       "8px",
    marginTop: "16px",
  },
  pill: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    padding:     "5px 14px",
    borderRadius: "20px",
    border:      "1px solid #E8ECF5",
    cursor:      "pointer",
    transition:  "all 0.15s ease",
    whiteSpace:  "nowrap" as const,
    lineHeight:  1.5,
  },

  // ── Nakshatra CTA ─────────────────────────────────────────────────────────
  nakshatraCta: {
    display:         "inline-flex",
    alignItems:      "center",
    gap:             "10px",
    marginTop:       "28px",
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
    padding:         "12px 22px",
    borderRadius:    "10px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontWeight:      500,
    fontSize:        "13px",
    textDecoration:  "none",
    transition:      "background-color 0.15s ease, transform 0.15s ease",
    letterSpacing:   "0.01em",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section styles (separate object to keep hero styles clean)
// ─────────────────────────────────────────────────────────────────────────────

const secStyles: Record<string, React.CSSProperties> = {
  // Shared section layout
  sectionHeader: {
    display:        "flex",
    alignItems:     "flex-end",
    justifyContent: "space-between",
    marginBottom:   "24px",
    flexWrap:       "wrap" as const,
    gap:            "12px",
  },
  sectionTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "24px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 4px",
    lineHeight:  1.2,
  },
  sectionSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#6B6B80",
    margin:     0,
    fontWeight: 300,
  },
  seeAll: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    fontWeight:     500,
    color:          "#C8601A",
    textDecoration: "none",
    whiteSpace:     "nowrap" as const,
    alignSelf:      "flex-end",
    paddingBottom:  "2px",
    borderBottom:   "1px solid #C8601A",
  },

  // ── Trending Strip ──────────────────────────────────────────────────────
  trendingSection: {
    padding:         "40px 48px",
    backgroundColor: "#ffffff",
  },
  stripDivider: {
    height:          "1px",
    backgroundColor: "#E8ECF5",
    margin:          "0 -48px",      // full-width bleed past section padding
    marginTop:       "12px",
  },
  scrollTrack: {
    display:       "flex",
    gap:           "14px",
    overflowX:     "auto" as const,
    paddingBottom: "8px",
  },

  // ── Browse by Theme ──────────────────────────────────────────────────────
  // ── Browse by Theme ──────────────────────────────────────────────────────
  themeHeader: {
    padding:         "40px 48px 24px",
    backgroundColor: "#ffffff",
  },
  themeGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "14px",
    padding:             "0 48px 48px",
    backgroundColor:     "#ffffff",
  },
  themeCard: {
    display:         "flex",
    flexDirection:   "column" as const,
    gap:             "6px",
    padding:         "18px 16px",
    borderRadius:    "12px",
    border:          "1px solid #E8ECF5",
    backgroundColor: "#ffffff",
    textDecoration:  "none",
    cursor:          "pointer",
    transition:      "border-color 0.18s ease, box-shadow 0.18s ease",
  },
  themeIcon: {
    fontSize:    "20px",
    lineHeight:  1,
    color:       "#4A5A82",
    marginBottom: "4px",
    fontStyle:   "normal",
  },
  themeTitle: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "16px",
    fontWeight: 600,
    color:      "#2E3A5C",
    lineHeight: 1.3,
  },
  themeSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#6B6B80",
    lineHeight: 1.45,
  },
};
