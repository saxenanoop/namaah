"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import NameCard from "@/components/names/NameCard";
import BackToTop from "@/components/ui/BackToTop";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Tab = "all" | "trending" | "classic" | "rare";

const SORTED_NAMES = [
  ...names.filter((n) => n.popularity === "trending"),
  ...names.filter((n) => n.popularity === "classic"),
  ...names.filter((n) => n.popularity === "rare"),
];

const CELEBRITY_NAMES = names.filter((n) => n.celebrityConnection !== "");

const REGIONS: { id: BabyName["region"]; label: string; slug: string }[] = [
  { id: "north",     label: "North India",  slug: "north" },
  { id: "south",     label: "South India",  slug: "south" },
  { id: "west",      label: "West India",   slug: "west" },
  { id: "pan-india", label: "Pan India",    slug: "pan-india" },
];

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "all",      label: "All names",  emoji: "✦" },
  { id: "trending", label: "Trending",   emoji: "🔥" },
  { id: "classic",  label: "Classic",    emoji: "⭐" },
  { id: "rare",     label: "Rare gems",  emoji: "💎" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrendingClient() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const visibleNames = useMemo(() => {
    if (activeTab === "all") return SORTED_NAMES;
    return SORTED_NAMES.filter((n) => n.popularity === activeTab);
  }, [activeTab]);

  return (
    <main>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section style={s.hero} className="trending-hero" aria-label="Page header">
        <div style={s.heroInner}>
          {/* Eyebrow */}
          <p style={s.eyebrow}>2026 Edition</p>

          <h1 style={s.heroTitle}>What&apos;s trending in 2026</h1>
          <p style={s.heroSub}>
            Based on searches, saves, and naming data across India
          </p>

          {/* Quick stats */}
          <div style={s.statsRow}>
            <Stat value={`${names.filter((n) => n.popularity === "trending").length}`}  label="Trending names" />
            <Stat value={`${names.filter((n) => n.popularity === "classic").length}`}   label="Timeless classics" />
            <Stat value={`${names.filter((n) => n.popularity === "rare").length}`}      label="Rare gems" />
            <Stat value={`${CELEBRITY_NAMES.length}`} label="Celebrity picks" />
          </div>
        </div>
      </section>

      {/* ── 2. Trend tabs ─────────────────────────────────────────────────── */}
      <div style={s.tabBar} className="trending-tab-bar" role="tablist" aria-label="Filter by popularity">
        {TABS.map(({ id, label, emoji }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(id)}
              style={{
                ...s.tab,
                color:       active ? "#C8601A" : "#6B6B80",
                borderBottom: active ? "2px solid #C8601A" : "2px solid transparent",
                fontWeight:   active ? 500 : 400,
              }}
            >
              <span aria-hidden="true">{emoji}</span> {label}
            </button>
          );
        })}

        {/* Count chip */}
        <span style={s.countChip}>{visibleNames.length} names</span>
      </div>

      {/* ── 3. Name grid ──────────────────────────────────────────────────── */}
      <section style={s.gridSection} className="trending-grid-section" aria-label="Name results">
        <div style={s.nameGrid} className="trending-name-grid">
          {visibleNames.map((n) => (
            <NameCard key={n.id} name={n} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr style={s.divider} />

      {/* ── 4. Celebrity picks ───────────────────────────────────────────── */}
      <section id="celebrity" style={s.section} className="trending-section-body" aria-label="Celebrity name picks">
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Names chosen by Indian celebrities</h2>
          <p style={s.sectionSub}>
            Stars who set the naming trends across Bollywood, cricket, and beyond
          </p>
        </div>

        <div style={s.celebGrid} className="trending-celeb-grid">
          {CELEBRITY_NAMES.map((n) => (
            <CelebCard key={n.id} name={n} />
          ))}
        </div>
      </section>

      <hr style={s.divider} />

      {/* ── 5. Regional breakdown ────────────────────────────────────────── */}
      <section style={s.section} className="trending-section-body" aria-label="Regional name breakdown">
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Names by region</h2>
          <p style={s.sectionSub}>
            Explore how naming traditions vary across the subcontinent
          </p>
        </div>

        <div style={s.regionGrid} className="trending-region-grid">
          {REGIONS.map(({ id, label, slug }) => {
            const regionNames = SORTED_NAMES.filter((n) => n.region === id).slice(0, 5);
            if (regionNames.length === 0) return null;
            return (
              <RegionCard
                key={id}
                label={label}
                slug={slug}
                names={regionNames}
              />
            );
          })}
        </div>
      </section>

      {/* ── 6. SEO text ──────────────────────────────────────────────────── */}
      <section style={s.seoSection} className="trending-seo-section" aria-label="About trending names">
        <div style={s.seoInner}>
          <h2 style={s.seoTitle}>
            Trending Hindu baby names in India — 2026 guide
          </h2>
          <div style={s.seoBody}>
            <p style={seoP}>
              Choosing the perfect name for your baby is one of the most meaningful
              decisions a parent can make. In 2026, <strong>trending Hindu baby names
              in India</strong> reflect a beautiful blend of ancient Sanskrit heritage
              and modern sensibility. Names rooted in Vedic tradition — often connected
              to Nakshatra (birth star) and Rashi (moon sign) — continue to dominate
              the charts, while parents increasingly seek names that work seamlessly
              in both Indian and global contexts.
            </p>
            <p style={seoP}>
              Among <strong>trending baby names in India</strong> this year, boy
              names like Aarav, Vihaan, Reyansh, and Atharv lead the charts. These
              names draw from deep Sanskrit roots — Aarav meaning &quot;peaceful melody,&quot;
              Vihaan meaning &quot;dawn,&quot; and Atharv referencing the sacred Atharvaveda.
              For girls, Saanvi, Aadya, Ananya, and Avani top the lists, each carrying
              divine feminine energy: Saanvi as a name of Goddess Lakshmi, Aadya
              as the primordial form of Goddess Durga.
            </p>
            <p style={seoP}>
              <strong>Sanskrit names</strong> remain the gold standard for Hindu
              families seeking depth and spiritual resonance. Sanskrit is the mother
              of most Indian languages, and names from this tradition carry phonetic
              beauty, philosophical meaning, and astrological significance.
              <strong> Nakshatra names</strong> — names aligned to the 27 Vedic birth
              stars — are particularly sought after, as Vedic astrology holds that a
              name starting with the correct Nakshatra syllable brings harmony and
              positive energy to the child&apos;s life.
            </p>
            <p style={seoP}>
              Classic names like Kabir, Arjun, Mira, and Tara show that timeless
              appeal never fades. Meanwhile, rare gems like Advait and Chandrakala
              are gaining traction among parents who want uniqueness without
              sacrificing cultural depth. Whether you are looking for a trending name
              that will feel contemporary in 2026, or a classic that will age
              beautifully, Namaah curates the finest Hindu baby names to help you
              find the one that feels right — for your child, your family, and your
              stars.
            </p>
          </div>
        </div>
      </section>

      <BackToTop />
    </main>
  );
}

// ─── Celebrity card ───────────────────────────────────────────────────────────

function CelebCard({ name }: { name: BabyName }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/name/${name.slug}`}
      style={{
        ...cc.card,
        borderColor:  hovered ? "#C8601A" : "#E8ECF5",
        boxShadow:    hovered ? "0 4px 16px rgba(200,96,26,0.1)" : "0 1px 4px rgba(46,58,92,0.05)",
        transform:    hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cc.top}>
        <span style={cc.name}>{name.name}</span>
        <span style={cc.hindi}>{name.nameHindi}</span>
      </div>
      <p style={cc.meaning}>{name.meaning}</p>
      <div style={cc.celebBox}>
        <span style={cc.starIcon} aria-hidden="true">⭐</span>
        <p style={cc.celebText}>{name.celebrityConnection}</p>
      </div>
    </Link>
  );
}

// ─── Region card ──────────────────────────────────────────────────────────────

function RegionCard({
  label,
  slug,
  names: regionNames,
}: {
  label: string;
  slug: string;
  names: BabyName[];
}) {
  return (
    <div style={rc.card}>
      <h3 style={rc.heading}>{label}</h3>
      <ol style={rc.list}>
        {regionNames.map((n, i) => (
          <li key={n.id} style={rc.item}>
            <Link href={`/name/${n.slug}`} style={{ ...rc.link, fontSize: i === 0 ? "18px" : "14px", fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "#2E3A5C" : "#4A5A82" }}>
              {n.name}
            </Link>
            {i === 0 && <span style={rc.meaning}>{n.meaning}</span>}
          </li>
        ))}
      </ol>
      <Link href={`/search?region=${slug}`} style={rc.seeAll}>
        View all {label} names →
      </Link>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={s.stat}>
      <span style={s.statValue}>{value}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  hero: {
    backgroundColor: "#FDF4EE",
    padding:         "40px 48px 36px",
    borderBottom:    "1px solid #EEE4DA",
  },
  heroInner: {
    maxWidth: "860px",
  },
  eyebrow: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.12em",
    color:         "#C8601A",
    textTransform: "uppercase" as const,
    margin:        "0 0 10px",
  },
  heroTitle: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "40px",
    fontWeight: 600,
    color:      "#2E3A5C",
    margin:     "0 0 10px",
    lineHeight: 1.15,
  },
  heroSub: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "14px",
    color:        "#6B6B80",
    margin:       "0 0 28px",
    lineHeight:   1.5,
  },
  statsRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "24px",
  },
  stat: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "2px",
  },
  statValue: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "28px",
    fontWeight: 600,
    color:      "#2E3A5C",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#9898A8",
    letterSpacing: "0.03em",
  },

  // Tabs
  tabBar: {
    display:         "flex",
    alignItems:      "center",
    gap:             "0",
    padding:         "0 48px",
    borderBottom:    "1px solid #E8ECF5",
    backgroundColor: "#ffffff",
    position:        "sticky" as const,
    top:             "60px",
    zIndex:          10,
    overflowX:       "auto" as const,
  },
  tab: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "13px",
    background:    "none",
    border:        "none",
    borderBottom:  "2px solid transparent",
    padding:       "14px 18px",
    cursor:        "pointer",
    whiteSpace:    "nowrap" as const,
    transition:    "color 0.15s ease, border-color 0.15s ease",
    display:       "flex",
    alignItems:    "center",
    gap:           "6px",
  },
  countChip: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "11px",
    color:           "#9898A8",
    backgroundColor: "#F0F2F8",
    borderRadius:    "20px",
    padding:         "3px 10px",
    marginLeft:      "auto",
    whiteSpace:      "nowrap" as const,
    flexShrink:      0,
  },

  // Grid
  gridSection: {
    padding: "32px 48px",
  },
  nameGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "14px",
  },
  divider: {
    border:          "none",
    borderTop:       "1px solid #E8ECF5",
    margin:          "0 48px",
  },

  // Shared section
  section: {
    padding: "40px 48px",
  },
  sectionHeader: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "28px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 6px",
    lineHeight:  1.2,
  },
  sectionSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#9898A8",
    margin:     0,
  },

  // Celebrity grid
  celebGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap:                 "16px",
  },

  // Region grid
  regionGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap:                 "16px",
  },

  // SEO section
  seoSection: {
    padding:         "40px 48px 56px",
    backgroundColor: "#F8F8F6",
    borderTop:       "1px solid #E8ECF5",
  },
  seoInner: {
    maxWidth: "720px",
  },
  seoTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 20px",
  },
  seoBody: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "16px",
  },
};

// ─── Celebrity card styles ────────────────────────────────────────────────────

const cc: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "12px",
    padding:         "18px 16px",
    textDecoration:  "none",
    display:         "flex",
    flexDirection:   "column" as const,
    gap:             "8px",
    transition:      "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
    cursor:          "pointer",
  },
  top: {
    display:    "flex",
    alignItems: "baseline",
    gap:        "8px",
  },
  name: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "22px",
    fontWeight: 600,
    color:      "#2E3A5C",
  },
  hindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    fontWeight: 300,
    color:      "#9898A8",
  },
  meaning: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#6B6B80",
    margin:     0,
    lineHeight: 1.4,
  },
  celebBox: {
    display:         "flex",
    gap:             "8px",
    alignItems:      "flex-start",
    backgroundColor: "#FFF8E7",
    border:          "1px solid #F0D88A",
    borderRadius:    "8px",
    padding:         "10px 12px",
    marginTop:       "4px",
  },
  starIcon: { fontSize: "13px", flexShrink: 0, marginTop: "1px" },
  celebText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#4A3A10",
    margin:     0,
    lineHeight: 1.5,
  },
};

// ─── Region card styles ───────────────────────────────────────────────────────

const rc: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "12px",
    padding:         "20px",
  },
  heading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "16px",
    fontWeight:  600,
    color:       "#C8601A",
    margin:      "0 0 14px",
    letterSpacing: "0.02em",
  },
  list: {
    listStyle:   "none",
    margin:      "0 0 16px",
    padding:     0,
    display:     "flex",
    flexDirection: "column" as const,
    gap:         "8px",
  },
  item: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "2px",
  },
  link: {
    fontFamily:     "var(--font-display), 'Cormorant Garamond', serif",
    textDecoration: "none",
    lineHeight:     1.2,
    transition:     "color 0.15s ease",
  },
  meaning: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#9898A8",
  },
  seeAll: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    fontWeight:     500,
    color:          "#C8601A",
    textDecoration: "none",
    borderBottom:   "1px solid #C8601A",
    paddingBottom:  "1px",
  },
};

// ─── SEO paragraph style ────────────────────────────────────────────────────

const seoP: React.CSSProperties = {
  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  fontSize:   "14px",
  color:      "#6B6B80",
  lineHeight: 1.75,
  margin:     0,
};
