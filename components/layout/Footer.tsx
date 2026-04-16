import Link from "next/link";

// ─── Footer link data ─────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { label: "About",           href: "/about" },
  { label: "Nakshatra Guide", href: "/nakshatra" },
  { label: "Rashi Guide",     href: "/rashi" },
  { label: "Blog",            href: "/blog" },
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Contact",         href: "/contact" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer>
      {/* ── Main Footer body ─────────────────────────────────────────────── */}
      <div style={styles.body}>
        <div style={styles.inner} className="footer-inner">

          {/* Left column */}
          <div style={styles.left}>
            <span style={styles.logo}>Namaah</span>
            <p style={styles.tagline}>
              Every name is a blessing — choose with love.
            </p>
            <p style={styles.copyright}>
              © 2026 Namaah.in — Sacred names for a new generation
            </p>
          </div>

          {/* Right column — link row */}
          <nav style={styles.right} aria-label="Footer navigation">
            {FOOTER_LINKS.map((link, i) => (
              <span key={link.href} style={styles.linkGroup}>
                <Link href={link.href} style={styles.link} className="footer-link">
                  {link.label}
                </Link>
                {i < FOOTER_LINKS.length - 1 && (
                  <span style={styles.divider} aria-hidden="true">|</span>
                )}
              </span>
            ))}
            {/* Hindi page link — visually separated */}
            <span style={{ ...styles.linkGroup, marginLeft: "8px" }}>
              <span style={styles.divider} aria-hidden="true">|</span>
              <Link href="/hindi" style={{ ...styles.link, color: "#C8601A", fontWeight: 500 }} lang="hi">
                हिंदी में देखें
              </Link>
            </span>
          </nav>

        </div>
      </div>

      {/* ── Disclaimer strip ─────────────────────────────────────────────── */}
      <div style={styles.disclaimer} className="footer-disclaimer">
        <p style={styles.disclaimerText}>
          Namaah is not a substitute for a Jyotishi. For precise astrological
          naming, please consult a certified Vedic astrologer.
        </p>
      </div>
    </footer>
  );
}

// ─── Inline Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  // Main body
  body: {
    backgroundColor: "#ffffff",
    borderTop:       "1px solid #E8ECF5",
    padding:         "32px 48px",
  },
  inner: {
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    flexWrap:       "wrap",
    gap:            "24px",
    maxWidth:       "1280px",
    margin:         "0 auto",
  },

  // Left column
  left: {
    display:       "flex",
    flexDirection: "column",
    gap:           "6px",
  },
  logo: {
    fontFamily:    "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:      "20px",
    fontWeight:    600,
    color:         "#C8601A",
    lineHeight:    1.2,
    letterSpacing: "0.01em",
  },
  tagline: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#6B6B80",
    margin:     0,
    lineHeight: 1.5,
  },
  copyright: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "11px",
    color:      "#9898A8",
    margin:     "4px 0 0",
    lineHeight: 1.5,
  },

  // Right column
  right: {
    display:    "flex",
    flexWrap:   "wrap",
    alignItems: "center",
    gap:        "2px",
    marginTop:  "4px",
  },
  linkGroup: {
    display:    "flex",
    alignItems: "center",
    gap:        "2px",
  },
  link: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "11px",
    color:          "#6B6B80",
    textDecoration: "none",
    padding:        "2px 6px",
    borderRadius:   "3px",
    transition:     "color 0.15s ease",
    whiteSpace:     "nowrap",
  },
  divider: {
    fontSize:  "11px",
    color:     "#D0D0DC",
    userSelect: "none",
    lineHeight: 1,
  },

  // Disclaimer strip
  disclaimer: {
    backgroundColor: "#F5F5F5",
    padding:         "12px 48px",
    textAlign:       "center",
  },
  disclaimerText: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "11px",
    color:       "#9898A8",
    fontStyle:   "italic",
    margin:      0,
    lineHeight:  1.6,
    maxWidth:    "800px",
    marginLeft:  "auto",
    marginRight: "auto",
  },
};
