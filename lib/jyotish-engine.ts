// lib/jyotish-engine.ts
import SwissEph from "swisseph-wasm";

// --- DATA STRUCTURE INTERFACES ---

export interface AvakahadaChakra {
  rashi: string;
  rashiNe: string;
  rashiLord: string;
  rashiLordNe: string;
  nakshatra: string;
  nakshatraNe: string;
  nakshatraLord: string;
  nakshatraLordNe: string;
  pada: number;
  gana: "Deva" | "Manushya" | "Rakshasa";
  ganaNe: string;
  yoni: string;
  yoniNe: string;
  nadi: "Adi" | "Madhya" | "Antya";
  nadiNe: string;
  varna: "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra";
  varnaNe: string;
  paya: "Gold" | "Silver" | "Copper" | "Iron";
  payaNe: string;
}

export interface DetailedPlanet {
  id: number;
  name: string;
  nameNe: string;
  longitude: number;
  dms: string; // Deg° Min' Sec"
  signIndex: number;
  signName: string;
  signNameNe: string;
  signLord: string;
  signLordNe: string;
  house: number; // 1 to 12 in D1
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraNameNe: string;
  pada: number;
  isRetrograde: boolean;
  isCombust: boolean; // Asthangat
  d9SignIndex: number; // Sign position in Navamsha (D9)
  d9SignName: string;
  d9SignNameNe: string;
  aspects: PlanetAspect[]; // Aspects this planet casts
  aspectsReceived: PlanetAspect[]; // Aspects received by this planet
}

export interface PlanetAspect {
  fromPlanet: string;
  fromPlanetNe: string;
  fromHouse: number;
  toHouse: number;
  aspectType: string; // e.g., "7th aspect", "4th aspect", "Special aspect"
  aspectTypeNe: string;
  degreeDistance: number; // Degrees between the two planets
  isSpecial: boolean; // Whether this is a special aspect (Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th)
}

export interface DashaPeriod {
  planet: string;
  planetNe: string;
  startDate: string;
  endDate: string;
  durationYears: number;
}

export interface PanchangAtBirth {
  tithiName: string;
  tithiNameNe: string;
  tithiNumber: number;
  paksha: string;
  pakshaNe: string;
  nakshatra: string;
  nakshatraNe: string;
  yogaName: string;
  yogaNameNe: string;
  karanaName: string;
  karanaNameNe: string;
  dayOfWeek: string;
  dayOfWeekNe: string;
}

export interface DoshaAnalysis {
  isManglik: boolean;
  manglikDetailsNe: string;
  hasKalsarpa: boolean;
  kalsarpaDetailsNe: string;
}

export interface CompleteBirthChartReport {
  birthDetails: {
    gregorianDate: string;
    nepaliDate: {
      year: number;
      month: number;
      day: number;
    };
    latitude: number;
    longitude: number;
    ayanamshaDeg: string;
  };
  lagna: {
    signIndex: number;
    signName: string;
    signNameNe: string;
    dms: string;
    d9SignIndex: number;
    d9SignName: string;
    d9SignNameNe: string;
  };
  avakahada: AvakahadaChakra;
  panchang: PanchangAtBirth;
  planets: DetailedPlanet[];
  dashaTimeline: DashaPeriod[];
  doshas: DoshaAnalysis;
  d1Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 -> Planet names
  d9Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Navamsha
  d2Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Hora
  d3Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Drekkana
  d7Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Saptamsa
  d10Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Dashamsa
  d12Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Dwadasamsa
  d30Chart: Record<number, { name: string; nameNe: string }[]>; // House 1..12 in Trimsamsa
  aspects: Record<string, PlanetAspect[]>; // Aspects cast by each planet
  aspectsReceived: Record<string, PlanetAspect[]>; // Aspects received by each planet
}

// --- LOOKUP TABLES & ASTROLOGICAL CONSTANTS ---

const RASHIS = [
  { en: "Aries", ne: "मेष", lord: "Mars", lordNe: "मङ्गल", varna: "Kshatriya" },
  { en: "Taurus", ne: "वृष", lord: "Venus", lordNe: "शुक्र", varna: "Vaishya" },
  {
    en: "Gemini",
    ne: "मिथुन",
    lord: "Mercury",
    lordNe: "बुध",
    varna: "Shudra",
  },
  {
    en: "Cancer",
    ne: "कर्कट",
    lord: "Moon",
    lordNe: "चन्द्र",
    varna: "Brahmin",
  },
  { en: "Leo", ne: "सिंह", lord: "Sun", lordNe: "सूर्य", varna: "Kshatriya" },
  {
    en: "Virgo",
    ne: "कन्या",
    lord: "Mercury",
    lordNe: "बुध",
    varna: "Vaishya",
  },
  { en: "Libra", ne: "तुला", lord: "Venus", lordNe: "शुक्र", varna: "Shudra" },
  {
    en: "Scorpio",
    ne: "वृश्चिक",
    lord: "Mars",
    lordNe: "मङ्गल",
    varna: "Brahmin",
  },
  {
    en: "Sagittarius",
    ne: "धनु",
    lord: "Jupiter",
    lordNe: "गुरु",
    varna: "Kshatriya",
  },
  {
    en: "Capricorn",
    ne: "मकर",
    lord: "Saturn",
    lordNe: "शनि",
    varna: "Vaishya",
  },
  {
    en: "Aquarius",
    ne: "कुम्भ",
    lord: "Saturn",
    lordNe: "शनि",
    varna: "Shudra",
  },
  {
    en: "Pisces",
    ne: "मीन",
    lord: "Jupiter",
    lordNe: "गुरु",
    varna: "Brahmin",
  },
];

const NAKSHATRAS = [
  {
    en: "Ashwini",
    ne: "अश्विनी",
    lord: "Ketu",
    lordNe: "केतु",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Horse",
    yoniNe: "अश्व",
  },
  {
    en: "Bharani",
    ne: "भरणी",
    lord: "Venus",
    lordNe: "शुक्र",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Elephant",
    yoniNe: "गज",
  },
  {
    en: "Krittika",
    ne: "कृत्तिका",
    lord: "Sun",
    lordNe: "सूर्य",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Sheep",
    yoniNe: "मेष",
  },
  {
    en: "Rohini",
    ne: "रोहिणी",
    lord: "Moon",
    lordNe: "चन्द्र",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Serpent",
    yoniNe: "सर्प",
  },
  {
    en: "Mrigashira",
    ne: "मृगशिरा",
    lord: "Mars",
    lordNe: "मङ्गल",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Serpent",
    yoniNe: "सर्प",
  },
  {
    en: "Ardra",
    ne: "आर्द्रा",
    lord: "Rahu",
    lordNe: "राहु",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Dog",
    yoniNe: "श्वान",
  },
  {
    en: "Punarvasu",
    ne: "पुनर्वसु",
    lord: "Jupiter",
    lordNe: "गुरु",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Cat",
    yoniNe: "मार्जार",
  },
  {
    en: "Pushya",
    ne: "पुष्य",
    lord: "Saturn",
    lordNe: "शनि",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Goat",
    yoniNe: "अजा",
  },
  {
    en: "Ashlesha",
    ne: "अश्लेषा",
    lord: "Mercury",
    lordNe: "बुध",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Cat",
    yoniNe: "मार्जार",
  },
  {
    en: "Magha",
    ne: "मघा",
    lord: "Ketu",
    lordNe: "केतु",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Rat",
    yoniNe: "मूषक",
  },
  {
    en: "Purva Phalguni",
    ne: "पूर्वाफाल्गुनी",
    lord: "Venus",
    lordNe: "शुक्र",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Rat",
    yoniNe: "मूषक",
  },
  {
    en: "Uttara Phalguni",
    ne: "उत्तराफाल्गुनी",
    lord: "Sun",
    lordNe: "सूर्य",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Cow",
    yoniNe: "गौ",
  },
  {
    en: "Hasta",
    ne: "हस्त",
    lord: "Moon",
    lordNe: "चन्द्र",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Buffalo",
    yoniNe: "महिष",
  },
  {
    en: "Chitra",
    ne: "चित्रा",
    lord: "Mars",
    lordNe: "मङ्गल",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Tiger",
    yoniNe: "व्याघ्र",
  },
  {
    en: "Swati",
    ne: "स्वाती",
    lord: "Rahu",
    lordNe: "राहु",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Buffalo",
    yoniNe: "महिष",
  },
  {
    en: "Vishakha",
    ne: "विशाखा",
    lord: "Jupiter",
    lordNe: "गुरु",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Tiger",
    yoniNe: "व्याघ्र",
  },
  {
    en: "Anuradha",
    ne: "अनुराधा",
    lord: "Saturn",
    lordNe: "शनि",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Deer",
    yoniNe: "मृग",
  },
  {
    en: "Jyeshtha",
    ne: "ज्येष्ठा",
    lord: "Mercury",
    lordNe: "बुध",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Deer",
    yoniNe: "मृग",
  },
  {
    en: "Moola",
    ne: "मूल",
    lord: "Ketu",
    lordNe: "केतु",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Dog",
    yoniNe: "श्वान",
  },
  {
    en: "Purva Ashadha",
    ne: "पूर्वाषाढा",
    lord: "Venus",
    lordNe: "शुक्र",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Monkey",
    yoniNe: "वानर",
  },
  {
    en: "Uttara Ashadha",
    ne: "उत्तराषाढा",
    lord: "Sun",
    lordNe: "सूर्य",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Mongoose",
    yoniNe: "नकुल",
  },
  {
    en: "Shravana",
    ne: "श्रवण",
    lord: "Moon",
    lordNe: "चन्द्र",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Monkey",
    yoniNe: "वानर",
  },
  {
    en: "Dhanishta",
    ne: "धनिष्ठा",
    lord: "Mars",
    lordNe: "मङ्गल",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Lion",
    yoniNe: "सिंह",
  },
  {
    en: "Shatabhisha",
    ne: "शतभिषा",
    lord: "Rahu",
    lordNe: "राहु",
    gana: "Rakshasa",
    ganaNe: "राक्षस",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Horse",
    yoniNe: "अश्व",
  },
  {
    en: "Purva Bhadrapada",
    ne: "पूर्वभाद्रपदा",
    lord: "Jupiter",
    lordNe: "गुरु",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Adi",
    nadiNe: "आदि",
    yoni: "Lion",
    yoniNe: "सिंह",
  },
  {
    en: "Uttara Bhadrapada",
    ne: "उत्तरभाद्रपदा",
    lord: "Saturn",
    lordNe: "शनि",
    gana: "Manushya",
    ganaNe: "मनुष्य",
    nadi: "Madhya",
    nadiNe: "मध्य",
    yoni: "Cow",
    yoniNe: "गौ",
  },
  {
    en: "Revati",
    ne: "रेवती",
    lord: "Mercury",
    lordNe: "बुध",
    gana: "Deva",
    ganaNe: "देव",
    nadi: "Antya",
    nadiNe: "अन्त्य",
    yoni: "Elephant",
    yoniNe: "गज",
  },
];

const DASHA_PERIODS_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const DASHA_ORDER = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

// --- HELPER MATHEMATICAL FUNCTIONS ---

function toDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

// Calculate D9 Navamsha Sign Index (0..11)
function calculateD9Sign(longitude: number): number {
  const navamshaArc = 360 / 108; // 3° 20' = 3.333333°
  const totalNavamshaIndex = Math.floor((longitude % 360) / navamshaArc);
  return totalNavamshaIndex % 12;
}

// --- Divisional Chart Calculation Functions ---

// Actually, Hora uses Sun and Moon rulership:
// Odd signs: 0-15° = Sun (sign Aries/Leo ruler), 15-30° = Moon (sign Cancer)
// Even signs: 0-15° = Moon, 15-30° = Sun
// We map to sign index: Sun rules Leo(4) in some systems but for Hora we use Aries(0) for Sun part
// Standard approach: Hora sign = sign itself for odd, opposite for even
// Simplified: return the sign index modified by hora
function calculateHoraSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const half = Math.floor(degreeInSign / 15);
  // Odd signs (Aries=0): first half = own sign, second half = sign+4 (Leo/Moon sign equivalent)
  // Even signs: first half = sign+4, second half = own sign
  if (signIndex % 2 === 0) {
    // Odd sign (1st, 3rd, etc.)
    return half === 0 ? signIndex : (signIndex + 4) % 12;
  } else {
    // Even sign
    return half === 0 ? (signIndex + 4) % 12 : signIndex;
  }
}

// D3 Drekkana: Each sign divided into 3 parts of 10° each.
// Each part is ruled by: sign itself, 5th sign from it, 9th sign from it
function calculateDrekkanaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const part = Math.floor((longitude % 30) / 10); // 0, 1, or 2
  return (signIndex + part * 5) % 12;
}

// D7 Saptamsa: Each sign divided into 7 parts of 4°17'8.57" (30/7 degrees)
// Odd signs: start from sign itself, Even signs: start from 7th sign from it
function calculateSaptamsaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const part = Math.floor((degreeInSign / 30) * 7); // 0..6
  if (signIndex % 2 === 0) {
    // Odd sign: start from sign itself
    return (signIndex + part) % 12;
  } else {
    // Even sign: start from 7th sign
    return (signIndex + 6 + part) % 12;
  }
}

// D10 Dashamsa: Each sign divided into 10 parts of 3° each.
// Cardinal signs (Aries, Cancer, Libra, Capricorn): start from Aries(0)
// Fixed signs (Taurus, Leo, Scorpio, Aquarius): start from sign itself
// Mutable signs (Gemini, Virgo, Sagittarius, Pisces): start from 9th sign
function calculateDashamsaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const part = Math.floor((degreeInSign / 30) * 10); // 0..9
  const signMod = signIndex % 3; // 0=cardinal, 1=fixed, 2=mutable
  let startSign: number;
  if (signMod === 0) {
    startSign = 0; // Aries
  } else if (signMod === 1) {
    startSign = signIndex; // sign itself
  } else {
    startSign = (signIndex + 8) % 12; // 9th sign
  }
  return (startSign + part) % 12;
}

// D12 Dwadasamsa: Each sign divided into 12 parts of 2.5° each.
// Start from sign itself
function calculateDwadasamsaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const part = Math.floor((degreeInSign / 30) * 12); // 0..11
  return (signIndex + part) % 12;
}

// D30 Trimsamsa: Each sign divided into 5 unequal parts.
// Odd signs: 5°(Saturn), 5°(Mars), 7°(Jupiter), 8°(Mercury), 7°(Venus)
// Even signs: reversed order: 5°(Venus), 7°(Mercury), 7°(Jupiter), 5°(Mars), 5°(Saturn)
// Sign rulers mapping: Saturn=7, Mars=6, Jupiter=4, Mercury=5, Venus=1 (sign indices)
// Trimsamsa boundaries in degrees: [0-5, 5-10, 10-17, 17-25, 25-30]
const TRIMSSAMSA_ODD = [7, 6, 4, 5, 1]; // Saturn, Mars, Jupiter, Mercury, Venus
const TRIMSSAMSA_EVEN = [1, 5, 4, 6, 7]; // Venus, Mercury, Jupiter, Mars, Saturn
const TRIMSSAMSA_BOUNDS = [5, 10, 17, 25, 30];

function calculateTrimsamsaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  let part = 4;
  for (let i = 0; i < TRIMSSAMSA_BOUNDS.length; i++) {
    if (degreeInSign < TRIMSSAMSA_BOUNDS[i]) {
      part = i;
      break;
    }
  }
  const rulers = signIndex % 2 === 0 ? TRIMSSAMSA_ODD : TRIMSSAMSA_EVEN;
  return rulers[part];
}

// --- Planetary Aspects (Graha Drishti) ---

// All planets aspect the 7th house from their position.
// Special aspects:
// - Mars: 4th, 7th, 8th
// - Jupiter: 5th, 7th, 9th
// - Saturn: 3rd, 7th, 10th
// - Rahu/Ketu: 5th, 7th, 9th (common Vedic view)

const PLANET_SPECIAL_ASPECTS: Record<string, number[]> = {
  Mars: [4, 7, 8],
  Jupiter: [5, 7, 9],
  Saturn: [3, 7, 10],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9],
};

// All planets aspect the 7th house by default
const ALL_PLANETS_ASPECT = [7];

function getAspectHouses(planetName: string): number[] {
  const special = PLANET_SPECIAL_ASPECTS[planetName];
  if (special) {
    return special;
  }
  return ALL_PLANETS_ASPECT;
}

/**
 * Calculate which houses a planet aspects from its current position.
 * Returns an array of house numbers (1-12) that are aspected.
 */
function calculateAspectsFromPlanet(longitude: number, planetName: string): number[] {
  const signIndex = Math.floor(longitude / 30);
  const aspectHouses = getAspectHouses(planetName);
  return aspectHouses.map((houseOffset) => {
    // aspect house = current sign index + (houseOffset - 1), modulo 12
    return ((signIndex + houseOffset - 1) % 12) + 1;
  });
}

/**
 * Calculate the angular distance between two planets in degrees (0-360).
 */
function calculateDegreeDistance(long1: number, long2: number): number {
  let diff = Math.abs(long1 - long2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Get aspect type description based on house distance from the aspecting planet.
 * House difference 1 = 1st house (conjunction), 7 = 7th house (opposition), etc.
 */
function getAspectType(houseDiff: number): { type: string; typeNe: string; isSpecial: boolean } {
  const aspectMap: Record<number, { type: string; typeNe: string; isSpecial: boolean }> = {
    1: { type: "Conjunction", typeNe: "संयोग", isSpecial: false },
    2: { type: "2nd aspect", typeNe: "द्वितीय दृष्टि", isSpecial: false },
    3: { type: "3rd aspect", typeNe: "तृतीय दृष्टि", isSpecial: true }, // Saturn special
    4: { type: "4th aspect", typeNe: "चतुर्थ दृष्टि", isSpecial: true }, // Mars special
    5: { type: "5th aspect", typeNe: "पंचम दृष्टि", isSpecial: true }, // Jupiter special
    6: { type: "6th aspect", typeNe: "षष्ठ दृष्टि", isSpecial: false },
    7: { type: "7th aspect", typeNe: "सप्तम दृष्टि", isSpecial: false }, // All planets
    8: { type: "8th aspect", typeNe: "अष्टम दृष्टि", isSpecial: true }, // Mars special
    9: { type: "9th aspect", typeNe: "नवम दृष्टि", isSpecial: true }, // Jupiter special
    10: { type: "10th aspect", typeNe: "दशम दृष्टि", isSpecial: true }, // Saturn special
    11: { type: "11th aspect", typeNe: "एकादश दृष्टि", isSpecial: false },
    12: { type: "12th aspect", typeNe: "द्वादश दृष्टि", isSpecial: false },
  };
  return aspectMap[houseDiff] || { type: "Unknown", typeNe: "अज्ञात", isSpecial: false };
}

/**
 * Calculate all aspects for all planets.
 * Returns an object with aspects (cast by each planet) and aspectsReceived (received by each planet).
 */
function calculateAspects(planets: DetailedPlanet[]): {
  aspects: Record<string, PlanetAspect[]>;
  aspectsReceived: Record<string, PlanetAspect[]>;
} {
  const aspects: Record<string, PlanetAspect[]> = {};
  const aspectsReceived: Record<string, PlanetAspect[]> = {};

  // Initialize empty arrays for each planet
  planets.forEach((p) => {
    aspects[p.name] = [];
    aspectsReceived[p.name] = [];
  });

  planets.forEach((planet) => {
    const aspectedHouses = calculateAspectsFromPlanet(planet.longitude, planet.name);

    aspectedHouses.forEach((targetHouse) => {
      // Find all planets in the target house
      const aspectedPlanets = planets.filter((p) => p.house === targetHouse);

      aspectedPlanets.forEach((targetPlanet) => {
        if (targetPlanet.name === planet.name) return; // Don't aspect self

        const degreeDistance = calculateDegreeDistance(
          planet.longitude,
          targetPlanet.longitude,
        );
        const aspectInfo = getAspectType(targetHouse);

        const aspectRecord: PlanetAspect = {
          fromPlanet: planet.name,
          fromPlanetNe: planet.nameNe,
          fromHouse: planet.house,
          toHouse: targetHouse,
          aspectType: aspectInfo.type,
          aspectTypeNe: aspectInfo.typeNe,
          degreeDistance,
          isSpecial: aspectInfo.isSpecial,
        };

        aspects[planet.name].push(aspectRecord);
        aspectsReceived[targetPlanet.name].push(aspectRecord);
      });
    });
  });

  return { aspects, aspectsReceived };
}

export async function generateFullBirthChart(
  gregorianDate: Date,
  latitude: number,
  longitude: number,
  nepaliDate: { year: number; month: number; day: number },
): Promise<CompleteBirthChartReport> {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    const year = gregorianDate.getUTCFullYear();
    const month = gregorianDate.getUTCMonth() + 1;
    const day = gregorianDate.getUTCDate();
    const utHours =
      gregorianDate.getUTCHours() +
      gregorianDate.getUTCMinutes() / 60 +
      gregorianDate.getUTCSeconds() / 3600;

    const jd = swe.julday(year, month, day, utHours);
    swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    const ayanamsha = swe.get_ayanamsa_ut(jd);
    const flags = swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

    // 1. Compute Ascendant (Lagna)
    const houses = swe.houses_ex(jd, flags, latitude, longitude, "E");
    const lagnaSidereal = (houses.ascmc[0] + 360) % 360;
    const lagnaSignIndex = Math.floor(lagnaSidereal / 30);
    const lagnaD9SignIndex = calculateD9Sign(lagnaSidereal);

    // 2. Compute Planets
    const planetList = [
      { id: swe.SE_SUN, en: "Sun", ne: "सूर्य", combustThreshold: 0 },
      { id: swe.SE_MOON, en: "Moon", ne: "चन्द्र", combustThreshold: 12 },
      { id: swe.SE_MARS, en: "Mars", ne: "मङ्गल", combustThreshold: 17 },
      { id: swe.SE_MERCURY, en: "Mercury", ne: "बुध", combustThreshold: 14 },
      { id: swe.SE_JUPITER, en: "Jupiter", ne: "गुरु", combustThreshold: 11 },
      { id: swe.SE_VENUS, en: "Venus", ne: "शुक्र", combustThreshold: 10 },
      { id: swe.SE_SATURN, en: "Saturn", ne: "शनि", combustThreshold: 15 },
      { id: swe.SE_MEAN_NODE, en: "Rahu", ne: "राहु", combustThreshold: 0 },
    ];

    const planets: DetailedPlanet[] = [];
    let sunLong = 0;

    for (const p of planetList) {
      const pos = swe.calc_ut(jd, p.id, flags);
      const long = (pos[0] + 360) % 360;
      const speed = pos[3];

      if (p.en === "Sun") sunLong = long;

      const signIndex = Math.floor(long / 30);
      const nakshatraIndex = Math.floor(long / (360 / 27));
      const pada = Math.floor((long % (360 / 27)) / (360 / 108)) + 1;
      const house = ((signIndex - lagnaSignIndex + 12) % 12) + 1;

      planets.push({
        id: p.id,
        name: p.en,
        nameNe: p.ne,
        longitude: long,
        dms: toDMS(long % 30),
        signIndex,
        signName: RASHIS[signIndex].en,
        signNameNe: RASHIS[signIndex].ne,
        signLord: RASHIS[signIndex].lord,
        signLordNe: RASHIS[signIndex].lordNe,
        house,
        nakshatraIndex,
        nakshatraName: NAKSHATRAS[nakshatraIndex].en,
        nakshatraNameNe: NAKSHATRAS[nakshatraIndex].ne,
        pada,
        isRetrograde: speed < 0,
        isCombust: false, // Calculated after loop
        d9SignIndex: calculateD9Sign(long),
        d9SignName: RASHIS[calculateD9Sign(long)].en,
        d9SignNameNe: RASHIS[calculateD9Sign(long)].ne,
        aspects: [],
        aspectsReceived: [],
      });
    }

    // Add Ketu
    const rahu = planets.find((p) => p.name === "Rahu")!;
    const ketuLong = (rahu.longitude + 180) % 360;
    const ketuSignIdx = Math.floor(ketuLong / 30);
    const ketuNakIdx = Math.floor(ketuLong / (360 / 27));

    planets.push({
      id: 99,
      name: "Ketu",
      nameNe: "केतु",
      longitude: ketuLong,
      dms: toDMS(ketuLong % 30),
      signIndex: ketuSignIdx,
      signName: RASHIS[ketuSignIdx].en,
      signNameNe: RASHIS[ketuSignIdx].ne,
      signLord: RASHIS[ketuSignIdx].lord,
      signLordNe: RASHIS[ketuSignIdx].lordNe,
      house: ((ketuSignIdx - lagnaSignIndex + 12) % 12) + 1,
      nakshatraIndex: ketuNakIdx,
      nakshatraName: NAKSHATRAS[ketuNakIdx].en,
      nakshatraNameNe: NAKSHATRAS[ketuNakIdx].ne,
      pada: Math.floor((ketuLong % (360 / 27)) / (360 / 108)) + 1,
      isRetrograde: rahu.isRetrograde,
      isCombust: false,
      d9SignIndex: calculateD9Sign(ketuLong),
      d9SignName: RASHIS[calculateD9Sign(ketuLong)].en,
      d9SignNameNe: RASHIS[calculateD9Sign(ketuLong)].ne,
      aspects: [],
      aspectsReceived: [],
    });

    // Check Combustion relative to Sun distance
    planets.forEach((p) => {
      if (p.name !== "Sun" && p.name !== "Rahu" && p.name !== "Ketu") {
        const dist = Math.min(
          (p.longitude - sunLong + 360) % 360,
          (sunLong - p.longitude + 360) % 360,
        );
        const cfg = planetList.find((item) => item.en === p.name);
        if (cfg && dist <= cfg.combustThreshold) {
          p.isCombust = true;
        }
      }
    });

    // 3. Build D1 through D30 Chart House Arrays
    const d1Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d9Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d2Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d3Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d7Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d10Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d12Chart: Record<number, { name: string; nameNe: string }[]> = {};
    const d30Chart: Record<number, { name: string; nameNe: string }[]> = {};
    for (let h = 1; h <= 12; h++) {
      d1Chart[h] = [];
      d9Chart[h] = [];
      d2Chart[h] = [];
      d3Chart[h] = [];
      d7Chart[h] = [];
      d10Chart[h] = [];
      d12Chart[h] = [];
      d30Chart[h] = [];
    }

    // Calculate lagna's position in each divisional chart for house reference
    const lagnaD2Sign = calculateHoraSign(lagnaSidereal);
    const lagnaD3Sign = calculateDrekkanaSign(lagnaSidereal);
    const lagnaD7Sign = calculateSaptamsaSign(lagnaSidereal);
    const lagnaD10Sign = calculateDashamsaSign(lagnaSidereal);
    const lagnaD12Sign = calculateDwadasamsaSign(lagnaSidereal);
    const lagnaD30Sign = calculateTrimsamsaSign(lagnaSidereal);

    planets.forEach((p) => {
      d1Chart[p.house].push({ name: p.name, nameNe: p.nameNe });
      const d9House = ((p.d9SignIndex - lagnaD9SignIndex + 12) % 12) + 1;
      d9Chart[d9House].push({ name: p.name, nameNe: p.nameNe });

      // D2 Hora
      const d2Sign = calculateHoraSign(p.longitude);
      const d2House = ((d2Sign - lagnaD2Sign + 12) % 12) + 1;
      d2Chart[d2House].push({ name: p.name, nameNe: p.nameNe });

      // D3 Drekkana
      const d3Sign = calculateDrekkanaSign(p.longitude);
      const d3House = ((d3Sign - lagnaD3Sign + 12) % 12) + 1;
      d3Chart[d3House].push({ name: p.name, nameNe: p.nameNe });

      // D7 Saptamsa
      const d7Sign = calculateSaptamsaSign(p.longitude);
      const d7House = ((d7Sign - lagnaD7Sign + 12) % 12) + 1;
      d7Chart[d7House].push({ name: p.name, nameNe: p.nameNe });

      // D10 Dashamsa
      const d10Sign = calculateDashamsaSign(p.longitude);
      const d10House = ((d10Sign - lagnaD10Sign + 12) % 12) + 1;
      d10Chart[d10House].push({ name: p.name, nameNe: p.nameNe });

      // D12 Dwadasamsa
      const d12Sign = calculateDwadasamsaSign(p.longitude);
      const d12House = ((d12Sign - lagnaD12Sign + 12) % 12) + 1;
      d12Chart[d12House].push({ name: p.name, nameNe: p.nameNe });

      // D30 Trimsamsa
      const d30Sign = calculateTrimsamsaSign(p.longitude);
      const d30House = ((d30Sign - lagnaD30Sign + 12) % 12) + 1;
      d30Chart[d30House].push({ name: p.name, nameNe: p.nameNe });
    });

    // 4. Avakahada Chakra (from Moon position)
    const moon = planets.find((p) => p.name === "Moon")!;
    const moonNak = NAKSHATRAS[moon.nakshatraIndex];
    const moonRashi = RASHIS[moon.signIndex];

    const avakahada: AvakahadaChakra = {
      rashi: moonRashi.en,
      rashiNe: moonRashi.ne,
      rashiLord: moonRashi.lord,
      rashiLordNe: moonRashi.lordNe,
      nakshatra: moonNak.en,
      nakshatraNe: moonNak.ne,
      nakshatraLord: moonNak.lord,
      nakshatraLordNe: moonNak.lordNe,
      pada: moon.pada,
      gana: moonNak.gana as AvakahadaChakra["gana"],
      ganaNe: moonNak.ganaNe,
      yoni: moonNak.yoni,
      yoniNe: moonNak.yoniNe,
      nadi: moonNak.nadi as AvakahadaChakra["nadi"],
      nadiNe: moonNak.nadiNe,
      varna: moonRashi.varna as AvakahadaChakra["varna"],
      varnaNe:
        moonRashi.varna === "Brahmin"
          ? "ब्राह्मण"
          : moonRashi.varna === "Kshatriya"
            ? "क्षत्रिय"
            : moonRashi.varna === "Vaishya"
              ? "वैश्य"
              : "शूद्र",
      paya:
        moon.house === 1 || moon.house === 6 || moon.house === 11
          ? "Gold"
          : moon.house === 2 || moon.house === 5 || moon.house === 9
            ? "Silver"
            : "Copper",
      payaNe:
        moon.house === 1 || moon.house === 6 || moon.house === 11
          ? "सुनको पाया"
          : moon.house === 2 || moon.house === 5 || moon.house === 9
            ? "चाँदीको पाया"
            : "तामाको पाया",
    };

    // 5. Vimshottari Dasha Calculation
    const nakArc = 360 / 27;
    const moonProgressInNak = moon.longitude % nakArc;
    const fractionElapsed = moonProgressInNak / nakArc;
    const balanceRemainingFraction = 1 - fractionElapsed;

    const birthDashaLord = moonNak.lord;
    const totalBirthDashaYears = DASHA_PERIODS_YEARS[birthDashaLord];
    const remainingYears = totalBirthDashaYears * balanceRemainingFraction;

    const dashaTimeline: DashaPeriod[] = [];
    let currentDate = new Date(gregorianDate);

    // Initial Balance Period
    const dashaEndDate = new Date(currentDate);
    dashaEndDate.setFullYear(
      dashaEndDate.getFullYear() + Math.floor(remainingYears),
    );
    dashaEndDate.setMonth(
      dashaEndDate.getMonth() + Math.floor((remainingYears % 1) * 12),
    );

    dashaTimeline.push({
      planet: birthDashaLord,
      planetNe:
        NAKSHATRAS.find((n) => n.lord === birthDashaLord)?.lordNe ||
        birthDashaLord,
      startDate: currentDate.toISOString().split("T")[0],
      endDate: dashaEndDate.toISOString().split("T")[0],
      durationYears: Number(remainingYears.toFixed(1)),
    });

    currentDate = new Date(dashaEndDate);
    let lordIdx =
      (DASHA_ORDER.indexOf(birthDashaLord) + 1) % DASHA_ORDER.length;

    // Next 6 Dashas (covering ~100 years)
    for (let i = 0; i < 6; i++) {
      const lord = DASHA_ORDER[lordIdx];
      const duration = DASHA_PERIODS_YEARS[lord];
      const end = new Date(currentDate);
      end.setFullYear(end.getFullYear() + duration);

      dashaTimeline.push({
        planet: lord,
        planetNe: NAKSHATRAS.find((n) => n.lord === lord)?.lordNe || lord,
        startDate: currentDate.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
        durationYears: duration,
      });

      currentDate = new Date(end);
      lordIdx = (lordIdx + 1) % DASHA_ORDER.length;
    }

    // 6. Dosha Checks (Manglik & Kaal Sarp)
    const mars = planets.find((p) => p.name === "Mars")!;
    const isManglik = [1, 4, 7, 8, 12].includes(mars.house);

    // Kaal Sarp Check (All planets between Rahu & Ketu longitudes)
    const rahuLong = rahu.longitude;
    const ketuLong_ = planets.find((p) => p.name === "Ketu")!.longitude;
    const otherPlanets = planets.filter(
      (p) => p.name !== "Rahu" && p.name !== "Ketu",
    );

    const allBetween = otherPlanets.every((p) => {
      const l = p.longitude;
      return rahuLong < ketuLong_
        ? l >= rahuLong && l <= ketuLong_
        : l >= rahuLong || l <= ketuLong_;
    });

    // Calculate aspects for all planets
    const { aspects, aspectsReceived } = calculateAspects(planets);

    return {
      birthDetails: {
        gregorianDate: gregorianDate.toISOString(),
        nepaliDate,
        latitude,
        longitude,
        ayanamshaDeg: toDMS(ayanamsha),
      },
      lagna: {
        signIndex: lagnaSignIndex,
        signName: RASHIS[lagnaSignIndex].en,
        signNameNe: RASHIS[lagnaSignIndex].ne,
        dms: toDMS(lagnaSidereal % 30),
        d9SignIndex: lagnaD9SignIndex,
        d9SignName: RASHIS[lagnaD9SignIndex].en,
        d9SignNameNe: RASHIS[lagnaD9SignIndex].ne,
      },
      avakahada,
      panchang: {
        tithiName: `Tithi (${Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1})`,
        tithiNameNe: `तिथि (${Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1})`,
        tithiNumber:
          Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1,
        paksha:
          Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1 <= 15
            ? "Shukla Paksha"
            : "Krishna Paksha",
        pakshaNe:
          Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1 <= 15
            ? "शुक्ल पक्ष"
            : "कृष्ण पक्ष",
        nakshatra: moonNak.en,
        nakshatraNe: moonNak.ne,
        yogaName:
          NAKSHATRAS[
            Math.floor(((sunLong + moon.longitude) % 360) / (360 / 27))
          ].en,
        yogaNameNe:
          NAKSHATRAS[
            Math.floor(((sunLong + moon.longitude) % 360) / (360 / 27))
          ].ne,
        karanaName: "Karana special",
        karanaNameNe: "करण विशेष",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][gregorianDate.getUTCDay()],
        dayOfWeekNe: [
          "आइतबार",
          "सोमबार",
          "मङ्गलबार",
          "बुधबार",
          "बिहिबार",
          "शुक्रबार",
          "शनिबार",
        ][gregorianDate.getUTCDay()],
      },
      planets,
      dashaTimeline,
      doshas: {
        isManglik,
        manglikDetailsNe: isManglik
          ? `मङ्गल ग्रह ${mars.house} औं भावमा रहेकाले मङ्गल दोष देखिन्छ।`
          : "मङ्गल दोष छैन।",
        hasKalsarpa: allBetween,
        kalsarpaDetailsNe: allBetween
          ? "सबै ग्रहहरू राहु र केतुको बीचमा रहेकाले कालसर्प योग देखिन्छ।"
          : "कालसर्प योग छैन।",
      },
      d1Chart,
      d9Chart,
      d2Chart,
      d3Chart,
      d7Chart,
      d10Chart,
      d12Chart,
      d30Chart,
      aspects,
      aspectsReceived,
    };
  } finally {
    swe.close();
  }
}

