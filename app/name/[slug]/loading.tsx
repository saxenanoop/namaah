import "@/app/skeleton.css";

// Name detail page skeleton — hero + 4 section placeholders
export default function NameDetailLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <header
        style={{
          backgroundColor: "#FDF4EE",
          padding: "40px 48px",
          borderBottom: "1px solid #EEE4DA",
        }}
      >
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
          <div className="skeleton" style={{ width: 36, height: 10 }} />
          <div className="skeleton" style={{ width: 8, height: 10 }} />
          <div className="skeleton" style={{ width: 40, height: 10 }} />
          <div className="skeleton" style={{ width: 8, height: 10 }} />
          <div className="skeleton" style={{ width: 80, height: 10 }} />
        </div>

        {/* Name heading */}
        <div className="skeleton" style={{ width: "45%", height: 56, marginBottom: 12, borderRadius: 8 }} />
        {/* Devanagari */}
        <div className="skeleton" style={{ width: 140, height: 20, marginBottom: 20 }} />

        {/* Badge row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[70, 80, 90].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 24, borderRadius: 20 }} />
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <div className="skeleton" style={{ width: 160, height: 44, borderRadius: 10 }} />
          <div className="skeleton" style={{ width: 180, height: 44, borderRadius: 10 }} />
        </div>
      </header>

      {/* Details grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 32,
          padding: "40px 48px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Left column — 4 section blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {["Meaning", "Origin & Etymology", "Deity Connection", "Celebrity Connection"].map((_, i) => (
            <div key={i} style={{ paddingBottom: 32, borderBottom: "1px solid #F0F2F8" }}>
              <div className="skeleton" style={{ width: 130, height: 18, marginBottom: 14 }} />
              <div className="skeleton" style={{ width: "95%", height: 13, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: "85%", height: 13, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: "70%", height: 13 }} />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Astro card */}
          <div style={{ backgroundColor: "#2E3A5C", borderRadius: 16, padding: 24 }}>
            <div className="skeleton-dark" style={{ width: 140, height: 10, marginBottom: 20 }} />
            <div className="skeleton-dark" style={{ width: "60%", height: 28, marginBottom: 16 }} />
            <div style={{ height: 1, backgroundColor: "#3E4F72", margin: "16px 0" }} />
            <div style={{ display: "flex", gap: 24 }}>
              <div className="skeleton-dark" style={{ width: 80, height: 22 }} />
              <div className="skeleton-dark" style={{ width: 80, height: 22 }} />
            </div>
          </div>

          {/* Popularity meter */}
          <div style={{ backgroundColor: "#FDFCFA", border: "1px solid #E8ECF5", borderRadius: 12, padding: 20 }}>
            <div className="skeleton" style={{ width: 130, height: 10, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: "100%", height: 6, borderRadius: 3, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 110, height: 11, marginLeft: "auto" }} />
          </div>

          {/* Surname test */}
          <div style={{ border: "1px solid #E8ECF5", borderRadius: 12, padding: 20 }}>
            <div className="skeleton" style={{ width: 160, height: 14, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: "100%", height: 44, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </main>
  );
}
