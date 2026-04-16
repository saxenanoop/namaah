import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import NameCard from "@/components/names/NameCard";
import ShortlistButton from "@/components/names/ShortlistButton";
import SurnameTest from "@/components/names/SurnameTest";

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return names.map((n) => ({ slug: n.slug }));
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const name = names.find((n) => n.slug === params.slug);
  if (!name) return { title: "Name not found | Namaah" };

  return {
    title:       `${name.name} meaning — Hindu baby name | Namaah`,
    description: `Meaning of ${name.name} (Hindi: ${name.nameHindi}): ${name.meaning}. Learn about Nakshatra ${name.nakshatra}, Rashi ${name.rashi}, origin and significance of this Hindu name.`,
    keywords:    `${name.name}, ${name.name} meaning, Hindu baby name, ${name.nakshatra} nakshatra name, ${name.rashi} rashi name`,
    openGraph: {
      title:       `${name.name} — Hindu Baby Name | Namaah`,
      description: `${name.meaning}. Nakshatra: ${name.nakshatra}. Rashi: ${name.rashi}.`,
      type:        "website",
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GENDER_LABEL: Record<BabyName["gender"], string> = {
  boy: "Boy", girl: "Girl", unisex: "Unisex",
};
const GENDER_STYLE: Record<BabyName["gender"], { bg: string; color: string }> = {
  boy:    { bg: "#E8ECF5", color: "#2E3A5C" },
  girl:   { bg: "#FDE8F0", color: "#C85A8A" },
  unisex: { bg: "#F3E8FE", color: "#7B5EA7" },
};
const THEME_LABEL: Record<BabyName["theme"], string> = {
  deity: "Deity", nature: "Nature", virtue: "Virtue",
  mythological: "Mythological", modern: "Modern", vedic: "Vedic",
};
const REGION_LABEL: Record<BabyName["region"], string> = {
  north: "North India", south: "South India", west: "West India",
  east: "East India", "pan-india": "Pan India",
};
const POP_CONFIG: Record<
  BabyName["popularity"],
  { pct: number; barColor: string; text: string }
> = {
  trending: { pct: 85, barColor: "#C8601A", text: "Trending — top searched names this year" },
  classic:  { pct: 60, barColor: "#B8860B", text: "Classic — timeless, steady popularity" },
  rare:     { pct: 25, barColor: "#2E3A5C", text: "Rare gem — unique, less than 1% of parents choose this" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NameDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const name = names.find((n) => n.slug === params.slug);
  if (!name) notFound();

  const similar = names
    .filter((n) => n.slug !== name.slug && (n.theme === name.theme || n.rashi === name.rashi))
    .slice(0, 6);

  const pop    = POP_CONFIG[name.popularity];
  const gStyle = GENDER_STYLE[name.gender];

  return (
    <article>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header style={s.hero}>
        <div style={s.heroInner}>

          {/* Breadcrumb */}
          <nav style={s.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" style={s.breadcrumbLink}>Home</Link>
            <span style={s.breadcrumbSep}>/</span>
            <Link href="/search" style={s.breadcrumbLink}>Names</Link>
            <span style={s.breadcrumbSep}>/</span>
            <span style={s.breadcrumbCurrent}>{name.name}</span>
          </nav>

          {/* Name */}
          <h1 style={s.nameHeading}>{name.name}</h1>
          <p  style={s.devanagari}>{name.nameHindi}</p>

          {/* Badges */}
          <div style={s.badgeRow}>
            <span style={{ ...s.badge, backgroundColor: gStyle.bg, color: gStyle.color }}>
              {GENDER_LABEL[name.gender]}
            </span>
            <span style={{ ...s.badge, backgroundColor: "#FFF8E7", color: "#B8860B" }}>
              {THEME_LABEL[name.theme]}
            </span>
            <span style={{ ...s.badge, backgroundColor: "#E8ECF5", color: "#4A5A82" }}>
              {REGION_LABEL[name.region]}
            </span>
          </div>

          {/* Shortlist CTA */}
          <div style={{ marginTop: "20px" }}>
            <ShortlistButton slug={name.slug} name={name.name} />
          </div>
        </div>
      </header>

      {/* ── Details grid ──────────────────────────────────────────────────── */}
      <div style={s.grid}>

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <div style={s.leftCol}>

          {/* Meaning */}
          <section style={s.detailSection}>
            <h2 style={s.sectionHeading}>Meaning</h2>
            <p style={s.bodyText}>{name.meaningFull}</p>
          </section>

          {/* Origin */}
          <section style={s.detailSection}>
            <h2 style={s.sectionHeading}>Origin &amp; Etymology</h2>
            <p style={s.bodyText}>
              <strong style={{ color: "#2E3A5C" }}>{name.origin}</strong>
              {" — "}
              {originNote(name)}
            </p>
          </section>

          {/* Deity (conditional) */}
          {name.deity && (
            <section style={s.detailSection}>
              <h2 style={s.sectionHeading}>Deity Connection</h2>
              <div style={s.deityBox}>
                <span style={s.deityIcon}>🪔</span>
                <div>
                  <p style={s.deityName}>{name.deity}</p>
                  <p style={s.deityNote}>
                    This name carries the sacred energy and blessings of {name.deity}.
                    Choosing it is considered an act of devotion and an invocation of
                    divine grace for the child.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Celebrity (conditional) */}
          {name.celebrityConnection && (
            <section style={s.detailSection}>
              <h2 style={s.sectionHeading}>Celebrity Connection</h2>
              <div style={s.celebBox}>
                <span style={s.celebIcon}>⭐</span>
                <p style={s.celebText}>{name.celebrityConnection}</p>
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <div style={s.rightCol}>

          {/* Astrological card */}
          <div style={s.astroCard}>
            <p style={s.astroTopLabel}>Astrological Profile</p>

            <div style={s.astroRow}>
              <div style={s.astroBlock}>
                <span style={s.astroLabel}>Nakshatra</span>
                <span style={s.astroValue}>{name.nakshatra}</span>
              </div>
            </div>

            <div style={s.astroDivider} />

            <div style={s.astroRow}>
              <div style={s.astroBlock}>
                <span style={s.astroLabel}>Rashi</span>
                <span style={s.astroValue}>
                  {name.rashi}{" "}
                  <span style={s.rashiHindi}>{name.rashiHindi}</span>
                </span>
              </div>
              <div style={s.astroBlock}>
                <span style={s.astroLabel}>Numerology</span>
                <span style={{ ...s.astroValue, fontSize: "28px" }}>
                  {name.numerologyNumber}
                </span>
              </div>
            </div>

            <div style={s.astroDivider} />

            <p style={s.astroNote}>
              Names that match your baby&apos;s Nakshatra are believed to bring
              harmony and positive energy.
            </p>

            <Link href="/nakshatra" style={s.astroLink}>
              Find names by birth star →
            </Link>
          </div>

          {/* Popularity meter */}
          <div style={s.popSection}>
            <p style={s.popLabel}>POPULARITY STATUS</p>
            <p style={s.popText}>{pop.text}</p>

            <div style={s.popTrack}>
              <div
                style={{
                  ...s.popBar,
                  width:           `${pop.pct}%`,
                  backgroundColor: pop.barColor,
                }}
              />
            </div>
            <div style={s.popPctRow}>
              <span style={s.popPctLabel}>{pop.pct}% popularity index</span>
            </div>

            {/* Trending warning */}
            {name.popularity === "trending" && (
              <div style={s.popWarning}>
                <span style={s.popWarnIcon}>⚠️</span>
                <p style={s.popWarnText}>
                  <strong>Popularity note:</strong> This name is currently very
                  popular. You may find multiple children with this name in the
                  same classroom.
                </p>
              </div>
            )}
          </div>

          {/* Surname test */}
          <SurnameTest name={name.name} />
        </div>
      </div>

      {/* ── Similar names ─────────────────────────────────────────────────── */}
      {similar.length > 0 && (
        <section style={s.similarSection}>
          <div style={s.similarHeader}>
            <h2 style={s.similarHeading}>You might also like</h2>
            <Link href={`/search?theme=${name.theme}`} style={s.seeAll}>
              More {THEME_LABEL[name.theme]} names →
            </Link>
          </div>
          <div style={s.similarGrid}>
            {similar.map((n) => (
              <NameCard key={n.id} name={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// ─── Origin note helper ───────────────────────────────────────────────────────

function originNote(name: BabyName): string {
  const base = `This name has its roots in the ${name.origin} language and tradition.`;
  if (name.origin.toLowerCase().includes("sanskrit"))
    return `${base} Sanskrit is the classical language of Hindu scriptures, and names derived from it carry centuries of spiritual and literary heritage.`;
  if (name.origin.toLowerCase().includes("tamil"))
    return `${base} Tamil is one of the world's oldest classical languages, and names from this tradition carry deep Dravidian cultural pride.`;
  return `${base} It has been used across generations in Indian households, remaining meaningful through time.`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: "#FDF4EE",
    padding:         "40px 48px",
    borderBottom:    "1px solid #EEE4DA",
  },
  heroInner: {
    maxWidth: "860px",
  },
  breadcrumb: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
    marginBottom: "20px",
  },
  breadcrumbLink: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    color:          "#6B6B80",
    textDecoration: "none",
  },
  breadcrumbSep: {
    color:    "#C8C8D4",
    fontSize: "12px",
  },
  breadcrumbCurrent: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#2E3A5C",
    fontWeight: 500,
  },
  nameHeading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "52px",
    fontWeight:  600,
    color:       "#2E3A5C",
    lineHeight:  1.1,
    margin:      "0 0 8px",
  },
  devanagari: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "20px",
    fontWeight:  300,
    color:       "#6B6B80",
    margin:      "0 0 18px",
    lineHeight:  1.4,
  },
  badgeRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "8px",
  },
  badge: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "11px",
    fontWeight:   500,
    padding:      "4px 12px",
    borderRadius: "20px",
    letterSpacing: "0.03em",
  },

  // ── Details grid ──────────────────────────────────────────────────────────
  grid: {
    display:             "grid",
    gridTemplateColumns: "1fr 380px",
    gap:                 "32px",
    padding:             "40px 48px",
    maxWidth:            "1280px",
    margin:              "0 auto",
    boxSizing:           "border-box" as const,
  },

  // Left col
  leftCol: {},
  detailSection: {
    marginBottom:  "32px",
    paddingBottom: "32px",
    borderBottom:  "1px solid #F0F2F8",
  },
  sectionHeading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "20px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 12px",
    lineHeight:  1.3,
  },
  bodyText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "15px",
    color:      "#3A3A5C",
    lineHeight: 1.7,
    margin:     0,
  },

  // Deity box
  deityBox: {
    display:         "flex",
    gap:             "14px",
    alignItems:      "flex-start",
    backgroundColor: "#FFF8E7",
    borderRadius:    "10px",
    padding:         "16px",
    border:          "1px solid #F0D88A",
  },
  deityIcon: { fontSize: "22px", flexShrink: 0, marginTop: "2px" },
  deityName: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "18px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 6px",
  },
  deityNote: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#6B6B80",
    margin:     0,
    lineHeight: 1.55,
  },

  // Celebrity box
  celebBox: {
    display:         "flex",
    gap:             "12px",
    alignItems:      "flex-start",
    backgroundColor: "#FFF8E7",
    borderRadius:    "10px",
    padding:         "16px",
    border:          "1px solid #F0D88A",
  },
  celebIcon: { fontSize: "18px", flexShrink: 0, marginTop: "2px" },
  celebText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#4A3A10",
    margin:     0,
    lineHeight: 1.6,
  },

  // Right col
  rightCol: {},

  // Astrological card
  astroCard: {
    backgroundColor: "#2E3A5C",
    borderRadius:    "16px",
    padding:         "24px",
    color:           "#ffffff",
    marginBottom:    "24px",
  },
  astroTopLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "10px",
    fontWeight:    500,
    letterSpacing: "0.12em",
    color:         "#8895B5",
    margin:        "0 0 16px",
    textTransform: "uppercase" as const,
  },
  astroRow: {
    display: "flex",
    gap:     "24px",
  },
  astroBlock: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "4px",
    flex:          1,
  },
  astroLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    400,
    color:         "#8895B5",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  astroValue: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "22px",
    fontWeight: 600,
    color:      "#ffffff",
    lineHeight: 1.2,
  },
  rashiHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    fontWeight: 300,
    color:      "#8895B5",
    marginLeft: "6px",
  },
  astroDivider: {
    height:          "1px",
    backgroundColor: "#3E4F72",
    margin:          "16px 0",
  },
  astroNote: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#8895B5",
    lineHeight: 1.6,
    margin:     "0 0 12px",
  },
  astroLink: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    fontWeight:     500,
    color:          "#E8A87C",
    textDecoration: "none",
  },

  // Popularity meter
  popSection: {
    padding:         "20px",
    backgroundColor: "#FDFCFA",
    borderRadius:    "12px",
    border:          "1px solid #E8ECF5",
    marginBottom:    "0",
  },
  popLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.08em",
    color:         "#9898A8",
    margin:        "0 0 8px",
  },
  popText: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "13px",
    fontWeight:  500,
    color:       "#2E3A5C",
    margin:      "0 0 12px",
    lineHeight:  1.4,
  },
  popTrack: {
    height:          "6px",
    backgroundColor: "#E8ECF5",
    borderRadius:    "3px",
    overflow:        "hidden",
    marginBottom:    "6px",
  },
  popBar: {
    height:       "100%",
    borderRadius: "3px",
    transition:   "width 0.6s ease",
  },
  popPctRow: {
    display:        "flex",
    justifyContent: "flex-end",
    marginBottom:   "12px",
  },
  popPctLabel: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#9898A8",
  },
  popWarning: {
    display:         "flex",
    gap:             "8px",
    alignItems:      "flex-start",
    backgroundColor: "#FEF3E2",
    border:          "1px solid #F0C896",
    borderRadius:    "8px",
    padding:         "10px 12px",
    marginTop:       "4px",
  },
  popWarnIcon: { fontSize: "14px", flexShrink: 0, marginTop: "1px" },
  popWarnText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#7A4A10",
    margin:     0,
    lineHeight: 1.5,
  },

  // Similar names
  similarSection: {
    padding:      "0 48px 56px",
    borderTop:    "1px solid #F0F2F8",
    paddingTop:   "40px",
    maxWidth:     "1280px",
    margin:       "0 auto",
    boxSizing:    "border-box" as const,
  },
  similarHeader: {
    display:        "flex",
    alignItems:     "baseline",
    justifyContent: "space-between",
    marginBottom:   "24px",
    gap:            "12px",
  },
  similarHeading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      0,
  },
  seeAll: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    fontWeight:     500,
    color:          "#C8601A",
    textDecoration: "none",
    whiteSpace:     "nowrap" as const,
    borderBottom:   "1px solid #C8601A",
    paddingBottom:  "1px",
  },
  similarGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "14px",
  },
};
