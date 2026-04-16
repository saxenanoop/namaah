"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import { useShortlist } from "@/components/names/NameCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SHORTLIST = 12;

const POP_BADGE: Record<
  BabyName["popularity"],
  { label: string; bg: string; color: string }
> = {
  trending: { label: "Trending", bg: "#FEE8E2", color: "#C8601A" },
  classic:  { label: "Classic",  bg: "#FFF8E7", color: "#B8860B" },
  rare:     { label: "Rare gem", bg: "#E8ECF5", color: "#2E3A5C" },
};

const GENDER_BADGE: Record<
  BabyName["gender"],
  { label: string; bg: string; color: string }
> = {
  boy:    { label: "Boy",    bg: "#E8ECF5", color: "#2E3A5C" },
  girl:   { label: "Girl",   bg: "#FDE8F0", color: "#C85A8A" },
  unisex: { label: "Unisex", bg: "#F3E8FE", color: "#7B5EA7" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShortlistClient() {
  const searchParams   = useSearchParams();
  const { slugs, remove, count } = useShortlist();

  const [toast,   setToast]   = useState(false);
  const [surname, setSurname] = useState("");
  const [mounted, setMounted] = useState(false);

  // ── URL-param share loading ────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const sharedParam = searchParams.get("names");
    if (!sharedParam) return;

    // Merge URL slugs into localStorage without exceeding MAX_SHORTLIST
    const sharedSlugs = sharedParam.split(",").filter(Boolean);
    const raw = localStorage.getItem("namaah-shortlist");
    let current: string[] = [];
    try { current = JSON.parse(raw ?? "[]"); } catch { current = []; }

    const merged = Array.from(new Set([...current, ...sharedSlugs])).slice(0, MAX_SHORTLIST);
    localStorage.setItem("namaah-shortlist", JSON.stringify(merged));
    // Let the useShortlist hook pick up the updated storage via its sync event
    window.dispatchEvent(new Event("namaah:shortlist-updated"));
  }, [searchParams]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const savedNames: BabyName[] = slugs
    .map((slug) => names.find((n) => n.slug === slug))
    .filter((n): n is BabyName => Boolean(n));

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/shortlist?names=${slugs.join(",")}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }, [slugs]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Remove all names from your shortlist?")) {
      slugs.forEach((s) => remove(s));
    }
  }, [slugs, remove]);

  // SSR safety — don't render until mounted (localStorage is client-only)
  if (!mounted) return null;

  // ─── Empty state ────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div style={e.wrap} className="shortlist-empty">
        <span style={e.icon} aria-hidden="true">♡</span>
        <h1 style={e.heading}>Your shortlist is empty</h1>
        <p style={e.sub}>
          Save names by clicking the ♡ on any name card.
          You can save up to {MAX_SHORTLIST} names.
        </p>
        <Link href="/search" style={e.cta}>Browse names →</Link>
      </div>
    );
  }

  // ─── Filled state ───────────────────────────────────────────────────────
  return (
    <main>
      {/* Toast */}
      {toast && (
        <div style={s.toast} role="status" aria-live="polite">
          ✓ Link copied to clipboard!
        </div>
      )}

      {/* ── 1. Header ────────────────────────────────────────────────────── */}
      <header style={s.header} className="shortlist-header">
        <div>
          <h1 style={s.heading} className="shortlist-heading">My shortlist</h1>
          <p style={s.subCount}>
            {count} name{count !== 1 ? "s" : ""} saved
            {count >= MAX_SHORTLIST && (
              <span style={s.maxNotice}>
                &nbsp;· Maximum {MAX_SHORTLIST} names reached. Remove a name before adding another.
              </span>
            )}
          </p>
        </div>

        <div style={s.actions} className="shortlist-actions">
          <button onClick={handleShare} style={s.actionBtn} aria-label="Share shortlist link">
            <ShareIcon /> Share shortlist
          </button>
          <button
            onClick={handleClearAll}
            style={{ ...s.actionBtn, ...s.dangerBtn }}
            aria-label="Clear all shortlisted names"
          >
            Clear all
          </button>
        </div>
      </header>

      {/* ── 2. Comparison table ──────────────────────────────────────────── */}
      <div style={s.tableWrap} className="shortlist-table-wrap">
        <div style={s.tableScroll}>
          <table style={s.table} aria-label="Shortlisted names comparison">
            <thead>
              <tr>
                {["Name", "Meaning", "Gender", "Nakshatra", "Rashi", "Region", "Popularity", ""].map(
                  (col, i) => (
                    <th key={i} style={{ ...s.th, textAlign: i === 0 ? "left" : "center" as const }}>
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {savedNames.map((n, i) => {
                const pop    = POP_BADGE[n.popularity];
                const gender = GENDER_BADGE[n.gender];
                const rowBg  = i % 2 === 0 ? "#ffffff" : "#FDFCFA";
                return (
                  <tr key={n.id} style={{ backgroundColor: rowBg }}>
                    {/* Name */}
                    <td style={{ ...s.td, minWidth: "130px" }}>
                      <Link href={`/name/${n.slug}`} style={s.nameLink}>
                        {n.name}
                      </Link>
                      <span style={s.hindiCell}>{n.nameHindi}</span>
                    </td>

                    {/* Meaning */}
                    <td style={{ ...s.td, ...s.tdCenter, maxWidth: "200px", textAlign: "left" as const }}>
                      <span style={s.meaningCell}>{n.meaning}</span>
                    </td>

                    {/* Gender */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <span style={{ ...s.badge, backgroundColor: gender.bg, color: gender.color }}>
                        {gender.label}
                      </span>
                    </td>

                    {/* Nakshatra */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <span style={s.infoCell}>{n.nakshatra}</span>
                    </td>

                    {/* Rashi */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <span style={s.infoCell}>{n.rashi}</span>
                      <span style={s.rashiHindi}>{n.rashiHindi}</span>
                    </td>

                    {/* Region */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <span style={s.infoCell}>{REGION_LABEL[n.region]}</span>
                    </td>

                    {/* Popularity */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <span style={{ ...s.badge, backgroundColor: pop.bg, color: pop.color }}>
                        {pop.label}
                      </span>
                    </td>

                    {/* Remove */}
                    <td style={{ ...s.td, ...s.tdCenter }}>
                      <button
                        onClick={() => remove(n.slug)}
                        style={s.removeBtn}
                        aria-label={`Remove ${n.name} from shortlist`}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. Surname test ──────────────────────────────────────────────── */}
      <section style={s.surnameSec} className="shortlist-surname-section" aria-label="Surname test">
        <div style={s.surnameHeader}>
          <h2 style={s.surnameTitle}>Test your surname with all your shortlisted names</h2>
          <p style={s.surnameHint}>
            Say each combination out loud — a name flows best when syllable
            stress alternates naturally.
          </p>
        </div>

        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Type your surname…"
          style={s.surnameInput}
          maxLength={40}
          aria-label="Enter your surname to preview all name combinations"
        />

        {surname.trim() && (
          <div style={s.previewList} aria-live="polite" aria-label="Name previews">
            {savedNames.map((n) => (
              <div key={n.id} style={s.previewRow}>
                <span style={s.previewName}>{n.name}</span>
                <span style={s.previewSurname}> {surname.trim()}</span>
              </div>
            ))}
          </div>
        )}

        {!surname.trim() && (
          <p style={s.surnamePlaceholderNote}>
            ← Start typing your surname to see all combinations at once
          </p>
        )}
      </section>
    </main>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const REGION_LABEL: Record<BabyName["region"], string> = {
  north:       "North India",
  south:       "South India",
  west:        "West India",
  east:        "East India",
  "pan-india": "Pan India",
};

function ShareIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      aria-hidden="true" style={{ marginRight: 5, flexShrink: 0 }}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

// ─── Empty state styles ───────────────────────────────────────────────────────

const e: Record<string, React.CSSProperties> = {
  wrap: {
    display:        "flex",
    flexDirection:  "column" as const,
    alignItems:     "center",
    justifyContent: "center",
    minHeight:      "calc(100vh - 120px)",
    padding:        "48px",
    textAlign:      "center" as const,
  },
  icon: {
    fontSize:    "64px",
    color:       "#C8601A",
    lineHeight:  1,
    marginBottom: "20px",
  },
  heading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "28px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 12px",
  },
  sub: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "14px",
    color:       "#6B6B80",
    margin:      "0 0 28px",
    maxWidth:    "400px",
    lineHeight:  1.6,
  },
  cta: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "14px",
    fontWeight:      500,
    color:           "#ffffff",
    backgroundColor: "#C8601A",
    border:          "none",
    borderRadius:    "10px",
    padding:         "11px 28px",
    textDecoration:  "none",
    cursor:          "pointer",
    display:         "inline-block",
  },
};

// ─── Filled state styles ──────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Toast
  toast: {
    position:        "fixed",
    top:             "80px",
    left:            "50%",
    transform:       "translateX(-50%)",
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    padding:         "10px 20px",
    borderRadius:    "20px",
    zIndex:          999,
    pointerEvents:   "none",
    boxShadow:       "0 4px 16px rgba(46,58,92,0.25)",
  },

  // Header
  header: {
    display:         "flex",
    alignItems:      "flex-start",
    justifyContent:  "space-between",
    flexWrap:        "wrap" as const,
    gap:             "16px",
    padding:         "32px 48px",
    borderBottom:    "1px solid #E8ECF5",
    backgroundColor: "#ffffff",
  },
  heading: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "36px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 4px",
    lineHeight:  1.1,
  },
  subCount: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "14px",
    color:      "#6B6B80",
    margin:     0,
    display:    "flex",
    alignItems: "center",
    flexWrap:   "wrap" as const,
    gap:        "6px",
  },
  maxNotice: {
    color:      "#C8601A",
    fontWeight: 500,
    fontSize:   "12px",
  },
  actions: {
    display:    "flex",
    gap:        "10px",
    alignItems: "center",
    flexShrink: 0,
  },
  actionBtn: {
    display:         "inline-flex",
    alignItems:      "center",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#2E3A5C",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    padding:         "9px 16px",
    cursor:          "pointer",
    transition:      "all 0.15s ease",
    gap:             "4px",
  },
  dangerBtn: {
    color:       "#C85A5A",
    borderColor: "#F0CACA",
  },

  // Table
  tableWrap: {
    padding: "0 48px 8px",
  },
  tableScroll: {
    overflowX: "auto" as const,
    borderRadius: "12px",
    border:       "1px solid #E8ECF5",
    marginTop:    "24px",
  },
  table: {
    width:          "100%",
    borderCollapse: "collapse" as const,
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "13px",
  },
  th: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "10px",
    fontWeight:      500,
    letterSpacing:   "0.08em",
    textTransform:   "uppercase" as const,
    color:           "#9898A8",
    padding:         "12px 14px",
    borderBottom:    "1px solid #E8ECF5",
    backgroundColor: "#FDFCFA",
    whiteSpace:      "nowrap" as const,
    textAlign:       "center" as const,
  },
  td: {
    padding:      "12px 14px",
    borderBottom: "1px solid #F0F2F8",
    verticalAlign: "middle" as const,
  },
  tdCenter: {
    textAlign: "center" as const,
  },
  nameLink: {
    fontFamily:     "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:       "20px",
    fontWeight:     600,
    color:          "#2E3A5C",
    textDecoration: "none",
    display:        "block",
    lineHeight:     1.2,
  },
  hindiCell: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#9898A8",
    display:    "block",
    marginTop:  "2px",
  },
  meaningCell: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#4A4A6A",
    lineHeight: 1.45,
  },
  infoCell: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    color:       "#2E3A5C",
    fontWeight:  400,
    display:     "block",
  },
  rashiHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "10px",
    color:      "#9898A8",
    display:    "block",
    marginTop:  "2px",
  },
  badge: {
    display:      "inline-block",
    fontSize:     "11px",
    fontWeight:   500,
    padding:      "3px 10px",
    borderRadius: "20px",
  },
  removeBtn: {
    background:  "none",
    border:      "none",
    fontSize:    "14px",
    color:       "#C8C8D4",
    cursor:      "pointer",
    padding:     "4px 8px",
    borderRadius: "4px",
    transition:  "color 0.15s ease",
    lineHeight:  1,
  },

  // Surname test
  surnameSec: {
    padding:         "32px 48px 48px",
    backgroundColor: "#FDF4EE",
    borderTop:       "1px solid #EEE4DA",
    marginTop:       "24px",
  },
  surnameHeader: {
    marginBottom: "20px",
  },
  surnameTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "22px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 6px",
    lineHeight:  1.3,
  },
  surnameHint: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#9898A8",
    margin:     0,
    lineHeight: 1.5,
  },
  surnameInput: {
    display:         "block",
    width:           "min(400px, 100%)",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "15px",
    color:           "#1A1A2E",
    border:          "1px solid #E8D4C4",
    borderRadius:    "10px",
    padding:         "12px 16px",
    outline:         "none",
    backgroundColor: "#ffffff",
    boxSizing:       "border-box" as const,
    marginBottom:    "24px",
    transition:      "border-color 0.15s ease",
  },
  previewList: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "6px",
  },
  previewRow: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "30px",
    fontWeight:  600,
    lineHeight:  1.2,
    color:       "#2E3A5C",
  },
  previewName: {
    color: "#2E3A5C",
  },
  previewSurname: {
    color: "#C8601A",
  },
  surnamePlaceholderNote: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "13px",
    color:       "#C8D0E0",
    fontStyle:   "italic",
    margin:      0,
  },
};
