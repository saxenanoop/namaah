// ─────────────────────────────────────────────────────────────────────────────
// phonetic.ts — Sanskrit/Hindi name → English phonetic guide
// ─────────────────────────────────────────────────────────────────────────────
// Converts common Sanskrit naming patterns to an easy-to-read phonetic string.
// Examples:
//   Aarav   → "AA-rav"
//   Vihaan  → "vi-HAAN"
//   Saanvi  → "SAAN-vee"
//   Aarohi  → "aa-ROH-hee"

// ── Digraph / cluster substitutions (order matters — longer first) ───────────
const SUBSTITUTIONS: [RegExp, string][] = [
  // Long-vowel digraphs (keep their phonetic label)
  [/aa/gi, "aa"],   // already correct label
  [/ee/gi, "ee"],
  [/oo/gi, "oo"],

  // Sanskrit aspirated / retroflex clusters
  [/shri/gi, "shree"],
  [/ksh/gi,  "ksh"],
  [/gya/gi,  "gya"],
  [/jn/gi,   "gy"],

  // Common digraphs (must come before single consonants)
  [/sh/gi,   "sh"],
  [/dh/gi,   "dh"],
  [/kh/gi,   "kh"],
  [/gh/gi,   "gh"],
  [/th/gi,   "th"],
  [/ph/gi,   "f"],
  [/bh/gi,   "bh"],
  [/ch/gi,   "ch"],
  [/zh/gi,   "zh"],

  // Final -a is typically silent or schwa in Sanskrit names
  // We handle this via syllabification logic below
];

// ── Vowel classification ────────────────────────────────────────────────────
const LONG_VOWEL_PATTERNS = /aa|ee|oo|[aeiou]{2}/i;

// ── Syllabify a name into segments ─────────────────────────────────────────
function syllabify(name: string): string[] {
  // Simple vowel-based syllabification for Indian names:
  // Split around vowel groups; each vowel group anchors a syllable.
  const syllables: string[] = [];
  let current = "";

  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    const isVowel = /[aeiouAEIOU]/.test(ch);
    current += ch;

    if (isVowel) {
      // Consume consecutive vowels (digraphs like aa, ee, oo)
      while (i + 1 < name.length && /[aeiouAEIOU]/.test(name[i + 1])) {
        i++;
        current += name[i];
      }
      // Consume trailing consonants until the next vowel
      while (
        i + 1 < name.length &&
        !/[aeiouAEIOU]/.test(name[i + 1]) &&
        i + 2 < name.length && // don't consume the last consonant if it precedes a vowel
        /[aeiouAEIOU]/.test(name[i + 2])
      ) {
        // only consume one coda consonant
        break;
      }
      syllables.push(current);
      current = "";
    }
  }
  if (current) syllables.push(current);
  return syllables.filter(Boolean);
}

// ── Determine the stressed syllable ────────────────────────────────────────
// Rule: stressed = the first syllable containing a long vowel (aa/ee/oo),
// otherwise the penultimate syllable (second-to-last) in Sanskrit names,
// or the first syllable for monosyllabic names.
function stressedIndex(syllables: string[]): number {
  if (syllables.length === 1) return 0;

  for (let i = 0; i < syllables.length; i++) {
    if (LONG_VOWEL_PATTERNS.test(syllables[i])) return i;
  }
  // Penultimate default
  return Math.max(0, syllables.length - 2);
}

// ── Format a syllable for display ──────────────────────────────────────────
function formatSyllable(syl: string, stressed: boolean): string {
  let s = syl.toLowerCase();

  // Apply substitutions
  for (const [pattern, replacement] of SUBSTITUTIONS) {
    s = s.replace(pattern, replacement);
  }

  return stressed ? s.toUpperCase() : s;
}

// ── Main export ────────────────────────────────────────────────────────────
/**
 * Converts a Sanskrit/Hindi name to an English phonetic guide string.
 * @param name  English-script name, e.g. "Aarohi"
 * @returns     Phonetic string, e.g. "aa-ROH-hee"
 */
export function toPhonetic(name: string): string {
  if (!name) return "";

  const syllables = syllabify(name);
  if (syllables.length === 0) return name.toLowerCase();

  const si = stressedIndex(syllables);
  return syllables.map((syl, i) => formatSyllable(syl, i === si)).join("-");
}

// ── Quick dictionary overrides for very common names ──────────────────────
// These are manually verified phonetics for the most popular names.
const OVERRIDES: Record<string, string> = {
  aarav:    "AA-rav",
  vihaan:   "vi-HAAN",
  saanvi:   "SAAN-vee",
  aarohi:   "aa-ROH-hee",
  arjun:    "AR-jun",
  ananya:   "a-NAN-ya",
  ishaan:   "i-SHAAN",
  advika:   "ad-VEE-ka",
  reyansh:  "reh-YANSH",
  anika:    "a-NEE-ka",
  kavya:    "KAV-ya",
  dhruv:    "DHRUV",
  riya:     "REE-ya",
  vivaan:   "vi-VAAN",
  shriya:   "SHREE-ya",
  divya:    "DIV-ya",
  lakshmi:  "LAKSH-mee",
  krishna:  "KRISH-na",
  ganesh:   "ga-NESH",
  priya:    "PREE-ya",
};

/**
 * Returns the phonetic guide for a name, using manual overrides where available.
 */
export function getPhonetic(name: string): string {
  const key = name.trim().toLowerCase();
  if (OVERRIDES[key]) return OVERRIDES[key];
  return toPhonetic(name);
}
