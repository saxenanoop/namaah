"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Find by Nakshatra", href: "/nakshatra" },
  { label: "Browse Names",      href: "/search" },
  { label: "Trending",          href: "/trending" },
  { label: "Celebrity Picks",   href: "/trending#celebrity" },
];

const SHORTLIST_KEY = "namaah-shortlist";

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [shortlistCount, setShortlistCount] = useState(0);

  // Read shortlist count from localStorage (client-side only)
  const syncCount = useCallback(() => {
    try {
      const raw = localStorage.getItem(SHORTLIST_KEY);
      if (!raw) { setShortlistCount(0); return; }
      const parsed = JSON.parse(raw);
      setShortlistCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setShortlistCount(0);
    }
  }, []);

  useEffect(() => {
    syncCount();
    // Re-sync whenever storage changes (other tabs or in-page events)
    window.addEventListener("storage", syncCount);
    window.addEventListener("namaah:shortlist-updated", syncCount);
    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener("namaah:shortlist-updated", syncCount);
    };
  }, [syncCount]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner} className="navbar-inner">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" style={styles.logo} aria-label="Namaah — go to homepage">
            <span style={styles.logoText}>Namaah</span>
            <span style={styles.logoDot}>.</span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────────── */}
          <nav style={styles.desktopNav} className="navbar-desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </nav>

          {/* ── Right: CTA + Hamburger ───────────────────────────────────── */}
          <div style={styles.right}>
            <Link href="/shortlist" style={styles.ctaBtn} aria-label="My Shortlist">
              <HeartIcon />
              <span>My Shortlist</span>
              {shortlistCount > 0 && (
                <span style={styles.badge} aria-label={`${shortlistCount} saved names`}>
                  {shortlistCount > 99 ? "99+" : shortlistCount}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="navbar-hamburger"
              style={styles.hamburger}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Slide-Down Menu ─────────────────────────────────────────── */}
      <div
        className="navbar-mobile-menu"
        style={{
          ...styles.mobileMenu,
          maxHeight: menuOpen ? "400px" : "0px",
          opacity:   menuOpen ? 1 : 0,
        }}
        aria-hidden={!menuOpen}
      >
        <nav style={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...styles.mobileLink,
                color: pathname === link.href ? "#C8601A" : "#2E3A5C",
                fontWeight: pathname === link.href ? 500 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/shortlist" style={styles.mobileShortlistLink}>
            <HeartIcon />
            <span>My Shortlist</span>
            {shortlistCount > 0 && (
              <span style={styles.badge}>{shortlistCount}</span>
            )}
          </Link>
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        ...styles.navLink,
        color:      active || hovered ? "#2E3A5C" : "#6B6B80",
        fontWeight: active ? 500 : 400,
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {/* Active underline */}
      {active && <span style={styles.activeUnderline} />}
    </Link>
  );
}

// ─── Inline Styles ───────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  header: {
    position:        "sticky",
    top:             0,
    zIndex:          50,
    width:           "100%",
    height:          "60px",
    backgroundColor: "#ffffff",
    borderBottom:    "1px solid #E8ECF5",
    boxShadow:       "0 1px 8px rgba(46,58,92,0.06)",
  },
  inner: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    height:         "100%",
    padding:        "0 32px",
    maxWidth:       "1280px",
    margin:         "0 auto",
  },

  // Logo
  logo: {
    display:        "flex",
    alignItems:     "baseline",
    textDecoration: "none",
    userSelect:     "none",
    flexShrink:     0,
  },
  logoText: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "26px",
    fontWeight: 600,
    color:      "#C8601A",
    lineHeight: 1,
    letterSpacing: "0.01em",
  },
  logoDot: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "30px",
    fontWeight: 700,
    color:      "#2E3A5C",
    lineHeight: 1,
  },

  // Desktop nav
  desktopNav: {
    display:        "flex",
    alignItems:     "center",
    gap:            "28px",
    // Hidden on mobile via CSS — we use a style tag below
  },
  navLink: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "13px",
    textDecoration: "none",
    transition:     "color 0.15s ease",
    whiteSpace:     "nowrap",
    paddingBottom:  "2px",
  },
  activeUnderline: {
    position:        "absolute",
    bottom:          "-2px",
    left:            0,
    right:           0,
    height:          "2px",
    backgroundColor: "#C8601A",
    borderRadius:    "1px",
  },

  // Right section
  right: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
    flexShrink: 0,
  },

  // CTA button
  ctaBtn: {
    display:         "flex",
    alignItems:      "center",
    gap:             "6px",
    position:        "relative",
    backgroundColor: "#2E3A5C",
    color:           "#ffffff",
    borderRadius:    "20px",
    padding:         "7px 16px",
    fontSize:        "12px",
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontWeight:      500,
    textDecoration:  "none",
    whiteSpace:      "nowrap",
    letterSpacing:   "0.02em",
    transition:      "background-color 0.15s ease, transform 0.1s ease",
    lineHeight:      "1.4",
  },

  // Badge
  badge: {
    position:        "absolute",
    top:             "-6px",
    right:           "-6px",
    minWidth:        "17px",
    height:          "17px",
    borderRadius:    "9px",
    backgroundColor: "#E53935",
    color:           "#fff",
    fontSize:        "10px",
    fontWeight:      700,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         "0 3px",
    lineHeight:      1,
    boxShadow:       "0 0 0 2px #fff",
  },

  // Hamburger button
  hamburger: {
    display:         "none",   // shown on mobile via <style> below
    background:      "none",
    border:          "none",
    cursor:          "pointer",
    padding:         "6px",
    color:           "#2E3A5C",
    borderRadius:    "6px",
    alignItems:      "center",
    justifyContent:  "center",
    transition:      "background 0.15s",
  },

  // Mobile slide-down menu
  mobileMenu: {
    position:        "sticky",
    top:             "60px",
    zIndex:          49,
    width:           "100%",
    backgroundColor: "#ffffff",
    borderBottom:    "1px solid #E8ECF5",
    overflow:        "hidden",
    transition:      "max-height 0.28s ease, opacity 0.22s ease",
    boxShadow:       "0 4px 16px rgba(46,58,92,0.08)",
    // Desktop: hidden entirely — shown mobile via style tag
  },
  mobileNav: {
    display:       "flex",
    flexDirection: "column",
    padding:       "12px 24px 20px",
    gap:           "4px",
  },
  mobileLink: {
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "15px",
    textDecoration: "none",
    padding:        "10px 0",
    borderBottom:   "1px solid #F0F2F8",
    transition:     "color 0.15s",
  },
  mobileShortlistLink: {
    display:        "flex",
    alignItems:     "center",
    gap:            "8px",
    position:       "relative",
    fontFamily:     "var(--font-body), 'DM Sans', sans-serif",
    fontSize:       "15px",
    fontWeight:     500,
    color:          "#2E3A5C",
    textDecoration: "none",
    padding:        "12px 0 4px",
    marginTop:      "4px",
  },

  // Backdrop
  backdrop: {
    position:        "fixed",
    inset:           0,
    zIndex:          48,
    backgroundColor: "rgba(30,30,50,0.18)",
  },
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}
