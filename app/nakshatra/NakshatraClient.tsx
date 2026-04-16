"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import type { Nakshatra } from "@/data/nakshatra";
import {
  getNakshatraObjectFromDate,
  getNamesByNakshatra,
} from "@/data/nakshatra";

// ─── State ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "loading" | "results";

interface FormState {
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  city: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NakshatraClient() {
  const [form, setForm] = useState<FormState>({ date: "", time: "", city: "" });
  const [phase, setPhase] = useState<Phase>("idle");
  const [nakshatra, setNakshatra] = useState<Nakshatra | null>(null);
  const [activeSyllable, setActiveSyllable] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Filtered names from the Nakshatra + optional syllable filter
  const matchedNames = useMemo<BabyName[]>(() => {
    if (!nakshatra) return [];
    const byNakshatra = getNamesByNakshatra(nakshatra.name, names);
    if (!activeSyllable) return byNakshatra;
    const syl = activeSyllable.toLowerCase();
    return byNakshatra.filter((n) => n.name.toLowerCase().startsWith(syl));
  }, [nakshatra, activeSyllable]);

  // If no exact-nakshatra matches, fall back to rashi-based
  const displayNames = useMemo<BabyName[]>(() => {
    if (!nakshatra) return [];
    if (matchedNames.length > 0) return matchedNames;
    // fallback: any name whose rashi matches
    return names.filter((n) =>
      nakshatra.rashi.toLowerCase().includes(n.rashi.toLowerCase())
    );
  }, [nakshatra, matchedNames]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate date
    if (!form.date) {
      setDateError("Please enter the date of birth");
      return;
    }
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      setDateError("Please enter a date in the past");
      return;
    }
    setDateError(null);

    setPhase("loading");
    setActiveSyllable(null);

    // Slight artificial delay so the loading state is visible
    setTimeout(() => {
      const parts = form.date.split("-").map(Number);
      const month = parts[1];
      const day   = parts[2];
      const result = getNakshatraObjectFromDate(day, month);
      setNakshatra(result ?? null);
      setPhase("results");

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 900);
  }

  return (
    <div style={s.page}>

      {/* ── Section 1: Heading ────────────────────────────────────────────── */}
      <section style={s.heading} className="nakshatra-heading-section">
        <p style={s.hindiTitle}>नक्षत्र के अनुसार नाम</p>
        <h1 style={s.mainTitle} className="nakshatra-main-title">Find names by your baby&apos;s birth star</h1>
        <p style={s.subtitle}>
          Enter your baby&apos;s birth details to discover their Nakshatra and the
          sacred syllables for their name.
        </p>
      </section>

      {/* ── Section 2: Form ───────────────────────────────────────────────── */}
      <section style={s.formSection} className="nakshatra-form-section">
        <form onSubmit={handleSubmit} style={s.formGrid} className="nakshatra-form-grid" aria-label="Birth details form">
          {/* Date */}
          <div style={s.fieldWrap}>
            <label style={s.fieldLabel} htmlFor="dob">Date of birth</label>
            <input
              id="dob"
              type="date"
              required
              value={form.date}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }));
                setDateError(null); // clear error on change
              }}
              style={{
                ...s.input,
                borderColor: dateError ? "#E05252" : "rgba(255,255,255,0.15)",
              }}
              aria-required="true"
              aria-describedby={dateError ? "dob-error" : undefined}
            />
            {dateError && (
              <span
                id="dob-error"
                role="alert"
                style={s.fieldError}
              >
                {dateError}
              </span>
            )}
          </div>

          {/* Time */}
          <div style={s.fieldWrap}>
            <label style={s.fieldLabel} htmlFor="tob">Time of birth</label>
            <input
              id="tob"
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              style={s.input}
              placeholder="As accurate as possible"
            />
          </div>

          {/* City */}
          <div style={s.fieldWrap}>
            <label style={s.fieldLabel} htmlFor="cob">City of birth</label>
            <input
              id="cob"
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              style={s.input}
              placeholder="e.g. Mumbai, Delhi"
              maxLength={60}
            />
          </div>

          {/* Submit */}
          <div style={s.fieldWrap}>
            <label style={{ ...s.fieldLabel, opacity: 0 }} aria-hidden="true">Find</label>
            <button
              type="submit"
              style={{
                ...s.submitBtn,
                opacity: form.date ? 1 : 0.5,
                cursor: form.date ? "pointer" : "not-allowed",
              }}
              disabled={!form.date || phase === "loading"}
              aria-label="Find names by Nakshatra"
            >
              {phase === "loading" ? "Calculating…" : "Find names"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Section 3: Results ───────────────────────────────────────────── */}
      {phase !== "idle" && (
        <section id="results" style={s.results} className="nakshatra-results" aria-live="polite" aria-label="Nakshatra results">
          {phase === "loading" ? (
            <div style={s.loadingWrap}>
              <span style={s.loadingDots}>Calculating birth star</span>
              <LoadingDots />
            </div>
          ) : nakshatra ? (
            <>
              {/* a) Nakshatra revealed card */}
              <div style={s.revealCard}>
                <p style={s.smallLabel}>Nakshatra detected</p>
                <h2 style={s.nakshatraName}>{nakshatra.name}</h2>
                <p style={s.nakshatraHindi}>{nakshatra.nameHindi}</p>

                <div style={s.pillRow}>
                  <span style={s.infoPill}>🪐 {nakshatra.rulingPlanet}</span>
                  <span style={s.infoPill}>♐ {nakshatra.rashi} · {nakshatra.rashiHindi}</span>
                  <span style={s.infoPill}>#{nakshatra.number} of 27</span>
                </div>

                <p style={s.nakshatraDesc}>
                  <em>{nakshatra.meaning}.</em>{" "}
                  {nakshatra.name} is presided over by <strong>{nakshatra.deity}</strong>.
                  Children born under this Nakshatra carry its cosmic energy and should
                  ideally have a name starting with one of its sacred syllables.
                </p>
              </div>

              {/* b) Syllables */}
              <div style={s.syllableSection}>
                <p style={s.smallLabel}>
                  Auspicious starting syllables for {nakshatra.name}
                </p>
                <div style={s.syllableRow}>
                  {nakshatra.syllables.map((syl) => (
                    <button
                      key={syl}
                      onClick={() =>
                        setActiveSyllable(activeSyllable === syl ? null : syl)
                      }
                      style={{
                        ...s.sylPill,
                        backgroundColor:
                          activeSyllable === syl ? "#C8601A" : "rgba(255,255,255,0.12)",
                        borderColor:
                          activeSyllable === syl ? "#C8601A" : "rgba(255,255,255,0.2)",
                      }}
                      aria-pressed={activeSyllable === syl}
                    >
                      {syl}
                    </button>
                  ))}
                  {activeSyllable && (
                    <button
                      onClick={() => setActiveSyllable(null)}
                      style={s.clearSyl}
                      aria-label="Clear syllable filter"
                    >
                      ✕ clear
                    </button>
                  )}
                </div>
              </div>

              {/* c) Name results */}
              <div style={s.nameResultsSection}>
                <p style={s.smallLabel}>
                  {displayNames.length > 0
                    ? `${displayNames.length} name${displayNames.length !== 1 ? "s" : ""} matching your baby's Nakshatra`
                    : "Names for this Nakshatra"}
                </p>

                {displayNames.length > 0 ? (
                  <div style={s.nameGrid} className="nakshatra-name-grid">
                    {displayNames.map((n) => (
                      <DarkNameCard key={n.id} name={n} />
                    ))}
                  </div>
                ) : (
                  <p style={s.noResults}>
                    No names found for this syllable — try another or{" "}
                    <button
                      style={s.clearSylInline}
                      onClick={() => setActiveSyllable(null)}
                    >
                      clear the filter
                    </button>
                    .
                  </p>
                )}
              </div>
            </>
          ) : (
            <p style={s.errorMsg}>
              Could not calculate Nakshatra. Please check the birth date and try again.
            </p>
          )}
        </section>
      )}

      {/* ── Section 4: Disclaimer ────────────────────────────────────────── */}
      <footer style={s.disclaimer} className="nakshatra-disclaimer" role="contentinfo">
        <p style={s.disclaimerText}>
          This is a simplified guide. For precise astrological calculation, the Moon&apos;s
          exact position at the time of birth is required. We recommend consulting a
          certified Jyotishi for your baby&apos;s official Naamkaran ceremony.
        </p>
      </footer>
    </div>
  );
}

// ─── Dark name card (Nakshatra page variant) ──────────────────────────────────

function DarkNameCard({ name }: { name: BabyName }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/name/${name.slug}`}
      style={{
        ...dc.card,
        backgroundColor: hovered ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.07)",
        borderColor: hovered ? "rgba(200,96,26,0.6)" : "rgba(255,255,255,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={dc.name}>{name.name}</span>
      <span style={dc.hindi}>{name.nameHindi}</span>
      <span style={dc.meaning}>{name.meaning}</span>
      <span style={dc.rashi}>{name.rashi}</span>
    </Link>
  );
}

// ─── Loading dots ─────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <span style={s.dotsWrap} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            ...s.dot,
            animationDelay: `${i * 0.22}s`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Page styles ──────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight:       "calc(100vh - 60px)",
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
  },

  // Heading section
  heading: {
    padding: "48px 48px 32px",
  },
  hindiTitle: {
    fontFamily:   "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:     "18px",
    fontWeight:   400,
    color:        "rgba(255,255,255,0.6)",
    margin:       "0 0 8px",
    letterSpacing: "0.04em",
  },
  mainTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "36px",
    fontWeight:  600,
    color:       "#ffffff",
    margin:      "0 0 14px",
    lineHeight:  1.2,
  },
  subtitle: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "rgba(255,255,255,0.7)",
    margin:     0,
    maxWidth:   "520px",
    lineHeight: 1.6,
  },

  // Form
  formSection: {
    padding: "0 48px 40px",
  },
  formGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    gap:                 "14px",
    alignItems:          "end",
  },
  fieldWrap: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "6px",
  },
  fieldLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.07em",
    color:         "rgba(255,255,255,0.6)",
    textTransform: "uppercase" as const,
  },
  fieldError: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#FF9090",
    marginTop:  "4px",
    display:    "block",
  },
  input: {
    height:          "42px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    color:           "#ffffff",
    backgroundColor: "rgba(255,255,255,0.1)",
    border:          "1px solid rgba(255,255,255,0.15)",
    borderRadius:    "8px",
    padding:         "10px 12px",
    outline:         "none",
    boxSizing:       "border-box" as const,
    transition:      "border-color 0.15s ease",
    colorScheme:     "dark" as const,
  },
  submitBtn: {
    height:          "42px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#ffffff",
    backgroundColor: "#C8601A",
    border:          "none",
    borderRadius:    "8px",
    padding:         "0 24px",
    transition:      "opacity 0.15s ease, transform 0.12s ease",
    whiteSpace:      "nowrap" as const,
    letterSpacing:   "0.02em",
  },

  // Results
  results: {
    padding: "0 48px 48px",
  },
  loadingWrap: {
    padding:        "48px 0",
    display:        "flex",
    alignItems:     "center",
    gap:            "12px",
  },
  loadingDots: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "16px",
    color:      "rgba(255,255,255,0.7)",
  },
  dotsWrap: {
    display:    "inline-flex",
    gap:        "5px",
    alignItems: "center",
  },
  dot: {
    display:         "inline-block",
    width:           "7px",
    height:          "7px",
    borderRadius:    "50%",
    backgroundColor: "#C8601A",
    animation:       "nakshatra-pulse 1s ease-in-out infinite",
  },

  // Nakshatra revealed card
  revealCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    border:          "1px solid rgba(255,255,255,0.12)",
    borderRadius:    "16px",
    padding:         "28px 28px 24px",
    marginBottom:    "24px",
  },
  smallLabel: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.1em",
    color:         "rgba(255,255,255,0.55)",
    textTransform: "uppercase" as const,
    margin:        "0 0 10px",
  },
  nakshatraName: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "38px",
    fontWeight:  600,
    color:       "#ffffff",
    margin:      "0 0 4px",
    lineHeight:  1.1,
  },
  nakshatraHindi: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "16px",
    fontWeight:  300,
    color:       "rgba(255,255,255,0.65)",
    margin:      "0 0 16px",
  },
  pillRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "8px",
    marginBottom: "16px",
  },
  infoPill: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    color:           "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0.1)",
    border:          "1px solid rgba(255,255,255,0.15)",
    borderRadius:    "20px",
    padding:         "4px 12px",
  },
  nakshatraDesc: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "13px",
    color:       "rgba(255,255,255,0.65)",
    lineHeight:  1.65,
    margin:      0,
  },

  // Syllables
  syllableSection: {
    marginBottom: "28px",
  },
  syllableRow: {
    display:  "flex",
    flexWrap: "wrap" as const,
    gap:      "8px",
    marginTop: "10px",
  },
  sylPill: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "14px",
    fontWeight:   500,
    color:        "#ffffff",
    border:       "1px solid",
    borderRadius: "8px",
    padding:      "8px 16px",
    cursor:       "pointer",
    transition:   "background-color 0.15s ease, border-color 0.15s ease",
    letterSpacing: "0.02em",
  },
  clearSyl: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "12px",
    color:           "rgba(255,255,255,0.5)",
    background:      "none",
    border:          "none",
    cursor:          "pointer",
    alignSelf:       "center" as const,
    padding:         "4px 8px",
  },

  // Name results
  nameResultsSection: {
    marginTop: "4px",
  },
  nameGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))",
    gap:                 "12px",
    marginTop:           "12px",
  },
  noResults: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "rgba(255,255,255,0.55)",
    marginTop:  "16px",
  },
  clearSylInline: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "14px",
    color:       "#E8A87C",
    background:  "none",
    border:      "none",
    cursor:      "pointer",
    padding:     0,
    textDecoration: "underline",
  },
  errorMsg: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "rgba(255,255,255,0.5)",
    padding:    "40px 0",
  },

  // Disclaimer
  disclaimer: {
    padding:         "24px 48px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderTop:       "1px solid rgba(255,255,255,0.08)",
  },
  disclaimerText: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    fontStyle:   "italic",
    color:       "rgba(255,255,255,0.45)",
    textAlign:   "center" as const,
    margin:      0,
    maxWidth:    "720px",
    marginLeft:  "auto",
    marginRight: "auto",
    lineHeight:  1.7,
  },
};

// ─── Dark card styles ─────────────────────────────────────────────────────────

const dc: Record<string, React.CSSProperties> = {
  card: {
    display:        "flex",
    flexDirection:  "column" as const,
    gap:            "4px",
    padding:        "14px 12px",
    borderRadius:   "10px",
    border:         "1px solid",
    textDecoration: "none",
    cursor:         "pointer",
    transition:     "background-color 0.15s ease, border-color 0.15s ease",
  },
  name: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "22px",
    fontWeight: 600,
    color:      "#ffffff",
    lineHeight: 1.1,
  },
  hindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    fontWeight: 300,
    color:      "rgba(255,255,255,0.45)",
    marginBottom: "4px",
  },
  meaning: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "rgba(255,255,255,0.58)",
    lineHeight: 1.4,
    flexGrow:   1,
  },
  rashi: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "10px",
    fontWeight:  500,
    color:       "#E8A87C",
    marginTop:   "6px",
    letterSpacing: "0.04em",
  },
};
