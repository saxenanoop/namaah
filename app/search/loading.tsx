import "@/app/skeleton.css";

export default function SearchLoading() {
  return (
    <div style={s.pageWrap}>
      {/* Sidebar skeleton */}
      <aside style={s.sidebar}>
        <div style={s.sidebarInner}>
          <div className="skeleton" style={{ width: 100, height: 20, marginBottom: 24 }} />
          {[140, 120, 100, 130, 110, 120, 100].map((w, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div className="skeleton" style={{ width: 60, height: 10, marginBottom: 10 }} />
              <div className="skeleton" style={{ width: w, height: 34, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </aside>

      {/* Results area skeleton */}
      <div style={s.results}>
        {/* Top bar */}
        <div style={s.topBar}>
          <div className="skeleton" style={{ width: 100, height: 14 }} />
          <div className="skeleton" style={{ width: 110, height: 32, borderRadius: 6 }} />
        </div>
        {/* Ad placeholder */}
        <div className="skeleton" style={{ width: "100%", height: 120, borderRadius: 8, marginBottom: 24 }} />
        {/* Name cards grid */}
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
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  pageWrap: {
    display: "flex",
    alignItems: "flex-start",
    minHeight: "calc(100vh - 60px)",
    maxWidth: 1280,
    margin: "0 auto",
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    borderRight: "1px solid #E8ECF5",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#ffffff",
  },
  sidebarInner: {
    padding: 24,
  },
  results: {
    flex: 1,
    padding: 24,
    minWidth: 0,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
