import "@/app/skeleton.css";

export default function NakshatraLoading() {
  return (
    <div style={s.page}>
      {/* Heading skeleton */}
      <section style={s.heading}>
        <div className="skeleton-dark" style={{ width: 200, height: 16, marginBottom: 12 }} />
        <div className="skeleton-dark" style={{ width: "70%", height: 32, marginBottom: 12 }} />
        <div className="skeleton-dark" style={{ width: "50%", height: 14 }} />
      </section>

      {/* Form skeleton */}
      <section style={s.form}>
        <div style={s.formGrid}>
          {["Date of birth", "Time of birth", "City of birth"].map((label) => (
            <div key={label} style={s.field}>
              <div className="skeleton-dark" style={{ width: 100, height: 10, marginBottom: 8 }} />
              <div className="skeleton-dark" style={{ width: "100%", height: 42, borderRadius: 8 }} />
            </div>
          ))}
          <div style={s.field}>
            <div style={{ height: 18, marginBottom: 8 }} />
            <div className="skeleton-dark" style={{ width: "100%", height: 42, borderRadius: 8 }} />
          </div>
        </div>
      </section>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#2E3A5C",
  },
  heading: {
    padding: "48px 48px 32px",
  },
  form: {
    padding: "0 48px 40px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    gap: 14,
    alignItems: "end",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
  },
};
