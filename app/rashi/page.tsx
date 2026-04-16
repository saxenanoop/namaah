import type { Metadata } from "next";
import Link from "next/link";
import { RASHI_LIST } from "@/data/nakshatra";

// ─── SEO ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "Hindu baby names by Rashi (Moon sign) — All 12 Rashis | Namaah",
  description: "Browse Hindu baby names organised by Rashi (Vedic moon sign). Find auspicious names for all 12 Rashis: Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya, Tula, Vrischika, Dhanu, Makara, Kumbha, and Meena.",
  keywords:    "Hindu baby names by rashi, rashi baby names, moon sign names India, vedic zodiac baby names",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ELEMENT_META: Record<string, { icon: string; color: string; bg: string }> = {
  Fire:  { icon: "🔥", color: "#C8601A", bg: "#FEF3E8" },
  Earth: { icon: "🌿", color: "#5A8A3C", bg: "#EEF6E8" },
  Air:   { icon: "💨", color: "#4A6AAA", bg: "#E8EEF8" },
  Water: { icon: "💧", color: "#3A7A9C", bg: "#E8F3F8" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RashiIndexPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={s.hero} className="rashi-hero">
        <p style={s.eyebrow}>Vedic Astrology · Moon Sign Names</p>
        <h1 style={s.heroTitle} className="rashi-hero-title">
          Find names by your baby&apos;s{" "}
          <em style={{ color: "#C8601A", fontStyle: "italic" }}>Rashi</em>
        </h1>
        <p style={s.heroSub}>
          In Vedic tradition, a child&apos;s Rashi (moon sign at birth) determines the
          auspicious syllables — called <em>namaaksharas</em> — for their name. Browse
          all 12 Rashis below, or{" "}
          <Link href="/nakshatra" style={s.heroLink}>
            use our birth-star calculator →
          </Link>
        </p>
      </section>

      {/* ── Rashi grid ───────────────────────────────────────────────────── */}
      <section style={s.gridSection} className="rashi-grid-section" aria-label="All 12 Rashis">
        <div style={s.rashiGrid} className="rashi-card-grid">
          {RASHI_LIST.map((rashi) => {
            const el = ELEMENT_META[rashi.element] ?? ELEMENT_META.Fire;
            return (
              <Link
                key={rashi.id}
                href={`/rashi/${rashi.id}`}
                style={s.card}
                aria-label={`${rashi.name} Rashi baby names`}
              >
                {/* Element badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ ...s.elementBadge, backgroundColor: el.bg, color: el.color }}>
                    {el.icon} {rashi.element}
                  </span>
                  <span style={s.number}>#{RASHI_LIST.indexOf(rashi) + 1}</span>
                </div>

                {/* Rashi name */}
                <h2 style={s.rashiName}>{rashi.name}</h2>
                <p style={s.rashiHindi}>{rashi.nameHindi}</p>

                {/* Western sign */}
                <p style={s.westernSign}>{rashi.westernSign}</p>

                {/* Planet + letters */}
                <div style={s.cardMeta}>
                  <span style={s.metaItem}>🪐 {rashi.rulingPlanet}</span>
                </div>

                {/* Start letters preview */}
                <div style={s.lettersRow}>
                  {rashi.startLetters.slice(0, 5).map((l) => (
                    <span key={l} style={s.letterPill}>{l}</span>
                  ))}
                  {rashi.startLetters.length > 5 && (
                    <span style={s.morePill}>+{rashi.startLetters.length - 5}</span>
                  )}
                </div>

                <span style={s.cta}>View names →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Info strip ───────────────────────────────────────────────────── */}
      <section style={s.infoStrip}>
        <div style={s.infoInner}>
          <h2 style={s.infoTitle}>What is a Rashi?</h2>
          <p style={s.infoText}>
            In Vedic astrology, <strong>Rashi</strong> is the zodiac sign occupied by the
            Moon at the time of birth. Unlike Western astrology which uses the Sun sign,
            Vedic tradition places the Moon sign at the center of a person&apos;s astrological
            identity. The Moon sign governs the mind, emotions, and instincts — making it
            particularly meaningful for naming a child. The Naamkaran (naming ceremony) in
            Hindu tradition traditionally involves a Jyotishi who identifies the Rashi and
            prescribes the correct <em>namaakshara</em> (starting syllable) for the name. Use
            our{" "}
            <Link href="/nakshatra" style={s.infoLink}>
              Nakshatra calculator
            </Link>{" "}
            to find the right syllables for your baby&apos;s birth star.
          </p>
        </div>
      </section>
    </main>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  hero: {
    backgroundColor: "#FDF4EE",
    padding:         "48px 48px 36px",
    borderBottom:    "1px solid #EEE4DA",
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
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "40px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 12px",
    lineHeight:  1.15,
  },
  heroSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#6B6B80",
    margin:     0,
    lineHeight: 1.65,
    maxWidth:   "580px",
  },
  heroLink: {
    color:          "#C8601A",
    textDecoration: "none",
    fontWeight:     500,
    borderBottom:   "1px solid #C8601A",
  },

  // Grid
  gridSection: {
    padding: "40px 48px 48px",
  },
  rashiGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap:                 "16px",
  },
  card: {
    display:         "flex",
    flexDirection:   "column" as const,
    gap:             "8px",
    padding:         "20px",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "14px",
    textDecoration:  "none",
    cursor:          "pointer",
    transition:      "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.15s ease",
  },
  elementBadge: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "10px",
    fontWeight:   500,
    padding:      "3px 10px",
    borderRadius: "20px",
    letterSpacing: "0.03em",
  },
  number: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#C8C8D4",
  },
  rashiName: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "24px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "2px 0 0",
    lineHeight:  1.1,
  },
  rashiHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    fontWeight: 300,
    color:      "#9898A8",
    margin:     0,
  },
  westernSign: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "11px",
    color:       "#C8C8D4",
    margin:      "0 0 4px",
    fontStyle:   "italic",
  },
  cardMeta: {
    display: "flex",
    gap:     "8px",
  },
  metaItem: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#6B6B80",
  },
  lettersRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "5px",
    marginTop: "4px",
  },
  letterPill: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "11px",
    fontWeight:      500,
    backgroundColor: "#F0F2F8",
    color:           "#4A5A82",
    borderRadius:    "6px",
    padding:         "2px 8px",
  },
  morePill: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "11px",
    color:           "#9898A8",
    backgroundColor: "#F8F8FC",
    borderRadius:    "6px",
    padding:         "2px 8px",
  },
  cta: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    fontWeight:  500,
    color:       "#C8601A",
    marginTop:   "auto",
    paddingTop:  "8px",
  },

  // Info strip
  infoStrip: {
    backgroundColor: "#F8F8F6",
    borderTop:       "1px solid #E8ECF5",
    padding:         "40px 48px",
  },
  infoInner: {
    maxWidth: "680px",
  },
  infoTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 12px",
  },
  infoText: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#6B6B80",
    lineHeight: 1.75,
    margin:     0,
  },
  infoLink: {
    color:          "#C8601A",
    textDecoration: "none",
    fontWeight:     500,
  },
};
