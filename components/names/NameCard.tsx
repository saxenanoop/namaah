"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import type { BabyName } from "@/data/names";
import { names } from "@/data/names";

// ─────────────────────────────────────────────────────────────────────────────
// useShortlist — localStorage-backed shortlist hook storing FULL objects
// Dispatches "namaah:shortlist-updated" so Navbar badge stays in sync.
// ─────────────────────────────────────────────────────────────────────────────

const SHORTLIST_KEY = "namaah-shortlist";

// Helper to migrate legacy arrays of slugs to full objects, or just read.
function readList(): BabyName[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Legacy migration: if the first item is a string, it's a slug array.
    if (parsed.length > 0 && typeof parsed[0] === "string") {
      const migrated = parsed
        .map((slug) => names.find((n) => n.slug === slug))
        .filter((n): n is BabyName => Boolean(n));
      return migrated;
    }
    
    // Default: it's an array of objects
    return parsed as BabyName[];
  } catch {
    return [];
  }
}

function writeList(items: BabyName[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("namaah:shortlist-updated"));
}

export function useShortlist() {
  const [items, setItems] = useState<BabyName[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(readList());
    const sync = () => setItems(readList());
    window.addEventListener("namaah:shortlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("namaah:shortlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((slug: string) => items.some((n) => n.slug === slug), [items]);

  const toggle = useCallback((name: BabyName) => {
    const current = readList();
    const exists = current.some((n) => n.slug === name.slug);
    const next = exists
      ? current.filter((n) => n.slug !== name.slug)
      : [...current, name];
    writeList(next);
    setItems(next);
  }, []);

  const add = useCallback((name: BabyName) => {
    const current = readList();
    if (!current.some((n) => n.slug === name.slug)) {
      const next = [...current, name];
      writeList(next);
      setItems(next);
    }
  }, []);

  const remove = useCallback((slug: string) => {
    const next = readList().filter((n) => n.slug !== slug);
    writeList(next);
    setItems(next);
  }, []);

  const count = items.length;

  return { items, isSaved, toggle, add, remove, count };
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
  const storyHook = name.meaningFull ? name.meaningFull.split('.')[0] + '.' : name.meaning;

  function handleCardClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    // Don't navigate if heart or hear button was clicked
    if (target.closest("button") || target.closest("a")) return;
    router.push(`/name/${name.slug}`);
  }

  function handleHeartClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    toggle(name);
    setHeartPop(true);
    setTimeout(() => setHeartPop(false), 300);
  }

  function handleHearIt(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(name.nameHindi || name.name);
      utterance.lang = "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
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
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 4px 20px rgba(200,96,26,0.08)"
          : "none",
      }}
      aria-label={`View details for ${name.name}`}
    >
      {/* LAYER 1: Header Row */}
      <div style={styles.topRow}>
        <div style={styles.nameBlock}>
          <h3 style={styles.nameText}>{name.name}</h3>
          <span style={styles.nameHindi}>{name.nameHindi}</span>
        </div>
        <div style={styles.topRightActions}>
          <PopularityBadge popularity={name.popularity} />
          <button
            onClick={handleHeartClick}
            style={{
              ...styles.heartBtn,
              color: saved ? "#C8601A" : "#C0C0CC",
              transform: heartPop ? "scale(1.35)" : "scale(1)",
            }}
            aria-label={saved ? `Remove ${name.name}` : `Save ${name.name}`}
            aria-pressed={saved}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>
      </div>

      {/* LAYER 2: Meaning Line */}
      <p style={{ ...styles.meaning, ...(compact ? styles.meaningCompact : {}) }}>
        {name.meaning}
      </p>

      {/* NON-COMPACT EXTRAS */}
      {!compact && (
        <>
          {/* LAYER 3: Story Hook */}
          {storyHook && (
            <div style={styles.storyHook}>
              &quot;{storyHook}&quot;
            </div>
          )}

          {/* LAYER 4: Meta Row */}
          <div style={styles.metaRow}>
            {name.nakshatra && <span style={styles.metaPill}>★ {name.nakshatra}</span>}
            {name.region && <span style={styles.metaPill}>📍 {REGION_LABEL[name.region] || name.region}</span>}
            {name.syllables && name.syllables > 0 && <span style={styles.metaPill}>🗣 {name.syllables} syllables</span>}
          </div>

          {/* LAYER 5: Bottom Action Row */}
          <div style={styles.actionRow}>
            <button onClick={handleHearIt} style={styles.hearBtn} aria-label={`Listen to ${name.name}`}>
              ▶ Hear it
            </button>
            <a 
              href={`/name/${name.slug}`} 
              style={styles.moreLink}
              onClick={(e) => { e.preventDefault(); router.push(`/name/${name.slug}`); }}
            >
              More →
            </a>
          </div>
        </>
      )}
    </div>
  );
});

export default NameCard;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const REGION_LABEL: Record<string, string> = {
  north: "North India",
  south: "South India",
  west: "West India",
  east: "East India",
  "pan-india": "Pan India",
};

function PopularityBadge({ popularity }: { popularity: BabyName["popularity"] }) {
  const map: Record<BabyName["popularity"], { label: string; bg: string; color: string }> = {
    trending: { label: "Trending", bg: "#FEE8E2", color: "#C8601A" },
    classic: { label: "Classic", bg: "#FFF8E7", color: "#B8860B" },
    rare: { label: "Rare gem", bg: "#E8ECF5", color: "#2E3A5C" },
  };
  const { label, bg, color } = map[popularity];
  return <span style={{ ...styles.badge, backgroundColor: bg, color }}>{label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "relative",
    backgroundColor: "#ffffff",
    border: "1px solid #E8ECF5",
    borderRadius: "14px",
    padding: "16px",
    minWidth: "200px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    outline: "none",
    userSelect: "none",
  },
  cardCompact: {
    padding: "12px 14px",
    minWidth: "160px",
    maxWidth: "200px",
  },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "4px",
  },
  nameBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  nameText: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2E3A5C",
    margin: 0,
    lineHeight: 1.15,
  },
  nameHindi: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    color: "#9898A8",
    marginTop: "2px",
  },
  topRightActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  heartBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    lineHeight: 1,
    padding: "2px",
    transition: "color 0.15s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
  },
  meaning: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#6B6B80",
    margin: "4px 0 12px 0",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  meaningCompact: {
    margin: "4px 0 0 0",
  },
  storyHook: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    fontStyle: "italic",
    color: "#9898A8",
    borderLeft: "2px solid #C8601A",
    paddingLeft: "10px",
    margin: "0 0 16px 0",
    lineHeight: 1.4,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "16px",
    marginTop: "auto",
  },
  metaPill: {
    backgroundColor: "#F4F6F9",
    color: "#2E3A5C",
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "6px",
    fontWeight: 500,
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #F0F2F8",
    paddingTop: "12px",
    marginTop: "auto",
  },
  hearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "#C8601A",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: 0,
  },
  moreLink: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "#2E3A5C",
    textDecoration: "none",
  },
  badge: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    borderRadius: "12px",
    padding: "2px 8px",
    lineHeight: 1.5,
    whiteSpace: "nowrap",
  },
};
