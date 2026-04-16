import "@/app/skeleton.css";

// Generic homepage skeleton — shows hero + card placeholders
export default function HomeLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section style={s.hero}>
        <div className="skeleton" style={{ width: 160, height: 11, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: "80%", height: 40, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: "60%", height: 40, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: "85%", height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: "70%", height: 14, marginBottom: 28 }} />
        {/* Search bar */}
        <div className="skeleton" style={{ maxWidth: 560, height: 52, borderRadius: 12, marginBottom: 16 }} />
        {/* Pills */}
        <div style={s.pillsRow}>
          {[80, 70, 100, 90, 110, 80, 100, 90].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 30, borderRadius: 20 }} />
          ))}
        </div>
        <div className="skeleton" style={{ width: 280, height: 44, borderRadius: 10, marginTop: 20 }} />
      </section>

      {/* Trending strip skeleton */}
      <section style={s.trendingSection}>
        <div style={s.stripHeader}>
          <div>
            <div className="skeleton" style={{ width: 160, height: 20, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 220, height: 12 }} />
          </div>
        </div>
        <div style={s.cardRow}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="skeleton" style={{ width: 150, height: 120, borderRadius: 12, flexShrink: 0 }} />
          ))}
        </div>
      </section>

      {/* Theme grid skeleton */}
      <section style={s.themeSection}>
        <div className="skeleton" style={{ width: 140, height: 22, marginBottom: 24 }} />
        <div style={s.themeGrid}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />
          ))}
        </div>
      </section>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: {
    padding: "56px 48px 48px",
    backgroundColor: "#FDF4EE",
  },
  pillsRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  trendingSection: {
    padding: "40px 48px",
    backgroundColor: "#ffffff",
  },
  stripHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  cardRow: {
    display: "flex",
    gap: 14,
    overflow: "hidden",
  },
  themeSection: {
    padding: "40px 48px 48px",
    backgroundColor: "#ffffff",
  },
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 14,
  },
};
