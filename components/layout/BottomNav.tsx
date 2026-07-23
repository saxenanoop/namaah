"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SHORTLIST_KEY = "namaah-shortlist";

// ─── More Drawer ──────────────────────────────────────────────────────────────

function MoreDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 98,
          backgroundColor: "rgba(30,30,50,0.28)",
        }}
        aria-hidden="true"
      />
      {/* Slide-up sheet */}
      <div
        className="bottom-sheet-enter"
        style={{
          position: "fixed",
          bottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))",
          left: 0, right: 0,
          zIndex: 99,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: "20px 24px 28px",
          boxShadow: "0 -4px 24px rgba(46,58,92,0.12)",
        }}
        role="dialog"
        aria-label="More menu"
      >
        <div style={{ width: "40px", height: "4px", backgroundColor: "#E8ECF5", borderRadius: "2px", margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "var(--font-display), serif", fontSize: "18px", color: "#2E3A5C", margin: "0 0 16px", fontWeight: 600 }}>
          More
        </p>
        {MORE_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={onClose} style={drawerLinkStyle}>
            <span style={{ fontSize: "18px", width: "28px" }}>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

const MORE_LINKS = [
  { icon: "🔥", label: "Trending Names",   href: "/trending" },
  { icon: "♈", label: "Browse by Rashi",  href: "/rashi" },
  { icon: "अ", label: "Hindi Names",       href: "/hindi" },
  { icon: "📖", label: "About Namaah",     href: "/about" },
];

const drawerLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "14px 0",
  borderBottom: "1px solid #F0F2F8",
  fontFamily: "var(--font-body), sans-serif",
  fontSize: "15px",
  color: "#2E3A5C",
  textDecoration: "none",
  fontWeight: 400,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BottomNav() {
  const pathname = usePathname();
  const [boardCount, setBoardCount] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  const syncCount = useCallback(() => {
    try {
      const raw = localStorage.getItem(SHORTLIST_KEY);
      if (!raw) { setBoardCount(0); return; }
      const parsed = JSON.parse(raw);
      setBoardCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch {
      setBoardCount(0);
    }
  }, []);

  useEffect(() => {
    syncCount();
    window.addEventListener("storage", syncCount);
    window.addEventListener("namaah:shortlist-updated", syncCount);
    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener("namaah:shortlist-updated", syncCount);
    };
  }, [syncCount]);

  // Close more drawer on route change
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const TABS: Array<{
    id: string;
    icon: (active: boolean) => React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    badge?: number;
    active: boolean;
  }> = [
    {
      id: "home",
      icon: (active) => <HomeIcon active={active} />,
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      id: "search",
      icon: (active) => <SearchIcon active={active} />,
      label: "Search",
      href: "/search",
      active: pathname.startsWith("/search"),
    },
    {
      id: "nakshatra",
      icon: (active) => <StarIcon active={active} />,
      label: "Nakshatra",
      href: "/nakshatra",
      active: pathname.startsWith("/nakshatra"),
    },
    {
      id: "board",
      icon: (active) => <HeartIcon active={active} />,
      label: "Board",
      href: "/shortlist",
      badge: boardCount,
      active: pathname.startsWith("/shortlist"),
    },
    {
      id: "more",
      icon: (active) => <DotsIcon active={active} />,
      label: "More",
      onClick: () => setMoreOpen((o) => !o),
      active: moreOpen,
    },
  ];

  return (
    <>
      <MoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
      <nav
        className="bottom-nav"
        style={navStyle}
        aria-label="Bottom navigation"
      >
        {TABS.map((tab) => {
          const color = tab.active ? "#C8601A" : "#9898A8";
          const content = (
            <>
              <span style={{ position: "relative" }}>
                {tab.icon(tab.active)}
                {tab.badge != null && tab.badge > 0 && (
                  <span style={badgeStyle}>
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </span>
              <span style={{ ...labelStyle, color }}>{tab.label}</span>
            </>
          );

          const itemStyle: React.CSSProperties = {
            ...tabStyle,
            color,
          };

          if (tab.href) {
            return (
              <Link key={tab.id} href={tab.href} style={itemStyle} aria-label={tab.label} aria-current={tab.active ? "page" : undefined}>
                {content}
              </Link>
            );
          }

          return (
            <button key={tab.id} onClick={tab.onClick} style={{ ...itemStyle, background: "none", border: "none" }} aria-label={tab.label} aria-expanded={moreOpen}>
              {content}
            </button>
          );
        })}
      </nav>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const navStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  height: "var(--bottom-nav-height)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #E8ECF5",
  boxShadow: "0 -2px 12px rgba(46,58,92,0.07)",
  alignItems: "stretch",
  justifyContent: "space-around",
};

const tabStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: "3px",
  padding: "0",
  textDecoration: "none",
  cursor: "pointer",
  minHeight: "44px",
  transition: "color 0.15s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  fontSize: "10px",
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: "0.01em",
};

const badgeStyle: React.CSSProperties = {
  position: "absolute",
  top: "-5px",
  right: "-8px",
  minWidth: "16px",
  height: "16px",
  borderRadius: "8px",
  backgroundColor: "#E53935",
  color: "#fff",
  fontSize: "9px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 3px",
  lineHeight: 1,
  boxShadow: "0 0 0 1.5px #fff",
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C8601A" : "none"} stroke={active ? "#C8601A" : "#9898A8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#C8601A" : "#9898A8"} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C8601A" : "none"} stroke={active ? "#C8601A" : "#9898A8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#C8601A" : "none"} stroke={active ? "#C8601A" : "#9898A8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DotsIcon({ active }: { active: boolean }) {
  const c = active ? "#C8601A" : "#9898A8";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={c} aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
