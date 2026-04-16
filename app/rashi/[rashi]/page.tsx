import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RASHI_LIST, RASHI_BY_ID, getNakshatrasByRashi } from "@/data/nakshatra";
import { names } from "@/data/names";
import NameCard from "@/components/names/NameCard";

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return RASHI_LIST.map((r) => ({ rashi: r.id }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { rashi: string };
}): Promise<Metadata> {
  const rashi = RASHI_BY_ID[params.rashi];
  if (!rashi) return { title: "Rashi not found | Namaah" };

  const letters = rashi.startLetters.slice(0, 6).join(", ");
  return {
    title:       `${rashi.name} Rashi baby names — Hindu names for ${rashi.name} zodiac | Namaah`,
    description: `Best Hindu baby names for ${rashi.name} Rashi. Find auspicious names starting with ${letters} for babies born under ${rashi.name} moon sign.`,
    keywords:    `${rashi.name} rashi baby names, ${rashi.name} rashi naam, names for ${rashi.name} moon sign, ${rashi.nameHindi} rashi names`,
    openGraph: {
      title:       `${rashi.name} Rashi — Hindu baby names | Namaah`,
      description: `Auspicious baby names for ${rashi.name} (${rashi.nameHindi}) moon sign.`,
      type:        "website",
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ELEMENT_META: Record<string, { icon: string; bg: string; color: string; border: string }> = {
  Fire:  { icon: "🔥", bg: "#FEF3E8", color: "#C8601A", border: "#F0C896" },
  Earth: { icon: "🌿", bg: "#EEF6E8", color: "#5A8A3C", border: "#B8D4A8" },
  Air:   { icon: "💨", bg: "#E8EEF8", color: "#4A6AAA", border: "#B0C4E8" },
  Water: { icon: "💧", bg: "#E8F3F8", color: "#3A7A9C", border: "#A8D4E4" },
};

function buildSeoText(rashiName: string, rashiHindi: string, letters: string[], planet: string): string {
  const letterStr = letters.slice(0, 5).join(", ");
  return `Choosing a name aligned with your baby's ${rashiName} Rashi is one of the most auspicious traditions in Hindu Naamkaran (naming ceremony). Babies born under the ${rashiName} moon sign (${rashiHindi}) carry the unique cosmic energy of this Rashi — ruled by ${planet} — and a name that begins with the correct namaakshara (birth syllable) is believed to harmonise the child's mind and destiny. The most recommended starting syllables for ${rashiName} Rashi baby names are: ${letterStr}. Whether you prefer traditional Sanskrit names, modern names that still feel rooted in culture, or names connected to the guardian deities of ${rashiName}, Namaah offers a curated selection to match your family's taste. Parents searching for "${rashiName} rashi baby names" often discover that the ancient Vedic system produces names of remarkable beauty and depth — names that sound equally at home in a prayer and on a school roll call. Our ${rashiName} rashi naam collection spans boy names, girl names, and unisex names, each verified against classical Vedic texts. Use the auspicious letters above as a guide, explore the names below, and if you want a fully personalised result, try our free Nakshatra calculator — which uses your baby's exact birth date to identify the ideal starting syllable for names for ${rashiName} moon sign.`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RashiDetailPage({
  params,
}: {
  params: { rashi: string };
}) {
  const rashi = RASHI_BY_ID[params.rashi];
  if (!rashi) notFound();

  const el         = ELEMENT_META[rashi.element] ?? ELEMENT_META.Fire;
  const nakshatras = getNakshatrasByRashi(rashi.id);

  // Filter names: match rashi name (case-insensitive, handles "A / B" multi-rashi)
  const rashiNames = names.filter((n) =>
    n.rashi.toLowerCase().includes(rashi.name.toLowerCase())
  );

  // Sort: trending first, then classic, then rare
  const sortedNames = [
    ...rashiNames.filter((n) => n.popularity === "trending"),
    ...rashiNames.filter((n) => n.popularity === "classic"),
    ...rashiNames.filter((n) => n.popularity === "rare"),
  ];

  const seoText = buildSeoText(
    rashi.name,
    rashi.nameHindi,
    rashi.startLetters,
    rashi.rulingPlanet,
  );

  // Prev / next Rashi for navigation
  const idx      = RASHI_LIST.findIndex((r) => r.id === rashi.id);
  const prevRashi = RASHI_LIST[idx - 1];
  const nextRashi = RASHI_LIST[idx + 1];

  return (
    <article>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header style={s.hero} className="rashi-hero">
        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="Breadcrumb">
          <Link href="/"      style={s.breadLink}>Home</Link>
          <span style={s.sep}>/</span>
          <Link href="/rashi" style={s.breadLink}>Rashis</Link>
          <span style={s.sep}>/</span>
          <span style={s.breadCurrent}>{rashi.name}</span>
        </nav>

        {/* Element badge */}
        <span style={{ ...s.elBadge, backgroundColor: el.bg, color: el.color, borderColor: el.border }}>
          {el.icon} {rashi.element} sign
        </span>

        {/* Name */}
        <h1 style={s.rashiTitle} className="rashi-detail-title">{rashi.name} Rashi</h1>
        <p  style={s.rashiHindi}>{rashi.nameHindi}</p>

        {/* Metadata pills */}
        <div style={s.metaRow}>
          <span style={s.pill}>🪐 Ruling planet: <strong>{rashi.rulingPlanet}</strong></span>
          <span style={s.pill}>♊ Western sign: <strong>{rashi.westernSign}</strong></span>
          <span style={s.pill}>🔢 Zodiac #: <strong>{idx + 1} of 12</strong></span>
        </div>

        {/* Description */}
        <p style={s.heroDesc}>{rashi.description}</p>

        {/* Auspicious letters */}
        <div style={s.lettersSection}>
          <p style={s.lettersLabel}>Auspicious starting letters</p>
          <div style={s.lettersRow}>
            {rashi.startLetters.map((l) => (
              <span key={l} style={s.letterChip}>{l}</span>
            ))}
          </div>
        </div>

        {/* Nakshatras */}
        {nakshatras.length > 0 && (
          <div style={s.nakshatraRow}>
            <p style={s.lettersLabel}>Nakshatras in this Rashi</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginTop: "8px" }}>
              {nakshatras.map((n) => (
                <span key={n.id} style={s.nakChip}>
                  {n.name} · {n.nameHindi}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Names grid ───────────────────────────────────────────────────── */}
      <section style={s.gridSection} className="rashi-grid-section" aria-label={`Baby names for ${rashi.name} Rashi`}>
        <div style={s.gridHeader}>
          <h2 style={s.gridTitle}>
            {sortedNames.length > 0
              ? `${sortedNames.length} baby name${sortedNames.length !== 1 ? "s" : ""} for ${rashi.name} Rashi`
              : `Baby names for ${rashi.name} Rashi`}
          </h2>
          {sortedNames.length === 0 && (
            <p style={s.noNames}>
              Our database is growing. Try{" "}
              <Link href={`/search?rashi=${rashi.name}`} style={s.searchLink}>
                searching for {rashi.name} in the full name search →
              </Link>
            </p>
          )}
        </div>

        {sortedNames.length > 0 && (
          <div style={s.nameGrid} className="rashi-name-grid">
            {sortedNames.map((n) => (
              <NameCard key={n.id} name={n} />
            ))}
          </div>
        )}

        {/* Search more link */}
        <div style={s.searchMoreWrap}>
          <Link href={`/search?rashi=${rashi.name}`} style={s.searchMoreBtn}>
            Search all names for {rashi.name} →
          </Link>
        </div>
      </section>

      {/* ── SEO text ─────────────────────────────────────────────────────── */}
      <section style={s.seoSection} className="rashi-section-body" aria-label="About this Rashi">
        <div style={s.seoInner}>
          <h2 style={s.seoTitle}>
            {rashi.name} Rashi baby names — a Vedic guide
          </h2>
          <p style={s.seoPara}>{seoText}</p>
        </div>
      </section>

      {/* ── Nakshatra CTA ────────────────────────────────────────────────── */}
      <section style={s.ctaSection} className="rashi-cta-section" aria-label="Nakshatra calculator">
        <div style={s.ctaCard} className="rashi-cta-card">
          <div>
            <p style={s.ctaEyebrow}>Need more precision?</p>
            <h2 style={s.ctaTitle}>Find names by your exact birth star</h2>
            <p style={s.ctaDesc}>
              Rashi gives the moon sign — but for the most auspicious namaakshara,
              your baby&apos;s exact Nakshatra (one of 27 birth stars) matters most.
              Our free calculator works it out from the date of birth.
            </p>
          </div>
          <Link href="/nakshatra" style={s.ctaBtn}>
            Open Nakshatra calculator →
          </Link>
        </div>
      </section>

      {/* ── Prev / Next navigation ───────────────────────────────────────── */}
      <nav style={s.prevNext} className="rashi-prev-next" aria-label="Browse other Rashis">
        <div style={s.prevNextInner} className="rashi-prev-next-inner">
          {prevRashi ? (
            <Link href={`/rashi/${prevRashi.id}`} style={s.navCard}>
              <span style={s.navDir}>← Previous Rashi</span>
              <span style={s.navName}>{prevRashi.name}</span>
              <span style={s.navHindi}>{prevRashi.nameHindi}</span>
            </Link>
          ) : <div />}

          <Link href="/rashi" style={s.navAll}>All 12 Rashis</Link>

          {nextRashi ? (
            <Link href={`/rashi/${nextRashi.id}`} style={{ ...s.navCard, textAlign: "right" as const }}>
              <span style={s.navDir}>Next Rashi →</span>
              <span style={s.navName}>{nextRashi.name}</span>
              <span style={s.navHindi}>{nextRashi.nameHindi}</span>
            </Link>
          ) : <div />}
        </div>
      </nav>
    </article>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Hero
  hero: {
    backgroundColor: "#FDF4EE",
    padding:         "40px 48px 36px",
    borderBottom:    "1px solid #EEE4DA",
  },
  breadcrumb: {
    display:      "flex",
    alignItems:   "center",
    gap:          "6px",
    marginBottom: "20px",
  },
  breadLink: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "12px",
    color:          "#6B6B80",
    textDecoration: "none",
  },
  sep: { color: "#C8C8D4", fontSize: "12px" },
  breadCurrent: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#2E3A5C",
    fontWeight: 500,
  },
  elBadge: {
    display:      "inline-flex",
    alignItems:   "center",
    gap:          "4px",
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "11px",
    fontWeight:   500,
    padding:      "4px 12px",
    borderRadius: "20px",
    border:       "1px solid",
    marginBottom: "14px",
    letterSpacing: "0.03em",
  },
  rashiTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "48px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 6px",
    lineHeight:  1.1,
  },
  rashiHindi: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "20px",
    fontWeight:   300,
    color:        "#9898A8",
    margin:       "0 0 16px",
  },
  metaRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "8px",
    marginBottom: "16px",
  },
  pill: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    color:           "#4A4A6A",
    backgroundColor: "rgba(46,58,92,0.06)",
    borderRadius:    "20px",
    padding:         "5px 14px",
  },
  heroDesc: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "14px",
    color:       "#5A5A78",
    lineHeight:  1.7,
    margin:      "0 0 20px",
    maxWidth:    "620px",
  },
  lettersSection: { marginBottom: "16px" },
  lettersLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.08em",
    color:         "#9898A8",
    textTransform: "uppercase" as const,
    margin:        "0 0 10px",
  },
  lettersRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "8px",
  },
  letterChip: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "14px",
    fontWeight:      600,
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
    borderRadius:    "8px",
    padding:         "6px 14px",
    letterSpacing:   "0.02em",
  },
  nakshatraRow: { marginTop: "16px" },
  nakChip: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "5px 12px",
    color:           "#4A5A82",
  },

  // Grid section
  gridSection: {
    padding: "40px 48px 32px",
  },
  gridHeader: {
    marginBottom: "24px",
  },
  gridTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "24px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      0,
  },
  noNames: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#9898A8",
    marginTop:  "12px",
  },
  searchLink: {
    color:          "#C8601A",
    textDecoration: "none",
  },
  nameGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "14px",
  },
  searchMoreWrap: {
    display:        "flex",
    justifyContent: "center",
    marginTop:      "32px",
  },
  searchMoreBtn: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#C8601A",
    border:          "1px solid #C8601A",
    borderRadius:    "8px",
    padding:         "10px 24px",
    textDecoration:  "none",
    transition:      "all 0.15s ease",
  },

  // SEO section
  seoSection: {
    padding:         "40px 48px",
    backgroundColor: "#F8F8F6",
    borderTop:       "1px solid #E8ECF5",
  },
  seoInner: { maxWidth: "720px" },
  seoTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 16px",
  },
  seoPara: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#6B6B80",
    lineHeight: 1.75,
    margin:     0,
  },

  // CTA section
  ctaSection: {
    padding:   "0 48px 48px",
    marginTop: "8px",
  },
  ctaCard: {
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "space-between",
    gap:             "32px",
    flexWrap:        "wrap" as const,
    backgroundColor: "#2E3A5C",
    borderRadius:    "16px",
    padding:         "28px 32px",
    color:           "#ffffff",
  },
  ctaEyebrow: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.1em",
    color:         "rgba(255,255,255,0.55)",
    textTransform: "uppercase" as const,
    margin:        "0 0 8px",
  },
  ctaTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "24px",
    fontWeight:  600,
    color:       "#ffffff",
    margin:      "0 0 8px",
    lineHeight:  1.2,
  },
  ctaDesc: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "rgba(255,255,255,0.65)",
    lineHeight: 1.6,
    margin:     0,
    maxWidth:   "480px",
  },
  ctaBtn: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#2E3A5C",
    backgroundColor: "#E8A87C",
    border:          "none",
    borderRadius:    "10px",
    padding:         "12px 24px",
    textDecoration:  "none",
    whiteSpace:      "nowrap" as const,
    flexShrink:      0,
  },

  // Prev / Next
  prevNext: {
    borderTop:  "1px solid #E8ECF5",
    padding:    "24px 48px",
  },
  prevNextInner: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    gap:            "12px",
  },
  navCard: {
    display:        "flex",
    flexDirection:  "column" as const,
    gap:            "3px",
    textDecoration: "none",
  },
  navDir: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    color:         "#9898A8",
    letterSpacing: "0.05em",
  },
  navName: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "20px",
    fontWeight:  600,
    color:       "#2E3A5C",
    lineHeight:  1.1,
  },
  navHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#9898A8",
  },
  navAll: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    fontWeight:      500,
    color:           "#C8601A",
    textDecoration:  "none",
    border:          "1px solid #C8601A",
    borderRadius:    "6px",
    padding:         "6px 16px",
    whiteSpace:      "nowrap" as const,
  },
};
