"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { names } from "@/data/names";
import type { BabyName } from "@/data/names";
import NameCard from "@/components/names/NameCard";

// ─── Derived data ──────────────────────────────────────────────────────────────

const trending  = names.filter(n => n.popularity === "trending");
const classics  = names.filter(n => n.popularity === "classic");
const rareGems  = names.filter(n => n.popularity === "rare");
const celebs    = names.filter(n => n.celebrityConnection && n.celebrityConnection.trim() !== "");

const byRegion: Record<string, BabyName[]> = {
  north:      names.filter(n => n.region === "north").slice(0, 5),
  south:      names.filter(n => n.region === "south").slice(0, 5),
  west:       names.filter(n => n.region === "west").slice(0, 5),
  "pan-india": names.filter(n => n.region === "pan-india").slice(0, 5),
};

// ─── Feature story data ────────────────────────────────────────────────────────

const FEATURED_NAME = names.find(n => n.slug === "vihaan") || trending[0];
const FEATURED_STORY = {
  name: "Vihaan",
  hindi: "विहान",
  pullquote: "The universe begins at the first light of dawn. And so does every new life.",
  body: `In ancient Sanskrit cosmology, there is no more sacred moment than Vihaan — the cusp of darkness giving way to the very first ray of morning. It is neither night nor day, but a liminal threshold that the Vedas describe as the dwelling place of possibility itself.

Parents across India have discovered something profound in this name. Vihaan has climbed from relative obscurity a decade ago to become the most saved baby name on naming platforms from Mumbai to Guwahati, from Chandigarh to Chennai. But unlike many trending names that ride the wave of a celebrity or a television serial, Vihaan's rise is quieter and more organic — driven by a generation of parents who want their child to carry not just a sound, but a philosophy.

The name appears in texts as old as the Rigveda, where 'viha' forms the root of words describing the opening of the sky. In the Mahabharata, the dawn is described as the moment when Arjuna would nock his first arrow — a moment of absolute clarity and focus. To name a child Vihaan is to give them the dawn as their identity: a perpetual new beginning, the promise that no darkness lasts, and that their very presence is the start of something extraordinary.

In 2026, as India's new generation of parents wrestles with questions of identity, heritage, and meaning, Vihaan stands at that same threshold — ancient and urgent all at once.`,
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

type TabType = "rising" | "timeless" | "rare";

const REGION_INFO: Record<string, { heading: string; note: string; states: string }> = {
  north:       { heading: "North India", states: "UP · Delhi · Rajasthan · Punjab", note: "Names here blend Vedic depth with Mughal poetic sensibility — Shiva, Arjun, and mythological heroes dominate." },
  south:       { heading: "South India", states: "Tamil Nadu · AP · Karnataka · Kerala", note: "Sanskrit roots meet Dravidian cadence — names here carry classical weight and often honour temple deities." },
  west:        { heading: "West India",  states: "Maharashtra · Gujarat · Rajasthan",  note: "Marathi and Gujarati naming leans Vedic and nature-themed, with a preference for crisp, energetic syllables." },
  "pan-india": { heading: "Pan-India",   states: "Loved everywhere",                  note: "These names transcend region — they carry a universal Sanskrit beauty that resonates from Kochi to Kolkata." },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function TrendingClient() {
  const [activeTab, setActiveTab] = useState<TabType>("rising");

  const tabNames = useMemo(() => {
    if (activeTab === "rising")   return trending;
    if (activeTab === "timeless") return classics;
    return rareGems;
  }, [activeTab]);

  return (
    <main style={s.page}>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ════════════════════════════════════════════════════════ */}
      <section style={s.hero} className="trending-hero">
        <div style={s.heroInner}>
          {/* Eyebrow */}
          <p style={s.eyebrow}>— Namaah Trend Report 2026</p>

          {/* Heading */}
          <h1 style={s.heroTitle} className="trending-hero-title">
            What&apos;s resonating<br />in 2026
          </h1>

          {/* Subtext */}
          <p style={s.heroSub}>
            Based on searches, saves, and naming conversations across India
          </p>

          {/* Metric cards */}
          <div style={s.metricRow}>
            <div style={s.metricCard}>
              <span style={s.metricValue}>Vihaan</span>
              <span style={s.metricHindi}>विहान</span>
              <span style={s.metricLabel}>Most saved this week</span>
            </div>
            <div style={s.metricCard}>
              <span style={s.metricValue}>Aahana</span>
              <span style={s.metricHindi}>आहाना</span>
              <span style={s.metricLabel}>Rising fast</span>
            </div>
            <div style={s.metricCard}>
              <span style={s.metricValue}>Triveni</span>
              <span style={s.metricHindi}>त्रिवेणी</span>
              <span style={s.metricLabel}>Rare gem trending</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — FEATURED STORY
          ════════════════════════════════════════════════════════ */}
      <section style={s.featuredWrap}>
        <div style={s.featuredInner}>
          {/* Label */}
          <p style={s.storyLabel}>✦ FEATURED STORY</p>

          {/* Name header */}
          <div style={s.storyTitleRow}>
            <div>
              <h2 style={s.storyNameTitle}>{FEATURED_STORY.name}</h2>
              <p style={s.storyHindi}>{FEATURED_STORY.hindi}</p>
            </div>
            <div style={s.storyBadge}>
              <span style={s.storyBadgeTop}>#1</span>
              <span style={s.storyBadgeLabel}>Most saved</span>
            </div>
          </div>

          {/* Deck */}
          <p style={s.storyDeck}>
            The story behind this season&apos;s favourite name
          </p>

          {/* Pull quote */}
          <blockquote style={s.pullQuote}>
            <span style={s.pullQuoteMark}>&ldquo;</span>
            {FEATURED_STORY.pullquote}
            <span style={s.pullQuoteMark}>&rdquo;</span>
          </blockquote>

          {/* Article body */}
          <div style={s.storyBody}>
            {FEATURED_STORY.body.split("\n\n").map((para, i) => (
              <p key={i} style={i === 0 ? { ...s.storyPara, ...s.storyParaFirst } : s.storyPara}>
                {para}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div style={s.storyCTARow}>
            <Link href={`/name/${FEATURED_NAME.slug}`} style={s.storyCTA}>
              Read the full profile for {FEATURED_STORY.name} →
            </Link>
            <Link href="/search?popularity=trending" style={s.storySecCTA}>
              Explore all trending names
            </Link>
          </div>
        </div>

        {/* Decorative sidebar */}
        <div style={s.featuredSidebar} aria-hidden="true">
          <div style={s.sidebarName}>{FEATURED_STORY.hindi}</div>
          <div style={s.sidebarDivider} />
          <div style={s.sidebarStat}><span style={s.sidebarStatNum}>+247%</span><span style={s.sidebarStatLbl}>searches this year</span></div>
          <div style={s.sidebarStat}><span style={s.sidebarStatNum}>Rohini</span><span style={s.sidebarStatLbl}>Nakshatra</span></div>
          <div style={s.sidebarStat}><span style={s.sidebarStatNum}>3</span><span style={s.sidebarStatLbl}>syllables</span></div>
          <div style={s.sidebarStat}><span style={s.sidebarStatNum}>1</span><span style={s.sidebarStatLbl}>Numerology</span></div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — TREND CATEGORIES (TABS)
          ════════════════════════════════════════════════════════ */}
      <section style={s.trendSection}>
        <div style={s.trendSectionInner}>

          {/* Section heading */}
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Browse by trend</h2>
            <p style={s.sectionSub}>Three distinct waves — each carrying a different kind of meaning</p>
          </div>

          {/* Tabs */}
          <div style={s.tabBar} className="trending-tab-bar" role="tablist">
            {(["rising", "timeless", "rare"] as TabType[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...s.tab,
                  ...(activeTab === tab ? s.tabActive : {}),
                }}
              >
                {tab === "rising"   && <><span style={s.tabIcon}>🔥</span> Rising</>}
                {tab === "timeless" && <><span style={s.tabIcon}>⏳</span> Timeless</>}
                {tab === "rare"     && <><span style={s.tabIcon}>💎</span> Rare Gems</>}
              </button>
            ))}
          </div>

          {/* Tab description */}
          <p style={s.tabDesc}>
            {activeTab === "rising"   && "Names gaining popularity fastest right now — the wave your child will ride ahead of the trend."}
            {activeTab === "timeless" && "Names that have stood the test of generations. Your grandparents knew them, your grandchildren will too."}
            {activeTab === "rare"     && "Names fewer than 1% of parents choose. For the family that wants something truly singular."}
          </p>

          {/* Grid */}
          <div style={s.trendGrid} className="trending-name-grid">
            {tabNames.slice(0, 12).map(n => (
              <NameCard key={n.id} name={n} compact />
            ))}
          </div>

          {/* See all link */}
          <div style={s.seeAllWrap}>
            <Link
              href={`/search?popularity=${activeTab === "rising" ? "trending" : activeTab === "timeless" ? "classic" : "rare"}`}
              style={s.seeAllBtn}
            >
              See all {activeTab === "rising" ? "rising" : activeTab === "timeless" ? "timeless" : "rare gem"} names →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — CELEBRITY NAMES
          ════════════════════════════════════════════════════════ */}
      <section style={s.celebSection} id="celebrity">
        <div style={s.celebInner}>

          <div style={s.sectionHeader}>
            <div style={s.celebTitleRow}>
              <span style={s.starIcon}>⭐</span>
              <h2 style={s.sectionTitle}>Names chosen by Indian celebrities</h2>
            </div>
            <p style={s.sectionSub}>Names that carry cultural resonance — and a conversation starter for life</p>
          </div>

          {/* Note */}
          <div style={s.celebNote}>
            <p style={s.celebNoteText}>
              <strong>A note from Namaah:</strong> Celebrity names carry enormous cultural energy and often
              spike in popularity. Consider whether your child will enjoy the association — it can be a
              source of pride, or occasionally a label they&apos;ll spend a lifetime explaining.
            </p>
          </div>

          {/* Grid */}
          <div style={s.celebGrid} className="trending-celeb-grid">
            {celebs.slice(0, 8).map(n => (
              <CelebCard key={n.id} name={n} />
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — REGIONAL BREAKDOWN
          ════════════════════════════════════════════════════════ */}
      <section style={s.regionSection}>
        <div style={s.regionInner}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>What&apos;s trending in your region</h2>
            <p style={s.sectionSub}>India&apos;s naming landscape is as diverse as its 28 states</p>
          </div>

          <div style={s.regionGrid} className="trending-region-grid">
            {(["north", "south", "west", "pan-india"] as const).map(region => {
              const info = REGION_INFO[region];
              const regionNames = byRegion[region];
              return (
                <div key={region} style={s.regionCard}>
                  {/* Region header */}
                  <div style={s.regionCardHeader}>
                    <h3 style={s.regionTitle}>{info.heading}</h3>
                    <p style={s.regionStates}>{info.states}</p>
                  </div>

                  {/* Name pills */}
                  <div style={s.regionPills}>
                    {regionNames.map(n => (
                      <Link key={n.id} href={`/name/${n.slug}`} style={s.regionPill}>
                        {n.name}
                      </Link>
                    ))}
                  </div>

                  {/* Note */}
                  <p style={s.regionNote}>{info.note}</p>

                  {/* CTA */}
                  <Link href={`/search?region=${region}`} style={s.regionCTA}>
                    View all {info.heading} names →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 6 — SEO EDITORIAL
          ════════════════════════════════════════════════════════ */}
      <section style={s.seoSection} className="trending-seo-section">
        <div style={s.seoInner}>
          <h2 style={s.seoTitle}>Trending Hindu baby names in 2026</h2>
          <p style={s.seoByline}>An editorial on what India&apos;s parents are choosing — and why it matters</p>
          <div style={s.seoDivider} />

          <h3 style={s.seoH3}>A generation rediscovering Sanskrit roots</h3>
          <p style={s.seoPara}>
            Something remarkable is happening in Indian nurseries in 2026. After a decade of globalised naming —
            names that could pass as easily in London as in Lucknow — parents are turning back to the Vedic deep.
            Trending Hindu baby names this year carry a new kind of intentionality: they are short, powerful,
            rooted in Sanskrit, and chosen with the deliberateness of a philosophical statement. Vihaan, Reyansh,
            Saanvi, Aadya — these are not accidents of fashion. They are a generation of parents saying: we know
            where we come from, and we want our children to carry that forward.
          </p>

          <h3 style={s.seoH3}>Nakshatra names are surging</h3>
          <p style={s.seoPara}>
            One of the most significant shifts in 2026 is the revival of Nakshatra names — baby names chosen
            to align with the birth star of the child, a practice rooted in Vedic astrology and the ancient art
            of Naamkaran. Parents increasingly consult their family astrologer or use tools like Namaah&apos;s
            Nakshatra finder before settling on a name. Names aligned to Ashwini, Rohini, and Shravana Nakshatras
            are seeing particular growth. This is not superstition — it is a form of cultural storytelling, where
            the child&apos;s name becomes a cosmic coordinate.
          </p>

          <h3 style={s.seoH3}>Why Sanskrit baby names are winning in 2026</h3>
          <p style={s.seoPara}>
            The best Sanskrit baby names carry something no other naming tradition does: a complete etymology.
            When you name your child Dhruv, you are invoking the Pole Star and the legend of the boy-saint who
            refused to move from his meditation until God appeared before him. When you name her Ananya, you are
            declaring that she is incomparable — a declaration that is also an epithet of Goddess Parvati. Each
            name is a story, a prayer, and a prediction all at once. In 2026, that depth is precisely what
            India&apos;s most thoughtful parents are seeking.
          </p>

          <h3 style={s.seoH3}>The rise of rare and forgotten names</h3>
          <p style={s.seoPara}>
            Parallel to the trend of popular Sanskrit names, a quieter movement is gaining momentum: the
            reclamation of rare Vedic names that had all but disappeared. Names like Triveni, Advait, and
            Ekalavya are being dusted off from temple records and literary texts by parents who don&apos;t want
            their child to share their name with three others in their school class. In 2026, rarity is a mark
            of cultural confidence — a signal that the family did their research, valued depth over popularity,
            and made a choice that will be a conversation for a lifetime.
          </p>

          <div style={s.seoFooter}>
            <Link href="/search" style={s.seoExploreBtn}>
              Explore all Hindu baby names →
            </Link>
            <Link href="/nakshatra" style={s.seoNakshatraBtn}>
              Find your baby&apos;s Nakshatra name
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

// ─── Celebrity Card Component ─────────────────────────────────────────────────

function CelebCard({ name }: { name: BabyName }) {
  return (
    <Link href={`/name/${name.slug}`} style={s.celebCard} aria-label={`${name.name} — ${name.celebrityConnection}`}>
      {/* Name */}
      <div style={s.celebCardTop}>
        <div>
          <h3 style={s.celebCardName}>{name.name}</h3>
          <p style={s.celebCardHindi}>{name.nameHindi}</p>
        </div>
        <span style={{ ...s.celebGenderBadge, backgroundColor: name.gender === "boy" ? "#E8ECF5" : "#FDE8F0", color: name.gender === "boy" ? "#2E3A5C" : "#C85A8A" }}>
          {name.gender}
        </span>
      </div>

      {/* Meaning */}
      <p style={s.celebCardMeaning}>{name.meaning}</p>

      {/* Celebrity connection box */}
      <div style={s.celebConnectionBox}>
        <span style={s.celebStarSmall}>⭐</span>
        <p style={s.celebConnectionText}>{name.celebrityConnection}</p>
      </div>
    </Link>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: "#FDFCFA",
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: "#FDF4EE",
    borderBottom: "1px solid #EEE4DA",
    padding: "60px 48px 48px",
  },
  heroInner: {
    maxWidth: "860px",
  },
  eyebrow: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#C8601A",
    textTransform: "uppercase",
    margin: "0 0 16px",
  },
  heroTitle: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize: "52px",
    fontWeight: 600,
    color: "#2E3A5C",
    lineHeight: 1.1,
    margin: "0 0 16px",
  },
  heroSub: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "15px",
    color: "#9898A8",
    margin: "0 0 36px",
    lineHeight: 1.5,
  },
  metricRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  metricCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #E8ECF5",
    borderRadius: "12px",
    padding: "18px 22px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "160px",
    flex: "1",
    boxShadow: "0 2px 8px rgba(46,58,92,0.04)",
  },
  metricValue: {
    fontFamily: "var(--font-display), serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#2E3A5C",
    lineHeight: 1.2,
  },
  metricHindi: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    color: "#9898A8",
  },
  metricLabel: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    color: "#C8601A",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "6px",
  },

  // ── FEATURED STORY ─────────────────────────────────────────────────────────
  featuredWrap: {
    display: "flex",
    gap: "48px",
    padding: "60px 48px",
    maxWidth: "1280px",
    margin: "0 auto",
    boxSizing: "border-box",
    borderBottom: "1px solid #F0F2F8",
  },
  featuredInner: {
    flex: 1,
    minWidth: 0,
  },
  storyLabel: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#C8601A",
    textTransform: "uppercase",
    margin: "0 0 20px",
  },
  storyTitleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "12px",
  },
  storyNameTitle: {
    fontFamily: "var(--font-display), serif",
    fontSize: "48px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: 0,
    lineHeight: 1.05,
  },
  storyHindi: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "18px",
    color: "#9898A8",
    margin: "4px 0 0",
  },
  storyBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#C8601A",
    borderRadius: "12px",
    padding: "14px 18px",
    flexShrink: 0,
  },
  storyBadgeTop: {
    fontFamily: "var(--font-display), serif",
    fontSize: "28px",
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1,
  },
  storyBadgeLabel: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "9px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "4px",
  },
  storyDeck: {
    fontFamily: "var(--font-display), serif",
    fontSize: "22px",
    fontStyle: "italic",
    color: "#6B6B80",
    margin: "0 0 28px",
    lineHeight: 1.35,
  },
  pullQuote: {
    borderLeft: "4px solid #C8601A",
    margin: "0 0 28px",
    padding: "16px 24px",
    backgroundColor: "#FDF4EE",
    borderRadius: "0 10px 10px 0",
    fontFamily: "var(--font-display), serif",
    fontSize: "20px",
    fontStyle: "italic",
    color: "#2E3A5C",
    lineHeight: 1.5,
  },
  pullQuoteMark: {
    color: "#C8601A",
    fontSize: "24px",
    lineHeight: 0,
    verticalAlign: "middle",
    marginRight: "4px",
  },
  storyBody: {
    marginBottom: "32px",
  },
  storyPara: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "16px",
    color: "#3A3A5C",
    lineHeight: 1.8,
    margin: "0 0 20px",
  },
  storyParaFirst: {
    fontSize: "18px",
    color: "#2E3A5C",
  },
  storyCTARow: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  storyCTA: {
    display: "inline-block",
    backgroundColor: "#2E3A5C",
    color: "#fff",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "14px 24px",
    borderRadius: "10px",
    textDecoration: "none",
  },
  storySecCTA: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#C8601A",
    textDecoration: "none",
    borderBottom: "1px solid #C8601A",
    paddingBottom: "2px",
  },
  featuredSidebar: {
    width: "200px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0",
    alignSelf: "flex-start",
    position: "sticky",
    top: "20px",
  },
  sidebarName: {
    fontFamily: "var(--font-display), serif",
    fontSize: "64px",
    color: "#EEE4DA",
    lineHeight: 1,
    marginBottom: "20px",
    textAlign: "center",
  },
  sidebarDivider: {
    height: "1px",
    backgroundColor: "#E8ECF5",
    marginBottom: "20px",
  },
  sidebarStat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "14px 0",
    borderBottom: "1px solid #F0F2F8",
  },
  sidebarStatNum: {
    fontFamily: "var(--font-display), serif",
    fontSize: "20px",
    color: "#2E3A5C",
    fontWeight: 600,
  },
  sidebarStatLbl: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "11px",
    color: "#9898A8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  // ── TREND CATEGORIES ───────────────────────────────────────────────────────
  trendSection: {
    backgroundColor: "#F8F8F6",
    borderBottom: "1px solid #EEECEA",
  },
  trendSectionInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "60px 48px",
    boxSizing: "border-box",
  },
  sectionHeader: {
    marginBottom: "36px",
  },
  sectionTitle: {
    fontFamily: "var(--font-display), serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "0 0 8px",
    lineHeight: 1.2,
  },
  sectionSub: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    color: "#9898A8",
    margin: 0,
  },
  tabBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    borderBottom: "2px solid #E8ECF5",
    paddingBottom: "0",
  },
  tab: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#9898A8",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "12px 20px",
    borderBottom: "2px solid transparent",
    marginBottom: "-2px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.15s ease, border-color 0.15s ease",
    minHeight: "44px",
  },
  tabActive: {
    color: "#C8601A",
    borderBottomColor: "#C8601A",
    fontWeight: 600,
  },
  tabIcon: {
    fontSize: "14px",
  },
  tabDesc: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontStyle: "italic",
    color: "#6B6B80",
    margin: "0 0 28px",
    lineHeight: 1.5,
  },
  trendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "32px",
  },
  seeAllWrap: {
    display: "flex",
    justifyContent: "center",
  },
  seeAllBtn: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    color: "#C8601A",
    textDecoration: "none",
    padding: "12px 28px",
    border: "1.5px solid #C8601A",
    borderRadius: "20px",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
  },

  // ── CELEBRITY ─────────────────────────────────────────────────────────────
  celebSection: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #F0F2F8",
  },
  celebInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "60px 48px",
    boxSizing: "border-box",
  },
  celebTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  starIcon: {
    fontSize: "24px",
  },
  celebNote: {
    backgroundColor: "#FFF8E7",
    border: "1px solid #F0D88A",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "32px",
  },
  celebNoteText: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    color: "#7A4A10",
    margin: 0,
    lineHeight: 1.6,
  },
  celebGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  // Celebrity card
  celebCard: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FDFCFA",
    border: "1px solid #E8ECF5",
    borderRadius: "14px",
    padding: "20px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  celebCardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "8px",
  },
  celebCardName: {
    fontFamily: "var(--font-display), serif",
    fontSize: "26px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: 0,
    lineHeight: 1.1,
  },
  celebCardHindi: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "12px",
    color: "#9898A8",
    margin: "4px 0 0",
  },
  celebGenderBadge: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: "12px",
    textTransform: "capitalize",
    flexShrink: 0,
  },
  celebCardMeaning: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    color: "#6B6B80",
    margin: "0 0 14px",
    lineHeight: 1.4,
  },
  celebConnectionBox: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E7",
    borderRadius: "8px",
    padding: "10px 12px",
    border: "1px solid #F0D88A",
    marginTop: "auto",
  },
  celebStarSmall: {
    fontSize: "13px",
    flexShrink: 0,
    marginTop: "1px",
  },
  celebConnectionText: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "12px",
    color: "#4A3A10",
    margin: 0,
    lineHeight: 1.5,
  },

  // ── REGIONAL ───────────────────────────────────────────────────────────────
  regionSection: {
    backgroundColor: "#F8F8F6",
    borderBottom: "1px solid #EEECEA",
  },
  regionInner: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "60px 48px",
    boxSizing: "border-box",
  },
  regionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  regionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #E8ECF5",
    borderRadius: "16px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  regionCardHeader: {},
  regionTitle: {
    fontFamily: "var(--font-display), serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "0 0 4px",
  },
  regionStates: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "11px",
    color: "#9898A8",
    letterSpacing: "0.04em",
    margin: 0,
    textTransform: "uppercase",
  },
  regionPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  regionPill: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "#2E3A5C",
    backgroundColor: "#F0F2F8",
    borderRadius: "20px",
    padding: "6px 14px",
    textDecoration: "none",
    transition: "background-color 0.15s",
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
  },
  regionNote: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    color: "#6B6B80",
    lineHeight: 1.6,
    margin: 0,
    fontStyle: "italic",
    borderLeft: "2px solid #E8ECF5",
    paddingLeft: "12px",
  },
  regionCTA: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#C8601A",
    textDecoration: "none",
    marginTop: "auto",
  },

  // ── SEO SECTION ────────────────────────────────────────────────────────────
  seoSection: {
    backgroundColor: "#F8F8F6",
  },
  seoInner: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "64px 48px",
    boxSizing: "border-box",
  },
  seoTitle: {
    fontFamily: "var(--font-display), serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "0 0 8px",
    lineHeight: 1.2,
  },
  seoByline: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontStyle: "italic",
    color: "#9898A8",
    margin: "0 0 28px",
  },
  seoDivider: {
    height: "2px",
    width: "60px",
    backgroundColor: "#C8601A",
    marginBottom: "36px",
  },
  seoH3: {
    fontFamily: "var(--font-display), serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#2E3A5C",
    margin: "36px 0 12px",
    lineHeight: 1.3,
  },
  seoPara: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "16px",
    color: "#3A3A5C",
    lineHeight: 1.85,
    margin: "0 0 8px",
  },
  seoFooter: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "44px",
    paddingTop: "32px",
    borderTop: "1px solid #E8ECF5",
  },
  seoExploreBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#C8601A",
    color: "#fff",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "14px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    minHeight: "44px",
  },
  seoNakshatraBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#2E3A5C",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    padding: "14px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    border: "1.5px solid #2E3A5C",
    minHeight: "44px",
  },
};
