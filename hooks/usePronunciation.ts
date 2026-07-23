"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// usePronunciation — Web Speech API hook
// ─────────────────────────────────────────────────────────────────────────────
// Returns { speak, stop, isSupported, isSpeaking }
//
// Voice priority: hi-IN → en-IN → en-US (any)
// Rate 0.85, Pitch 1.0 for clear Sanskrit pronunciation.

export interface UsePronunciationReturn {
  speak: () => void;
  stop: () => void;
  isSupported: boolean;
  isSpeaking: boolean;
}

export function usePronunciation(
  name: string,
  hindiName?: string
): UsePronunciationReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Detect support on mount (client-only)
  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" && "speechSynthesis" in window
    );
    // Sync speaking state if synthesis is cancelled externally
    const onEnd = () => setIsSpeaking(false);
    window.speechSynthesis?.addEventListener?.("voiceschanged", () => {}); // warm up
    return () => {
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  // ── Resolve best matching voice ─────────────────────────────────────────
  function resolveLang(): string {
    if (!isSupported) return "en-US";
    const voices = window.speechSynthesis.getVoices();
    const langs = ["hi-IN", "en-IN", "en-US"];
    for (const lang of langs) {
      if (voices.some((v) => v.lang.startsWith(lang.split("-")[0]) && v.lang.includes(lang.split("-")[1]))) {
        return lang;
      }
      // Looser match: just the base language
      if (voices.some((v) => v.lang.startsWith(lang.split("-")[0]))) {
        return lang;
      }
    }
    return "en-US";
  }

  const speak = useCallback(() => {
    if (!isSupported) return;

    // If currently speaking, stop first
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Prefer Hindi name for more accurate Sanskrit pronunciation
    const textToSpeak = hindiName || name;
    const lang = resolveLang();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    // Also speak the English name after Hindi if both are provided
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // If we spoke the Hindi name, also speak the English name for clarity
      if (hindiName && lang === "hi-IN") {
        const engUtterance = new SpeechSynthesisUtterance(name);
        engUtterance.lang = "en-IN";
        engUtterance.rate = 0.85;
        engUtterance.pitch = 1.0;
        engUtterance.onstart = () => setIsSpeaking(true);
        engUtterance.onend = () => setIsSpeaking(false);
        engUtterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(engUtterance);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, name, hindiName]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSupported, isSpeaking };
}
