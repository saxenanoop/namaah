import type { Metadata } from "next";
import Link from "next/link";
import { names } from "@/data/names";
import NameCard from "@/components/names/NameCard";

// ─── SEO ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "हिंदू बच्चे का नाम — Hindu baby names in Hindi | Namaah",
  description: "हिंदू बच्चे के लिए सबसे सुंदर नाम। लड़के और लड़की के नाम उनके अर्थ के साथ। नक्षत्र और राशि के अनुसार नाम खोजें।",
  keywords:    "हिंदू बच्चे का नाम, लड़के के नाम, लड़की के नाम, नक्षत्र के अनुसार नाम, राशि का नाम, hindu baby names hindi",
  openGraph: {
    title:       "हिंदू बच्चे का नाम | Namaah",
    description: "20,000 से अधिक हिंदू नाम, उनके अर्थ, नक्षत्र और राशि के साथ।",
    type:        "website",
    locale:      "hi_IN",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRENDING_NAMES = names.filter((n) => n.popularity === "trending").slice(0, 8);

const CATEGORY_CARDS = [
  {
    href:    "/search?gender=boy",
    icon:    "👦",
    title:   "लड़के के नाम",
    titleEn: "Boy names",
    sub:     "संस्कृत, वैदिक और आधुनिक लड़कों के नाम",
    color:   "#E8ECF5",
    accent:  "#2E3A5C",
  },
  {
    href:    "/search?gender=girl",
    icon:    "👧",
    title:   "लड़की के नाम",
    titleEn: "Girl names",
    sub:     "देवी, प्रकृति और गुण पर आधारित लड़कियों के नाम",
    color:   "#FDE8F0",
    accent:  "#C85A8A",
  },
  {
    href:    "/nakshatra",
    icon:    "⭐",
    title:   "नक्षत्र के अनुसार नाम",
    titleEn: "Names by Nakshatra",
    sub:     "जन्म तारीख से नक्षत्र और शुभ अक्षर खोजें",
    color:   "#FDF4EE",
    accent:  "#C8601A",
  },
  {
    href:    "/rashi",
    icon:    "🌙",
    title:   "राशि के अनुसार नाम",
    titleEn: "Names by Rashi",
    sub:     "12 राशियों के अनुसार शुभ हिंदू नाम",
    color:   "#F3E8FE",
    accent:  "#7B5EA7",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HindiPage() {
  return (
    <main lang="hi">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={s.hero} className="hindi-hero">
        <p style={s.eyebrow}>Namaah · हिंदू नाम संग्रह</p>
        <h1 style={s.heroTitle} className="hindi-hero-title">अपने बच्चे के लिए सही नाम खोजें</h1>
        <p style={s.heroSub}>
          20,000 से अधिक हिंदू नाम, उनके अर्थ, नक्षत्र और राशि के साथ
        </p>
        <p style={s.heroSubEn}>
          20,000+ Hindu baby names with meanings, Nakshatra and Rashi
        </p>
      </section>

      {/* ── 4 category cards ─────────────────────────────────────────────── */}
      <section style={s.cardSection} className="hindi-card-section" aria-label="नाम श्रेणियाँ">
        <div style={s.cardGrid} className="hindi-card-grid">
          {CATEGORY_CARDS.map(({ href, icon, title, titleEn, sub, color, accent }) => (
            <Link key={href} href={href} style={s.card} aria-label={titleEn}>
              {/* Coloured top strip */}
              <div style={{ ...s.cardTop, backgroundColor: color }}>
                <span style={s.cardIcon} aria-hidden="true">{icon}</span>
              </div>

              <div style={s.cardBody}>
                <h2 style={{ ...s.cardTitle, color: accent }}>{title}</h2>
                <p style={s.cardTitleEn}>{titleEn}</p>
                <p style={s.cardSub}>{sub}</p>
                <span style={{ ...s.cardCta, color: accent }}>देखें →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Hindi SEO paragraph ──────────────────────────────────────────── */}
      <section style={s.seoSection} className="hindi-seo-section" aria-label="हिंदू नामकरण परंपरा">
        <div style={s.seoInner}>
          <h2 style={s.seoTitle}>हिंदू नामकरण की परंपरा</h2>
          <div style={s.seoPara}>
            <p style={s.p}>
              हिंदू संस्कृति में <strong>हिंदू बच्चे का नाम</strong> रखना केवल एक पहचान देना नहीं है —
              यह एक पवित्र कार्य है। वेदों के अनुसार, बच्चे का नाम उसकी आत्मा से जुड़ा होता है।
              सही नाम बच्चे के जीवन में सकारात्मक ऊर्जा, समृद्धि और सुख लाता है। इसीलिए हमारे
              पूर्वज नक्षत्र, राशि और ग्रहों की स्थिति को ध्यान में रखकर नाम चुनते थे।
            </p>
            <p style={s.p}>
              <strong>लड़के के नाम</strong> चुनते समय माता-पिता अक्सर संस्कृत के उन शब्दों को
              प्राथमिकता देते हैं जो शक्ति, ज्ञान, साहस और भक्ति को दर्शाते हैं — जैसे aarav
              (आरव), Vihaan (विहान), Rudra (रुद्र), और Atharv (अथर्व)। ये नाम प्राचीन
              शास्त्रों से लिए गए हैं और इनका अर्थ गहरा और अर्थपूर्ण है।
            </p>
            <p style={s.p}>
              <strong>लड़की के नाम</strong> चुनते समय देवी-देवताओं के नाम, प्रकृति की
              सुंदरता और स्त्री-शक्ति से प्रेरित नाम लोकप्रिय होते हैं — जैसे Saanvi (साँवी),
              Aadya (आद्या), Avani (अवनि) और Tara (तारा)। ये नाम इस 2026 में सबसे अधिक
              पसंद किए जा रहे हैं।
            </p>
            <p style={s.p}>
              <strong>नक्षत्र के अनुसार नाम</strong> रखने की परंपरा ज्योतिष विज्ञान पर आधारित है।
              27 नक्षत्रों में से प्रत्येक के लिए विशेष अक्षर (नामाक्षर) निर्धारित होते हैं।
              बच्चे की जन्म तारीख और समय से उसका नक्षत्र निकाला जाता है, फिर उसी अक्षर से
              शुरू होने वाला नाम सबसे शुभ माना जाता है। Namaah का नक्षत्र कैलकुलेटर इसी सिद्धांत
              पर काम करता है।
            </p>
            <p style={s.p}>
              इसी प्रकार, <strong>राशि का नाम</strong> — यानी चन्द्रमा की राशि के आधार पर नाम
              चुनना — एक और महत्वपूर्ण Vedic परंपरा है। मेष, वृषभ, मिथुन, कर्क और बाकी 8
              राशियों में से प्रत्येक के लिए खास अक्षर और नाम होते हैं। Namaah पर आप सभी 12
              राशियों के अनुसार नाम खोज सकते हैं, हिंदी अर्थ और नक्षत्र जानकारी के साथ।
            </p>
          </div>
        </div>
      </section>

      {/* ── Trending name cards ──────────────────────────────────────────── */}
      <section style={s.trendSection} className="hindi-trend-section" aria-label="अभी के लोकप्रिय नाम">
        <div style={s.trendHeader}>
          <h2 style={s.trendTitle}>अभी के लोकप्रिय नाम</h2>
          <p style={s.trendTitleEn}>Currently trending names</p>
        </div>

        <div style={s.trendGrid} className="hindi-trend-grid">
          {TRENDING_NAMES.map((n) => (
            <NameCard key={n.id} name={n} />
          ))}
        </div>

        <div style={s.trendMore}>
          <Link href="/trending" style={s.moreBtn}>
            सभी नाम देखें — View all trending names →
          </Link>
        </div>
      </section>

      {/* ── Quick links ──────────────────────────────────────────────────── */}
      <section style={s.quickLinks} className="hindi-quick-links" aria-label="Quick links in Hindi">
        <div style={s.quickInner} className="hindi-quick-grid">
          {[
            { label: "मेष राशि के नाम",     href: "/rashi/mesha" },
            { label: "वृषभ राशि के नाम",    href: "/rashi/vrishabha" },
            { label: "मिथुन राशि के नाम",   href: "/rashi/mithuna" },
            { label: "कर्क राशि के नाम",    href: "/rashi/karka" },
            { label: "सिंह राशि के नाम",    href: "/rashi/simha" },
            { label: "कन्या राशि के नाम",   href: "/rashi/kanya" },
            { label: "तुला राशि के नाम",    href: "/rashi/tula" },
            { label: "वृश्चिक राशि के नाम", href: "/rashi/vrischika" },
            { label: "धनु राशि के नाम",     href: "/rashi/dhanu" },
            { label: "मकर राशि के नाम",     href: "/rashi/makara" },
            { label: "कुंभ राशि के नाम",    href: "/rashi/kumbha" },
            { label: "मीन राशि के नाम",     href: "/rashi/meena" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={s.quickLink}>
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  // Hero
  hero: {
    backgroundColor: "#FDF4EE",
    padding:         "48px 48px 36px",
    borderBottom:    "1px solid #EEE4DA",
  },
  eyebrow: {
    fontFamily:    "var(--font-body), 'DM Sans', sans-serif",
    fontSize:      "11px",
    fontWeight:    500,
    letterSpacing: "0.1em",
    color:         "#C8601A",
    textTransform: "uppercase" as const,
    margin:        "0 0 12px",
  },
  heroTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "40px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 10px",
    lineHeight:  1.2,
  },
  heroSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "16px",
    color:      "#4A4A6A",
    margin:     "0 0 4px",
    lineHeight: 1.5,
  },
  heroSubEn: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "13px",
    color:      "#9898A8",
    margin:     0,
    fontStyle:  "italic",
  },

  // 4 category cards
  cardSection: {
    padding: "40px 48px",
  },
  cardGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap:                 "16px",
  },
  card: {
    display:        "flex",
    flexDirection:  "column" as const,
    border:         "1px solid #E8ECF5",
    borderRadius:   "14px",
    overflow:       "hidden",
    textDecoration: "none",
    transition:     "box-shadow 0.18s ease, transform 0.15s ease",
    cursor:         "pointer",
  },
  cardTop: {
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    height:          "72px",
  },
  cardIcon: {
    fontSize: "32px",
    lineHeight: 1,
  },
  cardBody: {
    padding:         "16px 18px 18px",
    backgroundColor: "#ffffff",
    display:         "flex",
    flexDirection:   "column" as const,
    gap:             "3px",
    flex:            1,
  },
  cardTitle: {
    fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:   "22px",
    fontWeight: 600,
    margin:     0,
    lineHeight: 1.15,
  },
  cardTitleEn: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "11px",
    color:       "#9898A8",
    margin:      "0 0 6px",
    fontStyle:   "italic",
  },
  cardSub: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#6B6B80",
    margin:     "0 0 10px",
    lineHeight: 1.5,
  },
  cardCta: {
    fontFamily:  "var(--font-body), 'DM Sans', sans-serif",
    fontSize:    "12px",
    fontWeight:  500,
    marginTop:   "auto",
  },

  // SEO paragraph
  seoSection: {
    padding:         "40px 48px",
    backgroundColor: "#F8F8F6",
    borderTop:       "1px solid #E8ECF5",
  },
  seoInner: {
    maxWidth: "720px",
  },
  seoTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "26px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 20px",
  },
  seoPara: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           "16px",
  },
  p: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "15px",
    color:      "#4A4A6A",
    lineHeight: 1.85,
    margin:     0,
  },

  // Trending section
  trendSection: {
    padding: "40px 48px 48px",
  },
  trendHeader: {
    marginBottom: "24px",
  },
  trendTitle: {
    fontFamily:  "var(--font-display), 'Cormorant Garamond', serif",
    fontSize:    "26px",
    fontWeight:  600,
    color:       "#2E3A5C",
    margin:      "0 0 4px",
  },
  trendTitleEn: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize:   "12px",
    color:      "#9898A8",
    margin:     0,
    fontStyle:  "italic",
  },
  trendGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "14px",
  },
  trendMore: {
    marginTop:      "28px",
    display:        "flex",
    justifyContent: "center",
  },
  moreBtn: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    fontWeight:      500,
    color:           "#C8601A",
    border:          "1px solid #C8601A",
    borderRadius:    "8px",
    padding:         "10px 24px",
    textDecoration:  "none",
    transition:      "all 0.15s ease",
  },

  // Quick Rashi links
  quickLinks: {
    padding:         "32px 48px 40px",
    backgroundColor: "#FDFCFA",
    borderTop:       "1px solid #E8ECF5",
  },
  quickInner: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:                 "10px",
  },
  quickLink: {
    fontFamily:      "var(--font-body), 'DM Sans', sans-serif",
    fontSize:        "13px",
    color:           "#4A5A82",
    textDecoration:  "none",
    padding:         "10px 14px",
    backgroundColor: "#ffffff",
    border:          "1px solid #E8ECF5",
    borderRadius:    "8px",
    transition:      "border-color 0.15s ease, color 0.15s ease",
    lineHeight:      1.4,
  },
};
