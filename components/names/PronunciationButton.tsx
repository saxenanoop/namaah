"use client";

import { useState } from "react";
import { usePronunciation } from "@/hooks/usePronunciation";
import { getPhonetic } from "@/utils/phonetic";

interface PronunciationButtonProps {
  name: string;
  hindiName?: string;
}

export function PronunciationButton({ name, hindiName }: PronunciationButtonProps) {
  const { speak, stop, isSupported, isSpeaking } = usePronunciation(name, hindiName);
  const [hasPlayed, setHasPlayed] = useState(false);

  const phonetic = getPhonetic(name);

  function handleClick() {
    if (isSpeaking) {
      stop();
    } else {
      speak();
      setHasPlayed(true);
    }
  }

  return (
    <div style={styles.wrapper}>
      {!isSupported ? (
        <button
          disabled
          style={{ ...styles.btn, ...styles.btnDisabled }}
          title="Audio not supported on this browser"
          aria-label="Audio not supported on this browser"
        >
          <span style={styles.icon}>▶</span>
          <span>Hear pronunciation</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          style={{
            ...styles.btn,
            ...(isSpeaking ? styles.btnActive : {}),
          }}
          aria-label={isSpeaking ? `Stop pronunciation of ${name}` : `Hear pronunciation of ${name}`}
          aria-pressed={isSpeaking}
          id="pronunciation-btn"
        >
          <span style={styles.icon}>{isSpeaking ? "◼" : "▶"}</span>
          <span>{isSpeaking ? "Stop" : "Hear pronunciation"}</span>
        </button>
      )}

      {/* Phonetic guide — always shown */}
      <div style={styles.phoneticRow}>
        <span style={styles.phoneticLabel}>Pronunciation:</span>
        <span style={styles.phoneticText}>{phonetic}</span>
      </div>

      {/* Post-play note */}
      {hasPlayed && !isSpeaking && isSupported && (
        <p style={styles.playedNote} aria-live="polite">
          🔊 Sanskrit names are best heard spoken aloud — share this name with family!
        </p>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 20px",
    height: "48px",          // Mobile-first 48px for easy tap
    border: "1.5px solid #C8601A",
    borderRadius: "10px",
    backgroundColor: "transparent",
    color: "#C8601A",
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
    letterSpacing: "0.01em",
    alignSelf: "flex-start",
  } as React.CSSProperties,
  btnActive: {
    backgroundColor: "#C8601A",
    color: "#ffffff",
  } as React.CSSProperties,
  btnDisabled: {
    border: "1.5px solid #D0D0DC",
    color: "#B0B0C0",
    cursor: "not-allowed",
    opacity: 0.55,
  } as React.CSSProperties,
  icon: {
    fontSize: "13px",
    flexShrink: 0,
  },
  phoneticRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  phoneticLabel: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    color: "#9898A8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: 500,
    flexShrink: 0,
  },
  phoneticText: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "14px",
    color: "#C8601A",
    fontWeight: 700,
    letterSpacing: "0.04em",
    backgroundColor: "#FDF0E8",
    padding: "2px 8px",
    borderRadius: "4px",
    border: "1px solid #F0D0B8",
  },
  playedNote: {
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontSize: "12px",
    color: "#6B6B80",
    margin: 0,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
};
