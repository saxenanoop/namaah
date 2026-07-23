"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";

// Helper to manage shortlist in localStorage
function getShortlistFromStorage(): BabyName[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("namaah-shortlist-ids");
    if (!raw) return [];
    const ids: string[] = JSON.parse(raw);
    return names.filter((n) => ids.includes(n.id));
  } catch {
    return [];
  }
}


// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SHORTLIST = 12;

const POP_BADGE: Record<BabyName["popularity"], { label: string; bg: string; color: string }> = {
  trending: { label: "Trending", bg: "#FEE8E2", color: "#C8601A" },
  classic:  { label: "Classic",  bg: "#FFF8E7", color: "#B8860B" },
  rare:     { label: "Rare gem", bg: "#E8ECF5", color: "#2E3A5C" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShortlistClient() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<BabyName[]>([]);

  useEffect(() => {
    setItems(getShortlistFromStorage());
  }, []);

  const remove = (slug: string) => {
    const updated = items.filter((i) => i.slug !== slug);
    setItems(updated);
    try {
      localStorage.setItem("namaah-shortlist-ids", JSON.stringify(updated.map((u) => u.id)));
    } catch {}
  };

  const count = items.length;

  const [toast, setToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [surname, setSurname] = useState("");
  const [mounted, setMounted] = useState(false);

  
  // New States
  const [compareMode, setCompareMode] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [sharedVotingNames, setSharedVotingNames] = useState<BabyName[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  // ── Initialization & Share URL Loading ────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    
    // Parse family voting sync
    try {
      const storedVotes = localStorage.getItem("namaah-votes");
      if (storedVotes) setVotes(JSON.parse(storedVotes));
    } catch {}

    const sharedParam = searchParams.get("names");
    const voterParam = searchParams.get("voter");

    if (voterParam === "grandparent" && sharedParam) {
      setIsVoter(true);
      const sharedSlugs = sharedParam.split(",").filter(Boolean);
      const sNames = sharedSlugs.map(s => names.find(n => n.slug === s)).filter(Boolean) as BabyName[];
      setSharedVotingNames(sNames);
      return; 
    }

    if (!sharedParam) return;

    // Normal User Share Merge
    const sharedSlugs = sharedParam.split(",").filter(Boolean);
    const sharedNames = sharedSlugs.map((slug) => names.find((n) => n.slug === slug)).filter((n): n is BabyName => Boolean(n));

    const raw = localStorage.getItem("namaah-shortlist");
    let current: BabyName[] = [];
    try {
      const parsed = JSON.parse(raw ?? "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof parsed[0] === "string") {
          current = parsed.map((slug) => names.find((n) => n.slug === slug)).filter((n): n is BabyName => Boolean(n));
        } else {
          current = parsed;
        }
      }
    } catch { current = []; }

    const combined = [...current, ...sharedNames];
    const merged = Array.from(new Map(combined.map(n => [n.slug, n])).values()).slice(0, MAX_SHORTLIST);
    
    localStorage.setItem("namaah-shortlist", JSON.stringify(merged));
    window.dispatchEvent(new Event("namaah:shortlist-updated"));
  }, [searchParams]);

  const savedNames: BabyName[] = isVoter ? sharedVotingNames : items;

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/shortlist?names=${items.map((n) => n.slug).join(",")}&voter=grandparent`;
    navigator.clipboard.writeText(url).catch(() => {});
    setToast(true);
    setCopied(true);
    setTimeout(() => setToast(false), 2500);
    setTimeout(() => setCopied(false), 2000);
  }, [items]);

  const handleVote = (slug: string) => {
    const nextVotes = { ...votes, [slug]: (votes[slug] || 0) + 1 };
    setVotes(nextVotes);
    localStorage.setItem("namaah-votes", JSON.stringify(nextVotes));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  // ─── 1. FAMILY VOTING MODE (Grandparent view) ───────────────────────────
  if (isVoter) {
    return (
      <div style={e.wrap}>
         <div className="om-breathe" style={e.absoluteOm}>ॐ</div>
         <h1 style={e.heading}>Grandma & Grandpa</h1>
         <p style={e.sub}>Which name is your favourite? Cast your vote below!</p>
         
         <div style={s.moodBoardGrid}>
           {savedNames.map(n => (
             <div key={n.id} style={s.moodCard}>
               <h3 style={s.moodName}>{n.name} <span style={s.moodHindi}>{n.nameHindi}</span></h3>
               <p style={s.moodMeaning}>{n.meaning}</p>
               <div style={s.moodStory}><div style={s.moodStoryLabel}>STORY</div>{n.meaningFull.split('.')[0]}.</div>
               
               <button onClick={() => handleVote(n.slug)} style={s.voteBtn}>
                 Register Vote (Current: {votes[n.slug] || 0})
               </button>
             </div>
           ))}
         </div>
      </div>
    );
  }

  // ─── 2. EMPTY STATE ────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div style={e.wrap}>
        <div className="om-breathe" style={e.absoluteOm}>ॐ</div>
        <h1 style={e.heading}>Your name board is empty</h1>
        <p style={e.sub}>Save names by tapping ♥ as you browse. Your board is where the family decides together.</p>
        <div style={{display: 'flex', gap: '16px'}}>
          <Link href="/search" style={e.cta}>Browse all names &rarr;</Link>
          <Link href="/nakshatra" style={{...e.cta, backgroundColor: '#2E3A5C'}}>Find by birth star &rarr;</Link>
        </div>
      </div>
    );
  }

  // ─── 3. FILLED STATE (Name Board) ──────────────────────────────────────────
  return (
    <main className="printable-board">
      
      {toast && (
        <div style={s.toast} className="no-print">
          ✓ Link copied! Share with grandparents to get their votes.
        </div>
      )}

      {/* SECTION 1: BOARD HEADER */}
      <header style={s.header} className="shortlist-header">
        <div>
          <h1 style={s.heading} className="shortlist-heading">My Name Board</h1>
          <p style={s.subCount}>{count} name{count !== 1 ? "s" : ""} saved</p>
        </div>

        <div style={s.actions} className="no-print shortlist-actions">
          <button onClick={handleShare} style={s.actionBtn} aria-label="Share with family">
            {copied ? <CheckIcon /> : <ShareIcon />}
            {copied ? "Link copied!" : "Share with family"}
          </button>
          <button onClick={() => setCompareMode(!compareMode)} style={s.actionBtn}>
             {compareMode ? "Grid View" : "Compare side by side"}
          </button>
          <button onClick={handlePrint} style={s.actionBtn}>
            Export PDF
          </button>
        </div>
      </header>

      {/* SECTION 2 & 3: GRID (MOODBOARD) or TABLE (COMPARISON) */}
      <div style={s.boardWrap} className="shortlist-board-wrap">
        {compareMode ? (
          // COMPARISON MODE 
          <div style={s.tableScroll}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{...s.th, position: "sticky", left: 0, zIndex: 10}}>Name</th>
                  <th style={s.th}>Meaning</th>
                  <th style={s.th}>Nakshatra</th>
                  <th style={s.th}>Rashi</th>
                  <th style={s.th}>Popularity</th>
                  <th style={s.th}>Syllables</th>
                  <th style={s.th}>Deity</th>
                  <th style={s.th}>Story</th>
                </tr>
              </thead>
              <tbody>
                {savedNames.map((n, i) => {
                  const pop = POP_BADGE[n.popularity];
                  return (
                    <tr key={n.id} style={{backgroundColor: i % 2 === 0 ? "#fff" : "#FDFCFA"}}>
                      <td style={{...s.td, position: "sticky", left: 0, backgroundColor: i % 2 === 0 ? "#fff" : "#FDFCFA", zIndex: 5}}>
                         <div style={{display: "flex", flexDirection: "column"}}>
                           <Link href={`/name/${n.slug}`} style={s.nameLink}>{n.name}</Link>
                           <span style={s.tableHindi}>{n.nameHindi}</span>
                         </div>
                      </td>
                      <td style={s.td}><span style={s.meaningCell}>{n.meaning}</span></td>
                      <td style={s.td}><span style={s.infoCell}>{n.nakshatra}</span></td>
                      <td style={s.td}><span style={s.infoCell}>{n.rashi}</span></td>
                      <td style={s.td}>
                        <span style={{...s.miniBadge, backgroundColor: pop.bg, color: pop.color}}>{pop.label}</span>
                      </td>
                      <td style={{...s.td, textAlign: "center"}}><span style={s.infoCell}>{n.syllables}</span></td>
                      <td style={s.td}><span style={s.infoCell}>{n.deity || "N/A"}</span></td>
                      <td style={s.td}>
                        <span style={s.meaningCell}>{n.meaningFull.substring(0, 40)}...</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // VISUAL CARD GRID (Moodboard)
          <div style={s.moodBoardGrid} className="mood-board-grid">
            {savedNames.map(n => (
              <div key={n.id} style={s.moodCard} className="mood-print-card">
                 <button onClick={() => remove(n.slug)} style={s.moodRemoveX} aria-label="Remove" className="no-print">✕</button>
                 <Link href={`/name/${n.slug}`} style={{textDecoration: "none"}}>
                   <h3 style={s.moodName}>{n.name} <span style={s.moodHindi}>{n.nameHindi}</span></h3>
                   <p style={s.moodMeaning}>{n.meaning}</p>
                   <div style={s.moodStory}><div style={s.moodStoryLabel}>STORY</div>{n.meaningFull.split('.')[0]}.</div>
                   <div style={s.moodPillRow}>
                     <span style={s.moodPill}>{n.nakshatra}</span>
                     <span style={s.moodPill}>{n.rashi}</span>
                   </div>
                   {votes[n.slug] > 0 && (
                     <div style={s.voteTallyBadge}>
                        ♥ {votes[n.slug]} family vote{votes[n.slug] > 1 ? "s" : ""}
                     </div>
                   )}
                 </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: SURNAME TEST */}
      <section style={s.surnameSec} className="no-print shortlist-surname-section">
        <h2 style={s.surnameTitle}>Test all your shortlisted names with your surname</h2>
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Your family surname..."
          style={s.surnameInput}
          maxLength={40}
        />
        <p style={s.surnameHint}>Names flow best when stress alternates: <em>Aarav Sharma ✓ (1+2 syllables)</em></p>
        <p style={{...s.surnameHint, fontSize: '12px'}}>(Boy&apos;s names traditionally have even syllables, Girl&apos;s names odd syllables)</p>
        
        {surname.trim() && (
          <div style={s.previewList}>
            {savedNames.map((n) => (
              <div key={n.id} style={s.previewRow}>
                <span style={s.previewName}>{n.name}</span>
                <span style={s.previewSurname}> {surname.trim()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CSS for print media formatting */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-board, .printable-board * { visibility: visible; }
          .printable-board { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
          .no-print { display: none !important; }
          .mood-print-card { break-inside: avoid; border: 1px solid #ccc !important; box-shadow: none !important; }
        }
      `}} />

    </main>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{ marginRight: 5, flexShrink: 0 }}
    >
      <polyline
        points="20 6 9 17 4 12"
        style={{
          strokeDasharray: 30,
          strokeDashoffset: 0,
          animation: "checkmark-draw 0.3s ease both",
        }}
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ marginRight: 5, flexShrink: 0 }}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const e: Record<string, React.CSSProperties> = {
  wrap: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "48px", textAlign: "center", backgroundColor: "#FCFDFE", overflow: "hidden" },
  absoluteOm: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "40vw", color: "#C8601A", opacity: 0.05, zIndex: 0, pointerEvents: "none", fontFamily: "sans-serif", lineHeight: 1 },
  heading: { position: "relative", zIndex: 1, fontFamily: "var(--font-display), 'Cormorant Garamond', serif", fontSize: "48px", color: "#2E3A5C", margin: "0 0 16px" },
  sub: { position: "relative", zIndex: 1, fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "16px", color: "#6B6B80", margin: "0 0 32px", maxWidth: "400px", lineHeight: 1.6 },
  cta: { position: "relative", zIndex: 1, fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "#ffffff", backgroundColor: "#C8601A", border: "none", borderRadius: "10px", padding: "12px 32px", textDecoration: "none" }
};

const s: Record<string, React.CSSProperties> = {
  toast: { position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#31A062", color: "#fff", fontFamily: "var(--font-body)", fontSize: "14px", padding: "12px 24px", borderRadius: "20px", zIndex: 999, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", padding: "48px", backgroundColor: "#FCFDFE" },
  heading: { fontFamily: "var(--font-display), serif", fontSize: "42px", color: "#2E3A5C", margin: "0 0 8px", lineHeight: 1.1 },
  subCount: { fontFamily: "var(--font-body)", fontSize: "15px", color: "#6B6B80", margin: 0 },
  actions: { display: "flex", gap: "12px" },
  actionBtn: { display: "inline-flex", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "#2E3A5C", backgroundColor: "#fff", border: "1.5px solid #E8ECF5", borderRadius: "10px", padding: "10px 20px", cursor: "pointer", transition: "all 0.15s ease" },
  
  boardWrap: { padding: "0 48px 48px", minHeight: "400px" },
  
  // Mood Board
  moodBoardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" },
  moodCard: { position: "relative", padding: "32px 24px", backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 6px 20px rgba(46,58,92,0.04), 0 1px 4px rgba(46,58,92,0.02)", border: "1px solid #FCFDFE", display: "flex", flexDirection: "column" },
  moodRemoveX: { position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#C8C8D4", fontSize: "16px", cursor: "pointer" },
  moodName: { fontFamily: "var(--font-display), serif", fontSize: "32px", color: "#2E3A5C", margin: "0 0 4px", display: "flex", alignItems: "baseline", gap: "8px" },
  moodHindi: { fontFamily: "var(--font-body)", fontSize: "16px", color: "#9898A8", fontWeight: 400 },
  moodMeaning: { fontFamily: "var(--font-body)", fontSize: "13px", color: "#6B6B80", fontStyle: "italic", margin: "0 0 20px", display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 },
  moodStory: { paddingLeft: "12px", borderLeft: "2px solid #C8601A", fontFamily: "var(--font-body)", fontSize: "12px", color: "#4A4A6A", lineHeight: 1.5, margin: "auto 0 20px 0" },
  moodStoryLabel: { fontSize: "9px", fontWeight: 700, color: "#C8601A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" },
  moodPillRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "auto" },
  moodPill: { backgroundColor: "#F4F6F9", color: "#4A5A82", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 500 },
  voteTallyBadge: { marginTop: "16px", display: "inline-block", backgroundColor: "#FEE8E2", color: "#C8601A", fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px" },
  voteBtn: { marginTop: "16px", width: "100%", backgroundColor: "#C8601A", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, cursor: "pointer" },

  // Table Compare Mode
  tableScroll: { overflowX: "auto", borderRadius: "12px", border: "1px solid #E8ECF5" },
  table: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "13px", backgroundColor: "#fff" },
  th: { padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#9898A8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E8ECF5" },
  td: { padding: "16px 24px", borderBottom: "1px solid #F0F2F8", verticalAlign: "top" },
  nameLink: { fontFamily: "var(--font-display), serif", fontSize: "22px", fontWeight: 600, color: "#2E3A5C", textDecoration: "none" },
  tableHindi: { color: "#9898A8", fontSize: "12px" },
  meaningCell: { color: "#4A4A6A", lineHeight: 1.5, display: "block", minWidth: "180px" },
  infoCell: { color: "#2E3A5C" },
  miniBadge: { padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" },
  
  // Surname Test
  surnameSec: { padding: "64px 48px", backgroundColor: "#FCFDFE", display: "flex", flexDirection: "column", alignItems: "center", borderTop: "1px solid #E8ECF5" },
  surnameTitle: { fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 600, color: "#2E3A5C", margin: "0 0 16px" },
  surnameInput: { display: "block", width: "min(600px, 100%)", fontFamily: "var(--font-body)", fontSize: "20px", color: "#1A1A2E", border: "1.5px solid #2E3A5C", borderRadius: "12px", padding: "16px 24px", textAlign: "center", outline: "none", marginBottom: "16px" },
  surnameHint: { fontFamily: "var(--font-body)", fontSize: "14px", color: "#6B6B80", margin: "0 0 8px" },
  previewList: { display: "flex", flexDirection: "column", gap: "24px", marginTop: "48px", width: "100%", alignItems: "center" },
  previewRow: { fontFamily: "var(--font-display), serif", fontSize: "40px", color: "#2E3A5C", textAlign: "center" },
  previewName: { color: "#2E3A5C" },
  previewSurname: { color: "#C8601A" },
};
