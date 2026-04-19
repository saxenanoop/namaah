"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { names } from "@/data/names";
import NameCard from "@/components/names/NameCard";
import AdBanner from "@/components/ui/AdBanner";
import PersonalizationFlow, { UserProfile } from "@/components/home/PersonalizationFlow";
import WelcomeBoard from "@/components/home/WelcomeBoard";

// Removed FILTER_PILLS

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("namaah-profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {}
  }, []);

  return (
    <main>
      {!mounted ? (
        <section style={{ height: "500px", backgroundColor: "#FDF4EE" }} />
      ) : profile ? (
        <WelcomeBoard profile={profile} />
      ) : (
        <PersonalizationFlow onComplete={(p) => setProfile(p)} />
      )}
      <TrendingStrip />
      {/* Ad unit — horizontal between trending and theme sections */}
      <div style={{ padding: "20px 48px", backgroundColor: "#F8F9FA" }} className="ad-section">
        <AdBanner slot="homepage-horizontal" format="horizontal" />
      </div>
      <BrowseByTheme />
    </main>
  );
}

// Previously HeroSection (Removed as part of PersonalizationFlow implementation)

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

// Previously HeroSearchBar

// Previously FilterPill, MandalaDecor, StarIcon

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

// Removed styles

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
