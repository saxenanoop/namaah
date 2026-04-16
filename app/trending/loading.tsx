import "@/app/skeleton.css";

export default function TrendingLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section style={s.hero}>
        <div className="skeleton" style={{ width: 100, height: 11, marginBottom: 14 }} />
        <div className="skeleton" style={{ width: "55%", height: 38, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: "40%", height: 14 }} />
      </section>

      {/* Tab bar skeleton */}
      <div style={s.tabs}>
        {[1,2,3].map((i) => (
          <div key={i} className="skeleton" style={{ width: 120, height: 38, borderRadius: 20 }} />
        ))}
      </div>

      {/* Name grid skeleton */}
      <section style={s.gridSection}>
        <div style={s.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={s.card}>
              <div className="skeleton" style={{ width: "70%", height: 22, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: "40%", height: 12, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: "90%", height: 11, marginBottom: 4 }} />
              <div className="skeleton" style={{ width: "75%", height: 11, marginBottom: 12 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 20 }} />
                <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 20 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: {
    padding: "40px 48px",
    backgroundColor: "#FDF4EE",
  },
  tabs: {
    display: "flex",
    gap: 10,
    padding: "16px 48px",
    borderBottom: "1px solid #E8ECF5",
  },
  gridSection: {
    padding: "32px 48px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #E8ECF5",
    borderRadius: 12,
    padding: 16,
  },
};
