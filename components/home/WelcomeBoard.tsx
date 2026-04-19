"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserProfile } from "./PersonalizationFlow";
import { names, BabyName } from "@/data/names";
import NameCard from "@/components/names/NameCard";

export default function WelcomeBoard({ profile }: { profile: UserProfile }) {
  const [recommended, setRecommended] = useState<BabyName[]>([]);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    // Check if this is a returning visit (checking a session flag)
    const sessionFlag = sessionStorage.getItem("namaah-session");
    if (!sessionFlag) {
      sessionStorage.setItem("namaah-session", "active");
    } else {
      setIsReturning(true);
    }

    // Get shortlist count
    try {
      const stored = localStorage.getItem("namaah-shortlist");
      if (stored) {
        setShortlistCount(JSON.parse(stored).length);
      }
    } catch {}

    // Filter recommendations based on profile
    let filtered = [...names];

    // 1. Gender filtering
    if (profile.gender === "boy" || profile.gender === "girl") {
      filtered = filtered.filter((n) => n.gender === profile.gender);
    }

    // 2. Nakshatra filtering if present
    if (profile.hasNakshatra && profile.nakshatra) {
      // Prioritize nakshatra matches
      const nakMatches = filtered.filter((n) => n.nakshatra.toLowerCase() === profile.nakshatra?.toLowerCase());
      if (nakMatches.length > 0) {
        filtered = nakMatches;
      }
    }

    // 3. Priorities filtering
    if (profile.priorities.length > 0) {
      // Sort or filter by priorities (example: rare, modern, mythological)
      const matches = filtered.filter(n => {
        if (profile.priorities.includes("rare") && n.popularity === "rare") return true;
        if (profile.priorities.includes("modern") && n.theme === "modern") return true;
        if (profile.priorities.includes("mythology") && n.theme === "mythological") return true;
        if (profile.priorities.includes("short") && n.syllables <= 2) return true;
        // 'meaning' and 'astrology' are generally broad
        return false;
      });
      
      // If we have strong priority matches, use them, otherwise fall back to the base filtered set
      if (matches.length >= 4) {
        filtered = matches;
      }
    }

    // Take top 8 and shuffle or just slice
    setRecommended(filtered.slice(0, 8));

  }, [profile]);

  return (
    <section className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 relative w-full bg-[#FDF4EE] px-12 py-16">
      
      {/* Decorative background element */}
      <div style={styles.mandala} />

      <div className="max-w-[1000px] mx-auto relative z-10">
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.heading}>
              {isReturning 
                ? `Welcome back!` 
                : `Namaste!`}
            </h1>
            <p style={styles.subheading}>
              {isReturning && shortlistCount > 0
                ? `Your shortlist currently has ${shortlistCount} names.`
                : `Here are some beautiful names we think you'll love — based on your preferences.`}
            </p>
          </div>
          
          <Link href="/search" style={styles.editBtn} className="hover:bg-[#E8ECF5] transition-colors">
            Browse all names &rarr;
          </Link>
        </div>

        <div style={styles.grid}>
          {recommended.map((n) => (
            <NameCard key={n.id} name={n} />
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  heading: {
    fontFamily: "var(--font-display), serif",
    fontSize: "42px",
    fontWeight: 600,
    color: "#2E3A5C",
    lineHeight: 1.1,
    marginBottom: "12px",
  },
  subheading: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "16px",
    color: "#6B6B80",
    maxWidth: "500px",
    lineHeight: 1.5,
  },
  editBtn: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#2E3A5C",
    padding: "10px 20px",
    borderRadius: "20px",
    border: "1px solid #2E3A5C",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  mandala: {
    position: "absolute",
    top: "-100px",
    right: "-50px",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(200,96,26,0.08) 0%, rgba(253,244,238,0) 70%)",
    pointerEvents: "none",
  }
};
