// ─────────────────────────────────────────────────────────────────────────────
// /data/nakshatra.ts
// Complete Vedic Nakshatra & Rashi reference system for the Namaah name finder.
// All syllable (akshar) data is sourced from classical Vedic astrology texts.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Nakshatra {
  /** Unique slug id, e.g. "ashwini" */
  id: string;
  /** English name */
  name: string;
  /** Devanagari name */
  nameHindi: string;
  /** English meaning */
  meaning: string;
  /** Vedic ruling planet */
  rulingPlanet: string;
  /** Associated Rashi (zodiac sign) – name in English */
  rashi: string;
  /** Associated Rashi in Devanagari */
  rashiHindi: string;
  /**
   * Vedic birth syllables (namaaksharas) for this nakshatra.
   * These are the sounds traditionally used to start a baby's name
   * based on the moon's position at birth.
   */
  syllables: string[];
  /** Presiding deity */
  deity: string;
  /** Sequential number 1–27 */
  number: number;
}

export interface Rashi {
  /** Unique slug id, e.g. "mesha" */
  id: string;
  /** English name */
  name: string;
  /** Devanagari name */
  nameHindi: string;
  /** Western zodiac equivalent */
  westernSign: string;
  /** Vedic ruling planet */
  rulingPlanet: string;
  /** Classical element */
  element: "Fire" | "Earth" | "Air" | "Water";
  /** Starting letters/syllables associated with this rashi */
  startLetters: string[];
  /** Short description */
  description: string;
}

// ─── 1. NAKSHATRA_LIST ───────────────────────────────────────────────────────
// All 27 Nakshatras with accurate Vedic namaakshara (birth syllable) data.
// Syllables follow the classical Parashari tradition used across North &
// South India. Each nakshatra has 4 padas (quarters); the syllable array
// lists one representative sound per pada.

export const NAKSHATRA_LIST: Nakshatra[] = [
  {
    number: 1,
    id: "ashwini",
    name: "Ashwini",
    nameHindi: "अश्विनी",
    meaning: "Horse woman; born of horse",
    rulingPlanet: "Ketu",
    rashi: "Mesha",
    rashiHindi: "मेष",
    syllables: ["Chu", "Che", "Cho", "La"],
    deity: "Ashwini Kumaras (divine physicians)",
  },
  {
    number: 2,
    id: "bharani",
    name: "Bharani",
    nameHindi: "भरणी",
    meaning: "She who bears; the bearer",
    rulingPlanet: "Venus",
    rashi: "Mesha",
    rashiHindi: "मेष",
    syllables: ["Li", "Lu", "Le", "Lo"],
    deity: "Yama (god of death and dharma)",
  },
  {
    number: 3,
    id: "krittika",
    name: "Krittika",
    nameHindi: "कृत्तिका",
    meaning: "The cutter; the Pleiades",
    rulingPlanet: "Sun",
    rashi: "Mesha / Vrishabha",
    rashiHindi: "मेष / वृषभ",
    syllables: ["A", "I", "U", "E"],
    deity: "Agni (god of fire)",
  },
  {
    number: 4,
    id: "rohini",
    name: "Rohini",
    nameHindi: "रोहिणी",
    meaning: "The red one; the growing one",
    rulingPlanet: "Moon",
    rashi: "Vrishabha",
    rashiHindi: "वृषभ",
    syllables: ["O", "Va", "Vi", "Vu"],
    deity: "Brahma / Prajapati (the creator)",
  },
  {
    number: 5,
    id: "mrigashira",
    name: "Mrigashira",
    nameHindi: "मृगशिरा",
    meaning: "Deer's head; the gentle one",
    rulingPlanet: "Mars",
    rashi: "Vrishabha / Mithuna",
    rashiHindi: "वृषभ / मिथुन",
    syllables: ["Ve", "Vo", "Ka", "Ki"],
    deity: "Soma (the moon god)",
  },
  {
    number: 6,
    id: "ardra",
    name: "Ardra",
    nameHindi: "आर्द्रा",
    meaning: "Moist; the fresh one; green",
    rulingPlanet: "Rahu",
    rashi: "Mithuna",
    rashiHindi: "मिथुन",
    syllables: ["Ku", "Gha", "Ng", "Chha"],
    deity: "Rudra (the storm god, fierce form of Shiva)",
  },
  {
    number: 7,
    id: "punarvasu",
    name: "Punarvasu",
    nameHindi: "पुनर्वसु",
    meaning: "Return of the light; good again",
    rulingPlanet: "Jupiter",
    rashi: "Mithuna / Karka",
    rashiHindi: "मिथुन / कर्क",
    syllables: ["Ke", "Ko", "Ha", "Hi"],
    deity: "Aditi (mother of the gods)",
  },
  {
    number: 8,
    id: "pushya",
    name: "Pushya",
    nameHindi: "पुष्य",
    meaning: "Nourisher; the flower",
    rulingPlanet: "Saturn",
    rashi: "Karka",
    rashiHindi: "कर्क",
    syllables: ["Hu", "He", "Ho", "Da"],
    deity: "Brihaspati (Jupiter, teacher of the gods)",
  },
  {
    number: 9,
    id: "ashlesha",
    name: "Ashlesha",
    nameHindi: "आश्लेषा",
    meaning: "The embracer; the clinging star",
    rulingPlanet: "Mercury",
    rashi: "Karka",
    rashiHindi: "कर्क",
    syllables: ["Di", "Du", "De", "Do"],
    deity: "Nagas (serpent deities)",
  },
  {
    number: 10,
    id: "magha",
    name: "Magha",
    nameHindi: "मघा",
    meaning: "The mighty; the great gift",
    rulingPlanet: "Ketu",
    rashi: "Simha",
    rashiHindi: "सिंह",
    syllables: ["Ma", "Mi", "Mu", "Me"],
    deity: "Pitrs (ancestral spirits)",
  },
  {
    number: 11,
    id: "purva-phalguni",
    name: "Purva Phalguni",
    nameHindi: "पूर्व फाल्गुनी",
    meaning: "The former red one; fig tree",
    rulingPlanet: "Venus",
    rashi: "Simha",
    rashiHindi: "सिंह",
    syllables: ["Mo", "Ta", "Ti", "Tu"],
    deity: "Bhaga (god of prosperity and marital bliss)",
  },
  {
    number: 12,
    id: "uttara-phalguni",
    name: "Uttara Phalguni",
    nameHindi: "उत्तर फाल्गुनी",
    meaning: "The latter red one; patronage",
    rulingPlanet: "Sun",
    rashi: "Simha / Kanya",
    rashiHindi: "सिंह / कन्या",
    syllables: ["Te", "To", "Pa", "Pi"],
    deity: "Aryaman (god of nobility and contracts)",
  },
  {
    number: 13,
    id: "hasta",
    name: "Hasta",
    nameHindi: "हस्त",
    meaning: "The hand; the skilled craftsman",
    rulingPlanet: "Moon",
    rashi: "Kanya",
    rashiHindi: "कन्या",
    syllables: ["Pu", "Sha", "Na", "Tha"],
    deity: "Savitar / Surya (the sun as the motivator)",
  },
  {
    number: 14,
    id: "chitra",
    name: "Chitra",
    nameHindi: "चित्रा",
    meaning: "Brilliant; the bright jewel",
    rulingPlanet: "Mars",
    rashi: "Kanya / Tula",
    rashiHindi: "कन्या / तुला",
    syllables: ["Pe", "Po", "Ra", "Ri"],
    deity: "Vishwakarma / Tvashtr (divine architect)",
  },
  {
    number: 15,
    id: "swati",
    name: "Swati",
    nameHindi: "स्वाति",
    meaning: "The independent one; sword",
    rulingPlanet: "Rahu",
    rashi: "Tula",
    rashiHindi: "तुला",
    syllables: ["Ru", "Re", "Ro", "Ta"],
    deity: "Vayu (god of wind)",
  },
  {
    number: 16,
    id: "vishakha",
    name: "Vishakha",
    nameHindi: "विशाखा",
    meaning: "Forked branch; the achiever",
    rulingPlanet: "Jupiter",
    rashi: "Tula / Vrischika",
    rashiHindi: "तुला / वृश्चिक",
    syllables: ["Ti", "Tu", "Te", "To"],
    deity: "Indra-Agni (dual deity of power and fire)",
  },
  {
    number: 17,
    id: "anuradha",
    name: "Anuradha",
    nameHindi: "अनुराधा",
    meaning: "Following Radha; success after radiance",
    rulingPlanet: "Saturn",
    rashi: "Vrischika",
    rashiHindi: "वृश्चिक",
    syllables: ["Na", "Ni", "Nu", "Ne"],
    deity: "Mitra (god of friendship and contracts)",
  },
  {
    number: 18,
    id: "jyeshtha",
    name: "Jyeshtha",
    nameHindi: "ज्येष्ठा",
    meaning: "The eldest; the most senior",
    rulingPlanet: "Mercury",
    rashi: "Vrischika",
    rashiHindi: "वृश्चिक",
    syllables: ["No", "Ya", "Yi", "Yu"],
    deity: "Indra (king of the gods)",
  },
  {
    number: 19,
    id: "mula",
    name: "Mula",
    nameHindi: "मूल",
    meaning: "The root; the foundation",
    rulingPlanet: "Ketu",
    rashi: "Dhanu",
    rashiHindi: "धनु",
    syllables: ["Ye", "Yo", "Bha", "Bhi"],
    deity: "Nirriti (goddess of dissolution and calamity)",
  },
  {
    number: 20,
    id: "purva-ashadha",
    name: "Purva Ashadha",
    nameHindi: "पूर्वाषाढ़ा",
    meaning: "The early victory; the invincible",
    rulingPlanet: "Venus",
    rashi: "Dhanu",
    rashiHindi: "धनु",
    syllables: ["Bhu", "Dha", "Pha", "Dha"],
    deity: "Apas (goddess of water and rain)",
  },
  {
    number: 21,
    id: "uttara-ashadha",
    name: "Uttara Ashadha",
    nameHindi: "उत्तराषाढ़ा",
    meaning: "The latter victory; the lasting triumph",
    rulingPlanet: "Sun",
    rashi: "Dhanu / Makara",
    rashiHindi: "धनु / मकर",
    syllables: ["Bhe", "Bho", "Ja", "Ji"],
    deity: "Vishvadevas (ten universal gods)",
  },
  {
    number: 22,
    id: "shravana",
    name: "Shravana",
    nameHindi: "श्रवण",
    meaning: "Hearing; learning; the listener",
    rulingPlanet: "Moon",
    rashi: "Makara",
    rashiHindi: "मकर",
    syllables: ["Khi", "Khu", "Khe", "Kho"],
    deity: "Vishnu (the preserver)",
  },
  {
    number: 23,
    id: "dhanishtha",
    name: "Dhanishtha",
    nameHindi: "धनिष्ठा",
    meaning: "Wealthiest; most famous; swift",
    rulingPlanet: "Mars",
    rashi: "Makara / Kumbha",
    rashiHindi: "मकर / कुंभ",
    syllables: ["Ga", "Gi", "Gu", "Ge"],
    deity: "Eight Vasus (elemental deities)",
  },
  {
    number: 24,
    id: "shatabhisha",
    name: "Shatabhisha",
    nameHindi: "शतभिषा",
    meaning: "A hundred physicians; a hundred stars",
    rulingPlanet: "Rahu",
    rashi: "Kumbha",
    rashiHindi: "कुंभ",
    syllables: ["Go", "Sa", "Si", "Su"],
    deity: "Varuna (god of cosmic order and healing waters)",
  },
  {
    number: 25,
    id: "purva-bhadrapada",
    name: "Purva Bhadrapada",
    nameHindi: "पूर्व भाद्रपद",
    meaning: "Former auspicious feet; the burning pair",
    rulingPlanet: "Jupiter",
    rashi: "Kumbha / Meena",
    rashiHindi: "कुंभ / मीन",
    syllables: ["Se", "So", "Da", "Di"],
    deity: "Ajaikapada (the one-footed goat, serpent of the deep)",
  },
  {
    number: 26,
    id: "uttara-bhadrapada",
    name: "Uttara Bhadrapada",
    nameHindi: "उत्तर भाद्रपद",
    meaning: "Latter auspicious feet; the warrior star",
    rulingPlanet: "Saturn",
    rashi: "Meena",
    rashiHindi: "मीन",
    syllables: ["Du", "Tha", "Jha", "Tra"],
    deity: "Ahir Budhnya (the serpent of the deep sea)",
  },
  {
    number: 27,
    id: "revati",
    name: "Revati",
    nameHindi: "रेवती",
    meaning: "Wealthy; prosperous; the nourishing one",
    rulingPlanet: "Mercury",
    rashi: "Meena",
    rashiHindi: "मीन",
    syllables: ["De", "Do", "Cha", "Chi"],
    deity: "Pushan (god of journeys, nourishment, and cattle)",
  },
];

// ─── 2. RASHI_LIST ───────────────────────────────────────────────────────────
// All 12 Rashis (Vedic zodiac signs) with associated Nakshatra syllables and
// key characteristics. startLetters lists the most common initial sounds
// for names born under that Rashi.

export const RASHI_LIST: Rashi[] = [
  {
    id: "mesha",
    name: "Mesha",
    nameHindi: "मेष",
    westernSign: "Aries",
    rulingPlanet: "Mars",
    element: "Fire",
    startLetters: ["A", "L", "E", "I", "Chu", "Che", "Cho", "Li", "Lu", "Le", "Lo"],
    description:
      "Mesha (Aries) is the first Rashi of the zodiac, ruled by Mars. People born under Mesha are energetic, pioneering, and courageous. They are natural leaders with a strong drive and independent spirit.",
  },
  {
    id: "vrishabha",
    name: "Vrishabha",
    nameHindi: "वृषभ",
    westernSign: "Taurus",
    rulingPlanet: "Venus",
    element: "Earth",
    startLetters: ["O", "Va", "Vi", "Vu", "Ve", "Vo", "Ka", "Ki", "B", "W", "U"],
    description:
      "Vrishabha (Taurus) is ruled by Venus, the planet of beauty and luxury. Those born under this sign are patient, reliable, and deeply connected to the material and sensory world. They value stability, comfort, and artistic expression.",
  },
  {
    id: "mithuna",
    name: "Mithuna",
    nameHindi: "मिथुन",
    westernSign: "Gemini",
    rulingPlanet: "Mercury",
    element: "Air",
    startLetters: ["Ka", "Ki", "Ke", "Ko", "Ha", "Hi", "Ku", "Gha", "Gh", "Ch"],
    description:
      "Mithuna (Gemini) is ruled by Mercury and embodies duality, communication, and adaptability. Mithuna natives are intellectually curious, witty, and sociable. They excel in fields requiring communication and mental agility.",
  },
  {
    id: "karka",
    name: "Karka",
    nameHindi: "कर्क",
    westernSign: "Cancer",
    rulingPlanet: "Moon",
    element: "Water",
    startLetters: ["Hi", "Hu", "He", "Ho", "Da", "Di", "Du", "De", "Do", "D", "H"],
    description:
      "Karka (Cancer) is ruled by the Moon and is associated with nurturing, intuition, and emotional depth. Karka natives are deeply empathetic, protective, and home-oriented, with strong ties to family and tradition.",
  },
  {
    id: "simha",
    name: "Simha",
    nameHindi: "सिंह",
    westernSign: "Leo",
    rulingPlanet: "Sun",
    element: "Fire",
    startLetters: ["Ma", "Mi", "Mu", "Me", "Mo", "Ta", "Ti", "Tu", "Te", "To", "M", "T"],
    description:
      "Simha (Leo) is ruled by the Sun, signifying royalty, authority, and magnanimity. Those born under Simha are naturally charismatic, creative, and generous leaders who thrive in the spotlight and inspire others.",
  },
  {
    id: "kanya",
    name: "Kanya",
    nameHindi: "कन्या",
    westernSign: "Virgo",
    rulingPlanet: "Mercury",
    element: "Earth",
    startLetters: ["Pa", "Pi", "Pu", "Sha", "Na", "Tha", "Pe", "Po", "Ra", "Ri", "P", "N"],
    description:
      "Kanya (Virgo) is ruled by Mercury and is the sign of precision, service, and discernment. Kanya natives are analytical, health-conscious, and deeply committed to improvement — both of themselves and the world around them.",
  },
  {
    id: "tula",
    name: "Tula",
    nameHindi: "तुला",
    westernSign: "Libra",
    rulingPlanet: "Venus",
    element: "Air",
    startLetters: ["Ra", "Ri", "Ru", "Re", "Ro", "Ta", "Ti", "Tu", "Te", "To", "R"],
    description:
      "Tula (Libra) is ruled by Venus and represents balance, justice, and harmony. Tula natives have a refined aesthetic sense, a gift for diplomacy, and an innate desire for fairness. They thrive in partnerships and creative environments.",
  },
  {
    id: "vrischika",
    name: "Vrischika",
    nameHindi: "वृश्चिक",
    westernSign: "Scorpio",
    rulingPlanet: "Mars",
    element: "Water",
    startLetters: ["Na", "Ni", "Nu", "Ne", "No", "Ya", "Yi", "Yu", "N", "Y"],
    description:
      "Vrischika (Scorpio) is co-ruled by Mars and Ketu in Vedic astrology. These natives are intensely perceptive, willful, and transformative. They are drawn to the mysteries of life and possess extraordinary powers of regeneration.",
  },
  {
    id: "dhanu",
    name: "Dhanu",
    nameHindi: "धनु",
    westernSign: "Sagittarius",
    rulingPlanet: "Jupiter",
    element: "Fire",
    startLetters: ["Ye", "Yo", "Bha", "Bhi", "Bhu", "Dha", "Pha", "Bhe", "Bho", "Ja", "Ji", "Bh"],
    description:
      "Dhanu (Sagittarius) is ruled by Jupiter, the planet of wisdom and expansion. Dhanu natives are adventurous, philosophical, and optimistic. They have an insatiable thirst for knowledge and a deep love of freedom and truth.",
  },
  {
    id: "makara",
    name: "Makara",
    nameHindi: "मकर",
    westernSign: "Capricorn",
    rulingPlanet: "Saturn",
    element: "Earth",
    startLetters: ["Khi", "Khu", "Khe", "Kho", "Ga", "Gi", "Gu", "Ge", "Ja", "Ji", "Kh", "J"],
    description:
      "Makara (Capricorn) is ruled by Saturn and represents discipline, ambition, and pragmatism. Makara natives are hardworking, responsible, and goal-oriented. They build lasting structures in their personal and professional lives through patient effort.",
  },
  {
    id: "kumbha",
    name: "Kumbha",
    nameHindi: "कुंभ",
    westernSign: "Aquarius",
    rulingPlanet: "Saturn",
    element: "Air",
    startLetters: ["Ge", "Go", "Sa", "Si", "Su", "Se", "So", "Da", "Di", "S", "G"],
    description:
      "Kumbha (Aquarius) is ruled by Saturn and Rahu in Vedic astrology. These natives are humanitarian, innovative, and unconventional. They are visionaries who think ahead of their time and are deeply concerned with collective welfare.",
  },
  {
    id: "meena",
    name: "Meena",
    nameHindi: "मीन",
    westernSign: "Pisces",
    rulingPlanet: "Jupiter",
    element: "Water",
    startLetters: ["Di", "Du", "Tha", "Jha", "De", "Do", "Cha", "Chi", "Tra", "D", "Ch"],
    description:
      "Meena (Pisces) is ruled by Jupiter, and is the final, most spiritually oriented Rashi. Meena natives are compassionate, imaginative, and deeply intuitive. They bridge the material and spiritual worlds with grace and empathy.",
  },
];

// ─── 3. MONTH_NAKSHATRA_MAP ───────────────────────────────────────────────────
// Simplified solar Nakshatra lookup for each calendar month (Gregorian).
// Based on the approximate position of the Sun in sidereal (Vedic) terms.
// Each month is divided into early (days 1–14) and late (days 15–31) halves
// to capture the Sun's transit through ~2 Nakshatras per calendar month.
// NOT an exact astronomical calculation — use for v1 name-finder UI only.

export interface MonthNakshatraEntry {
  early: string;   // nakshatra id for days 1–14
  late: string;    // nakshatra id for days 15–end
  primary: string; // single best representative if only one is needed
}

export const MONTH_NAKSHATRA_MAP: Record<number, MonthNakshatraEntry> = {
  1:  { early: "uttara-ashadha",    late: "shravana",          primary: "shravana" },
  2:  { early: "dhanishtha",        late: "shatabhisha",       primary: "dhanishtha" },
  3:  { early: "purva-bhadrapada",  late: "uttara-bhadrapada", primary: "purva-bhadrapada" },
  4:  { early: "revati",            late: "ashwini",           primary: "ashwini" },
  5:  { early: "bharani",           late: "krittika",          primary: "rohini" },
  6:  { early: "rohini",            late: "mrigashira",        primary: "mrigashira" },
  7:  { early: "ardra",             late: "punarvasu",         primary: "ardra" },
  8:  { early: "pushya",            late: "ashlesha",          primary: "pushya" },
  9:  { early: "magha",             late: "purva-phalguni",    primary: "magha" },
  10: { early: "uttara-phalguni",   late: "hasta",             primary: "hasta" },
  11: { early: "chitra",            late: "swati",             primary: "chitra" },
  12: { early: "vishakha",          late: "anuradha",          primary: "vishakha" },
};

// ─── 4. getNakshatraFromDate ──────────────────────────────────────────────────
/**
 * Returns the most likely Nakshatra id for a given birth date.
 *
 * This is a simplified solar-based approximation for a v1 name-finder tool.
 * It is NOT a precise astronomical calculation (which requires exact birth
 * time and moon position). For precise calculations, a proper ephemeris
 * should be used.
 *
 * @param day   - Day of month (1–31)
 * @param month - Month number (1–12)
 * @returns     Nakshatra id string, e.g. "rohini"
 */
export function getNakshatraFromDate(day: number, month: number): string {
  if (month < 1 || month > 12) {
    throw new RangeError(`Month must be between 1 and 12. Received: ${month}`);
  }
  if (day < 1 || day > 31) {
    throw new RangeError(`Day must be between 1 and 31. Received: ${day}`);
  }

  const entry = MONTH_NAKSHATRA_MAP[month];
  return day <= 14 ? entry.early : entry.late;
}

/**
 * Returns the full Nakshatra object for a given birth date.
 * Returns undefined if not found (should not happen with valid input).
 */
export function getNakshatraObjectFromDate(
  day: number,
  month: number
): Nakshatra | undefined {
  const nakshatraId = getNakshatraFromDate(day, month);
  return NAKSHATRA_LIST.find((n) => n.id === nakshatraId);
}

// ─── 5. getNamesByNakshatra ───────────────────────────────────────────────────
/**
 * Filters any names array to return only names whose `nakshatra` field
 * matches the given nakshatra name (case-insensitive, partial match supported).
 *
 * @param nakshatra  - Full or partial nakshatra name, e.g. "Rohini"
 * @param namesArray - Array of name objects (from /data/names.ts or any source)
 * @returns Filtered array of matching name objects
 */
export function getNamesByNakshatra<T extends { nakshatra: string }>(
  nakshatra: string,
  namesArray: T[]
): T[] {
  if (!nakshatra || !nakshatra.trim()) return [];
  const query = nakshatra.trim().toLowerCase();
  return namesArray.filter((n) =>
    n.nakshatra.toLowerCase().includes(query)
  );
}

/**
 * Returns names that match the nakshatra derived from a birth date.
 * Combines getNakshatraFromDate with getNamesByNakshatra.
 *
 * @param day        - Day of month
 * @param month      - Month number (1–12)
 * @param namesArray - Array of name objects with a `nakshatra` field
 * @returns Filtered array of matching names
 */
export function getNamesByBirthDate<T extends { nakshatra: string }>(
  day: number,
  month: number,
  namesArray: T[]
): T[] {
  const nakshatraObj = getNakshatraObjectFromDate(day, month);
  if (!nakshatraObj) return [];
  return getNamesByNakshatra(nakshatraObj.name, namesArray);
}

// ─── Convenience Lookups ─────────────────────────────────────────────────────

/** Quick lookup: nakshatra id → Nakshatra object */
export const NAKSHATRA_BY_ID: Record<string, Nakshatra> =
  Object.fromEntries(NAKSHATRA_LIST.map((n) => [n.id, n]));

/** Quick lookup: rashi id → Rashi object */
export const RASHI_BY_ID: Record<string, Rashi> =
  Object.fromEntries(RASHI_LIST.map((r) => [r.id, r]));

/** Returns all Nakshatra ids that belong to a given rashi (handles "A / B" format) */
export function getNakshatrasByRashi(rashiId: string): Nakshatra[] {
  return NAKSHATRA_LIST.filter((n) =>
    n.rashi
      .toLowerCase()
      .split("/")
      .map((s) => s.trim())
      .some((s) => s === rashiId.toLowerCase())
  );
}

/** Returns all syllables across all Nakshatras of a given rashi */
export function getSyllablesByRashi(rashiId: string): string[] {
  const nakshatras = getNakshatrasByRashi(rashiId);
  return Array.from(new Set(nakshatras.flatMap((n) => n.syllables)));
}

// ─── Sanity Check (server-side only, strip in production) ────────────────────
if (typeof window === "undefined") {
  console.log(`✅ nakshatra.ts loaded`);
  console.log(`   Nakshatras : ${NAKSHATRA_LIST.length} (expected 27)`);
  console.log(`   Rashis     : ${RASHI_LIST.length} (expected 12)`);
  console.log(`   Month map  : ${Object.keys(MONTH_NAKSHATRA_MAP).length} entries (expected 12)`);
}
