"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import type { BabyName } from "@/data/names";

// ─────────────────────────────────────────────────────────────────────────────
// useShortlist — localStorage-backed shortlist hook
// Dispatches "namaah:shortlist-updated" so Navbar badge stays in sync.
// ─────────────────────────────────────────────────────────────────────────────

const SHORTLIST_KEY = "namaah-shortlist";

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("namaah:shortlist-updated"));
}

export function useShortlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSlugs(readSlugs());
    const sync = () => setSlugs(readSlugs());
    window.addEventListener("namaah:shortlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("namaah:shortlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    const current = readSlugs();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeSlugs(next);
    setSlugs(next);
  }, []);

  const add = useCallback((slug: string) => {
    const current = readSlugs();
    if (!current.includes(slug)) {
      const next = [...current, slug];
      writeSlugs(next);
      setSlugs(next);
    }
  }, []);

  const remove = useCallback((slug: string) => {
    const next = readSlugs().filter((s) => s !== slug);
    writeSlugs(next);
    setSlugs(next);
  }, []);

  const count = slugs.length;

  return { slugs, isSaved, toggle, add, remove, count };
}

// ─────────────────────────────────────────────────────────────────────────────
// NameCard component
// ─────────────────────────────────────────────────────────────────────────────

interface NameCardProps {
  name: BabyName;
  compact?: boolean;
}

const NameCard = memo(function NameCard({ name, compact = false }: NameCardProps) {
  const router = useRouter();
  const { isSaved, toggle } = useShortlist();
  const [hovered, setHovered] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const saved = isSaved(name.slug);

  function handleCardClick(e: React.MouseEvent) {
    // Don't navigate if the heart button was clicked
    const target = e.target as HTMLElement;
    if (target.closest("[data-heart]")) return;
    router.push(`/name/${name.slug}`);
  }

  function handleHeartClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggle(name.slug);
    // Micro-animation pop
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 300);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/name/${name.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        ...(compact ? styles.cardCompact : {}),
        borderColor: hovered ? "#C8601A" : "#E8ECF5",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 6px 20px rgba(200,96,26,0.10)"
          : "0 1px 4px rgba(46,58,92,0.05)",
      }}
      aria-label={`View details for ${name.name}`}
    >
      {/* ── Top row: name + heart ─────────────────────────────────────── */}
      <div style={styles.topRow}>
        <div style={styles.nameBlock}>
          <h3
            style={{
              ...styles.nameText,
              fontSize: compact ? "20px" : "24px",
            }}
          >
            {name.name}
          </h3>
          <span style={styles.nameHindi}>{name.nameHindi}</span>
        </div>

        {/* Heart / save button */}
        <button
          data-heart="true"
          onClick={handleHeartClick}
          style={{
            ...styles.heartBtn,
            color: saved ? "#C8601A" : "#C0C0CC",
            transform: heartPop ? "scale(1.35)" : "scale(1)",
          }}
          aria-label={saved ? `Remove ${name.name} from shortlist` : `Save ${name.name} to shortlist`}
          aria-pressed={saved}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      {/* ── Meaning ───────────────────────────────────────────────────── */}
      <p style={styles.meaning}>{name.meaning}</p>

      {/* ── Bottom row: popularity badge + gender pill ────────────────── */}
      <div style={styles.bottomRow}>
        <PopularityBadge popularity={name.popularity} />
        {!compact && <GenderPill gender={name.gender} />}
      </div>
    </div>
  );
});

export default NameCard;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PopularityBadge({ popularity }: { popularity: BabyName["popularity"] }) {
  const map: Record<
    BabyName["popularity"],
    { label: string; bg: string; color: string }
  > = {
    trending: { label: "Trending",  bg: "#FEE8E2", color: "#C8601A" },
    classic:  { label: "Classic",   bg: "#FFF8E7", color: "#B8860B" },
    rare:     { label: "Rare gem",  bg: "#E8ECF5", color: "#2E3A5C" },
  };
  const { label, bg, color } = map[popularity];
  return (
    <span style={{ ...styles.badge, backgroundColor: bg, color }}>
      {label}
    </span>
  );
}

function GenderPill({ gender }: { gender: BabyName["gender"] }) {
  const map: Record<
    BabyName["gender"],
    { label: string; bg: string; color: string }
  > = {
    boy:    { label: "Boy",    bg: "#E8F0FE", color: "#2B5CBF" },
    girl:   { label: "Girl",   bg: "#FDE8F0", color: "#BF2B6E" },
    unisex: { label: "Unisex", bg: "#F0E8FE", color: "#6B2BBF" },
  };
  const { label, bg, color } = map[gender];
  return (
    <span style={{ ...styles.badge, backgroundColor: bg, color }}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    position:        "relative",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "12px",
    padding:         "16px 14px",
    minWidth:        "148px",
    cursor:          "pointer",
    transition:      "border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
    display:         "flex",
    flexDirection:   "column",
    outline:         "none",
    userSelect:      "none",
  },
  cardCompact: {
    maxWidth: "160px",
  },

  // Top row
  topRow: {
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    gap:            "4px",
    marginBottom:   "6px",
  },
  nameBlock: {
    display:       "flex",
    flexDirection: "column",
    gap:           "2px",
    minWidth:      0,
  },
  nameText: {
    fontFamily:   "var(--font-display), 'Cormorant Garamond', serif",
    fontWeight:   600,
    color:        "#2E3A5C",
    margin:       0,
    lineHeight:   1.15,
    whiteSpace:   "nowrap",
    overflow:     "hidden",
    textOverflow: "ellipsis",
  },
  nameHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#6B6B80",
    lineHeight: 1.4,
  },

  // Heart button
  heartBtn: {
    background:  "none",
    border:      "none",
    cursor:      "pointer",
    fontSize:    "18px",
    lineHeight:  1,
    padding:     "0 0 0 4px",
    flexShrink:  0,
    transition:  "color 0.15s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
  },

  // Meaning
  meaning: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    color:       "#6B6B80",
    margin:      "0 0 10px",
    lineHeight:  1.4,
    flexGrow:    1,
  },

  // Bottom row
  bottomRow: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
    flexWrap:   "wrap",
    marginTop:  "auto",
  },

  // Shared badge / pill style
  badge: {
    fontFamily:   "var(--font-body), 'DM Sans', sans-serif",
    fontSize:     "10px",
    fontWeight:   500,
    borderRadius: "20px",
    padding:      "2px 8px",
    lineHeight:   1.6,
    whiteSpace:   "nowrap",
    letterSpacing: "0.02em",
  },
};
