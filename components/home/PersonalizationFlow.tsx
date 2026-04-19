"use client";

import { useState } from "react";
import { NAKSHATRA_LIST } from "@/data/nakshatra";

export interface UserProfile {
  gender: string;           // "boy", "girl", "both", "skip"
  priorities: string[];     // e.g. ["nakshatra", "meaning"]
  hasNakshatra: boolean;
  nakshatra: string | null;
}

export default function PersonalizationFlow({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Profile State
  const [gender, setGender] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [hasNakshatra, setHasNakshatra] = useState<boolean | null>(null);
  const [nakshatra, setNakshatra] = useState<string>("");

  const advanceStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    setIsAnimating(true);
    const profile: UserProfile = {
      gender,
      priorities,
      hasNakshatra: hasNakshatra || false,
      nakshatra: hasNakshatra ? nakshatra : null,
    };
    try {
      localStorage.setItem("namaah-profile", JSON.stringify(profile));
    } catch {}
    
    setTimeout(() => {
      onComplete(profile);
    }, 400); // Wait for upward exit animation
  };

  // --- UI Renders ---

  const renderStep1 = () => (
    <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
      <h2 style={styles.questionHeading}>I am looking for names for my...</h2>
      <div style={styles.grid2x2}>
        {[
          { id: "boy", label: "Boy", hindi: "बालक" },
          { id: "girl", label: "Girl", hindi: "बालिका" },
          { id: "both", label: "Both / Not sure yet", hindi: "दोनो" },
          { id: "skip", label: "Prefer not to say", hindi: "स्किप" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setGender(opt.id);
              advanceStep();
            }}
            style={styles.cardBtn}
            className="hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span style={styles.cardHindi}>{opt.hindi}</span>
            <span style={styles.cardLabel}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const PRIORITY_OPTIONS = [
    { id: "astrology", label: "Nakshatra / astrology match" },
    { id: "meaning", label: "Deep meaning and story" },
    { id: "short", label: "Short and globally easy" },
    { id: "rare", label: "Rare and unique" },
    { id: "mythology", label: "Rooted in mythology" },
    { id: "modern", label: "Modern and contemporary" },
  ];

  const handlePriorityToggle = (id: string) => {
    setPriorities((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const renderStep2 = () => (
    <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
      <h2 style={styles.questionHeading}>What matters most to you in a name?</h2>
      <p style={styles.subtext}>Select up to 2</p>
      
      <div style={styles.pillsContainer}>
        {PRIORITY_OPTIONS.map((opt) => {
          const isSelected = priorities.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => handlePriorityToggle(opt.id)}
              style={{
                ...styles.pillBtn,
                borderColor: isSelected ? "#C8601A" : "#E8ECF5",
                backgroundColor: isSelected ? "#FDF4EE" : "#FFFFFF",
                color: isSelected ? "#C8601A" : "#2E3A5C",
              }}
              className="active:scale-95 transition-all"
            >
              <span style={{ display: 'inline-block', marginRight: '6px' }}>○</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button
          onClick={advanceStep}
          disabled={priorities.length === 0}
          style={{
            ...styles.primaryBtn,
            opacity: priorities.length === 0 ? 0.5 : 1,
            cursor: priorities.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
      <h2 style={styles.questionHeading}>Do you have your baby&apos;s birth date and time?</h2>
      <p style={styles.subtext}>(For exact Nakshatra matching)</p>

      {hasNakshatra === null && (
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
          <button onClick={() => setHasNakshatra(true)} style={styles.primaryBtn} className="hover:scale-[1.02] active:scale-95 transition-all">
            Yes, I have it &rarr;
          </button>
          <button onClick={() => handleComplete()} style={styles.secondaryBtn} className="hover:scale-[1.02] active:scale-95 transition-all">
            Skip for now, browse all names
          </button>
        </div>
      )}

      {hasNakshatra === null && (
        <p style={{ ...styles.subtext, marginTop: "16px", fontSize: "12px", color: "#9898A8" }}>
          You can find your birth star anytime from our Nakshatra Finder.
        </p>
      )}

      {hasNakshatra === true && (
        <div style={{ marginTop: "24px", maxWidth: "400px", margin: "24px auto 0" }}>
          <label style={styles.label}>Select Nakshatra</label>
          <select
            value={nakshatra}
            onChange={(e) => setNakshatra(e.target.value)}
            style={styles.selectInput}
          >
            <option value="" disabled>Choose your star...</option>
            {NAKSHATRA_LIST.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.nameHindi})
              </option>
            ))}
          </select>
          
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={handleComplete}
              disabled={!nakshatra}
              style={{
                ...styles.primaryBtn,
                opacity: !nakshatra ? 0.5 : 1,
                cursor: !nakshatra ? "not-allowed" : "pointer",
              }}
            >
              See my names
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section 
      style={{ ...styles.container }} 
      className={`transition-all duration-500 ease-in-out ${isAnimating && step === 3 && hasNakshatra !== null ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}
    >
      <div style={styles.progressWrap}>
        <span style={styles.progressText}>Step {step} of 3</span>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <div style={styles.contentWrap}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#FDF4EE",
    width: "100%",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrap: {
    width: "100%",
    maxWidth: "500px",
    marginBottom: "32px",
    textAlign: "center",
  },
  progressText: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "12px",
    color: "#6B6B80",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 500,
    display: "block",
    marginBottom: "8px",
  },
  progressBarBg: {
    width: "100%",
    height: "4px",
    backgroundColor: "#E8ECF5",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#C8601A",
    transition: "width 0.4s ease",
  },
  contentWrap: {
    width: "100%",
    maxWidth: "500px",
    minHeight: "280px",
  },
  questionHeading: {
    fontFamily: "var(--font-display), serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#2E3A5C",
    textAlign: "center",
    marginBottom: "8px",
    lineHeight: 1.2,
  },
  subtext: {
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    color: "#6B6B80",
    textAlign: "center",
    marginBottom: "24px",
  },
  grid2x2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "24px",
  },
  cardBtn: {
    backgroundColor: "#FFFFFF",
    border: "1.5px solid #E8ECF5",
    borderRadius: "12px",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    minHeight: "100px",
  },
  cardHindi: {
    fontSize: "28px",
    color: "#4A5A82",
    marginBottom: "8px",
    fontFamily: "var(--font-body), sans-serif",
  },
  cardLabel: {
    fontFamily: "var(--font-body), sans-serif",
    fontWeight: 500,
    color: "#2E3A5C",
    fontSize: "15px",
  },
  pillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginTop: "24px",
  },
  pillBtn: {
    padding: "12px 20px",
    borderRadius: "30px",
    border: "1.5px solid",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  primaryBtn: {
    backgroundColor: "#2E3A5C",
    color: "#FFFFFF",
    padding: "14px 28px",
    borderRadius: "8px",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "15px",
    fontWeight: 500,
    border: "none",
  },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    color: "#2E3A5C",
    border: "1.5px solid #E8ECF5",
    padding: "14px 28px",
    borderRadius: "8px",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "15px",
    fontWeight: 500,
  },
  label: {
    display: "block",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "12px",
    color: "#6B6B80",
    marginBottom: "8px",
    fontWeight: 500,
  },
  selectInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "1.5px solid #E8ECF5",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "15px",
    color: "#1A1A2E",
    backgroundColor: "#FFFFFF",
    outline: "none",
  },
};
