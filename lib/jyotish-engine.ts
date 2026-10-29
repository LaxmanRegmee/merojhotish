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
}

export interface DashaPeriod {
  planet: string;
  planetNe: string;
  startDate: string;
  endDate: string;
  durationYears: number;
}

// --- DASHAKOOTA (10-FOLD) MARRIAGE COMPATIBILITY INTERFACES ---

export interface DashakootaKoota {
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;
  maxPoints: number;
  pointsObtained: number;
  details: string;
  detailsNe: string;
  isCompatible: boolean;
}

export interface DashakootaResult {
  kootas: DashakootaKoota[];
  totalPoints: number;
  maxTotalPoints: number;
  percentage: number;
  verdict: "Excellent" | "Good" | "Average" | "Poor";
  verdictNe: string;
  summary: string;
  summaryNe: string;
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
  d1Chart: Record<number, string[]>; // House 1..12 -> Planet names
  d9Chart: Record<number, string[]>; // House 1..12 in Navamsha
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

// --- MAIN GENERATOR FUNCTION ---

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

    // 3. Build D1 and D9 Chart House Arrays
    const d1Chart: Record<number, string[]> = {};
    const d9Chart: Record<number, string[]> = {};
    for (let h = 1; h <= 12; h++) {
      d1Chart[h] = [];
      d9Chart[h] = [];
    }

    planets.forEach((p) => {
      d1Chart[p.house].push(p.nameNe);
      const d9House = ((p.d9SignIndex - lagnaD9SignIndex + 12) % 12) + 1;
      d9Chart[d9House].push(p.nameNe);
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
    };
  } finally {
    swe.close();
  }
}

// --- DASHAKOOTA (10-FOLD) MARRIAGE COMPATIBILITY CALCULATION ---

/**
 * Calculates Dashakoota (10-fold) marriage compatibility between two birth charts
 * Based on traditional South Indian system with 10 kootas
 */
export function calculateDashakoota(
  chart1: CompleteBirthChartReport,
  chart2: CompleteBirthChartReport,
  language: "en" | "np" = "en",
): DashakootaResult {
  const isNepali = language === "np";

  // Extract Moon data for both charts
  const moon1 = chart1.planets.find((p) => p.name === "Moon")!;
  const moon2 = chart2.planets.find((p) => p.name === "Moon")!;

  const nak1 = NAKSHATRAS[moon1.nakshatraIndex];
  const nak2 = NAKSHATRAS[moon2.nakshatraIndex];

  const rashi1 = RASHIS[moon1.signIndex];
  const rashi2 = RASHIS[moon2.signIndex];

  const kootas: DashakootaKoota[] = [];

  // 1. DINA KOOTA (Nakshatra distance) - Max 3 points
  // Distance from boy's nakshatra to girl's nakshatra
  const dinaDistance = (moon2.nakshatraIndex - moon1.nakshatraIndex + 27) % 27;
  let dinaPoints = 0;
  let dinaDetails = "";
  let dinaDetailsNe = "";

  if (dinaDistance === 0) {
    dinaPoints = 0;
    dinaDetails = "Same nakshatra - not favorable";
    dinaDetailsNe = "एकै नक्षत्र - अनुकूल छैन";
  } else if (
    [2, 4, 6, 8, 9, 11, 13, 15, 17, 18, 20, 22, 24, 26].includes(dinaDistance)
  ) {
    dinaPoints = 3;
    dinaDetails = "Favorable nakshatra distance";
    dinaDetailsNe = "अनुकूल नक्षत्र दूरी";
  } else {
    dinaPoints = 1.5;
    dinaDetails = "Moderately favorable nakshatra distance";
    dinaDetailsNe = "मध्यम अनुकूल नक्षत्र दूरी";
  }

  kootas.push({
    name: "Dina",
    nameNe: "दिन",
    description: "Nakshatra distance compatibility",
    descriptionNe: "नक्षत्र दूरी अनुकूलता",
    maxPoints: 3,
    pointsObtained: dinaPoints,
    details: dinaDetails,
    detailsNe: dinaDetailsNe,
    isCompatible: dinaPoints >= 3,
  });

  // 2. GANA KOOTA (Temperament) - Max 4 points
  const gana1 = nak1.gana;
  const gana2 = nak2.gana;
  let ganaPoints = 0;
  let ganaDetails = "";
  let ganaDetailsNe = "";

  if (gana1 === gana2) {
    ganaPoints = 4;
    ganaDetails = `Both ${gana1} gana - excellent compatibility`;
    ganaDetailsNe = `दुवै ${nak1.ganaNe} गण - उत्कृष्ट अनुकूलता`;
  } else if (
    (gana1 === "Deva" && gana2 === "Manushya") ||
    (gana1 === "Manushya" && gana2 === "Deva")
  ) {
    ganaPoints = 3;
    ganaDetails = `${gana1} and ${gana2} gana - good compatibility`;
    ganaDetailsNe = `${nak1.ganaNe} र ${nak2.ganaNe} गण - राम्रो अनुकूलता`;
  } else if (
    (gana1 === "Manushya" && gana2 === "Rakshasa") ||
    (gana1 === "Rakshasa" && gana2 === "Manushya")
  ) {
    ganaPoints = 1;
    ganaDetails = `${gana1} and ${gana2} gana - moderate compatibility`;
    ganaDetailsNe = `${nak1.ganaNe} र ${nak2.ganaNe} गण - मध्यम अनुकूलता`;
  } else {
    ganaPoints = 0;
    ganaDetails = `${gana1} and ${gana2} gana - challenging compatibility`;
    ganaDetailsNe = `${nak1.ganaNe} र ${nak2.ganaNe} गण - चुनौतीपूर्ण अनुकूलता`;
  }

  kootas.push({
    name: "Gana",
    nameNe: "गण",
    description: "Temperament/nature compatibility",
    descriptionNe: "स्वभाव/प्रकृति अनुकूलता",
    maxPoints: 4,
    pointsObtained: ganaPoints,
    details: ganaDetails,
    detailsNe: ganaDetailsNe,
    isCompatible: ganaPoints >= 3,
  });

  // 3. YONI KOOTA (Sexual/Physical compatibility) - Max 4 points
  const yoni1 = nak1.yoni;
  const yoni2 = nak2.yoni;
  let yoniPoints = 0;
  let yoniDetails = "";
  let yoniDetailsNe = "";

  // Yoni compatibility matrix (simplified)
  const yoniPairs: Record<string, string[]> = {
    Horse: ["Horse", "Sheep", "Dog"],
    Elephant: ["Elephant", "Rat", "Monkey"],
    Sheep: ["Sheep", "Horse", "Cow"],
    Serpent: ["Serpent", "Mongoose", "Cat"],
    Dog: ["Dog", "Horse", "Rabbit"],
    Cat: ["Cat", "Serpent", "Rat"],
    Rat: ["Rat", "Elephant", "Cat"],
    Cow: ["Cow", "Sheep", "Buffalo"],
    Buffalo: ["Buffalo", "Cow", "Tiger"],
    Tiger: ["Tiger", "Buffalo", "Deer"],
    Deer: ["Deer", "Tiger", "Mongoose"],
    Mongoose: ["Mongoose", "Deer", "Serpent"],
    Monkey: ["Monkey", "Elephant", "Goat"],
    Goat: ["Goat", "Monkey", "Sheep"],
    Lion: ["Lion", "Tiger", "Horse"],
    Rabbit: ["Rabbit", "Dog", "Cat"],
  };

  const compatibleYonis = yoniPairs[yoni1] || [];
  if (yoni1 === yoni2) {
    yoniPoints = 4;
    yoniDetails = `Same yoni (${yoni1}) - excellent physical compatibility`;
    yoniDetailsNe = `एकै योनि (${nak1.yoniNe}) - उत्कृष्ट शारीरिक अनुकूलता`;
  } else if (compatibleYonis.includes(yoni2)) {
    yoniPoints = 3;
    yoniDetails = `${yoni1} and ${yoni2} yoni - good compatibility`;
    yoniDetailsNe = `${nak1.yoniNe} र ${nak2.yoniNe} योनि - राम्रो अनुकूलता`;
  } else {
    yoniPoints = 0;
    yoniDetails = `${yoni1} and ${yoni2} yoni - challenging compatibility`;
    yoniDetailsNe = `${nak1.yoniNe} र ${nak2.yoniNe} योनि - चुनौतीपूर्ण अनुकूलता`;
  }

  kootas.push({
    name: "Yoni",
    nameNe: "योनि",
    description: "Physical/sexual compatibility",
    descriptionNe: "शारीरिक/यौन अनुकूलता",
    maxPoints: 4,
    pointsObtained: yoniPoints,
    details: yoniDetails,
    detailsNe: yoniDetailsNe,
    isCompatible: yoniPoints >= 3,
  });

  // 4. RASHI KOOTA (Moon sign compatibility) - Max 5 points
  const rashiDistance = (moon2.signIndex - moon1.signIndex + 12) % 12;
  let rashiPoints = 0;
  let rashiDetails = "";
  let rashiDetailsNe = "";

  // Friendly signs (1, 5, 9 from each other)
  const friendlyDistances = [1, 5, 9];
  // Neutral signs (3, 11)
  const neutralDistances = [3, 11];
  // Enemy signs (2, 4, 6, 7, 8, 10)
  const enemyDistances = [2, 4, 6, 7, 8, 10];

  if (rashiDistance === 0) {
    rashiPoints = 5;
    rashiDetails = `Same rashi (${rashi1.en}) - excellent emotional compatibility`;
    rashiDetailsNe = `एकै राशि (${rashi1.ne}) - उत्कृष्ट भावनात्मक अनुकूलता`;
  } else if (friendlyDistances.includes(rashiDistance)) {
    rashiPoints = 4;
    rashiDetails = `Friendly rashi relationship - good compatibility`;
    rashiDetailsNe = `मैत्रीपूर्ण राशि सम्बन्ध - राम्रो अनुकूलता`;
  } else if (neutralDistances.includes(rashiDistance)) {
    rashiPoints = 2;
    rashiDetails = `Neutral rashi relationship - moderate compatibility`;
    rashiDetailsNe = `तटस्थ राशि सम्बन्ध - मध्यम अनुकूलता`;
  } else {
    rashiPoints = 0;
    rashiDetails = `Enemy rashi relationship - challenging compatibility`;
    rashiDetailsNe = `शत्रु राशि सम्बन्ध - चुनौतीपूर्ण अनुकूलता`;
  }

  kootas.push({
    name: "Rashi",
    nameNe: "राशि",
    description: "Moon sign emotional compatibility",
    descriptionNe: "चन्द्र राशि भावनात्मक अनुकूलता",
    maxPoints: 5,
    pointsObtained: rashiPoints,
    details: rashiDetails,
    detailsNe: rashiDetailsNe,
    isCompatible: rashiPoints >= 3,
  });

  // 5. RASYADHIPATI KOOTA (Moon sign lord friendship) - Max 5 points
  const lord1 = rashi1.lord;
  const lord2 = rashi2.lord;
  let rasyadhipatiPoints = 0;
  let rasyadhipatiDetails = "";
  let rasyadhipatiDetailsNe = "";

  // Planet friendship matrix
  const planetFriends: Record<
    string,
    { friends: string[]; neutrals: string[]; enemies: string[] }
  > = {
    Sun: {
      friends: ["Moon", "Mars", "Jupiter"],
      neutrals: ["Mercury"],
      enemies: ["Venus", "Saturn", "Rahu", "Ketu"],
    },
    Moon: {
      friends: ["Sun", "Mercury"],
      neutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
      enemies: ["Rahu", "Ketu"],
    },
    Mars: {
      friends: ["Sun", "Moon", "Jupiter"],
      neutrals: ["Venus", "Saturn"],
      enemies: ["Mercury", "Rahu", "Ketu"],
    },
    Mercury: {
      friends: ["Sun", "Venus"],
      neutrals: ["Mars", "Jupiter", "Saturn"],
      enemies: ["Moon", "Rahu", "Ketu"],
    },
    Jupiter: {
      friends: ["Sun", "Moon", "Mars"],
      neutrals: ["Saturn"],
      enemies: ["Mercury", "Venus", "Rahu", "Ketu"],
    },
    Venus: {
      friends: ["Mercury", "Saturn"],
      neutrals: ["Mars", "Jupiter"],
      enemies: ["Sun", "Moon", "Rahu", "Ketu"],
    },
    Saturn: {
      friends: ["Mercury", "Venus"],
      neutrals: ["Jupiter"],
      enemies: ["Sun", "Moon", "Mars", "Rahu", "Ketu"],
    },
    Rahu: {
      friends: ["Venus", "Saturn"],
      neutrals: [],
      enemies: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Ketu"],
    },
    Ketu: {
      friends: ["Mars", "Venus"],
      neutrals: [],
      enemies: ["Sun", "Moon", "Mercury", "Jupiter", "Saturn", "Rahu"],
    },
  };

  const friendship = planetFriends[lord1] || {
    friends: [],
    neutrals: [],
    enemies: [],
  };

  if (lord1 === lord2) {
    rasyadhipatiPoints = 5;
    rasyadhipatiDetails = `Same lord (${lord1}) - excellent`;
    rasyadhipatiDetailsNe = `एकै स्वामी (${rashi1.lordNe}) - उत्कृष्ट`;
  } else if (friendship.friends.includes(lord2)) {
    rasyadhipatiPoints = 4;
    rasyadhipatiDetails = `${lord1} and ${lord2} are friends - good`;
    rasyadhipatiDetailsNe = `${rashi1.lordNe} र ${rashi2.lordNe} मित्र हुन् - राम्रो`;
  } else if (friendship.neutrals.includes(lord2)) {
    rasyadhipatiPoints = 2;
    rasyadhipatiDetails = `${lord1} and ${lord2} are neutral - moderate`;
    rasyadhipatiDetailsNe = `${rashi1.lordNe} र ${rashi2.lordNe} तटस्थ हुन् - मध्यम`;
  } else {
    rasyadhipatiPoints = 0;
    rasyadhipatiDetails = `${lord1} and ${lord2} are enemies - challenging`;
    rasyadhipatiDetailsNe = `${rashi1.lordNe} र ${rashi2.lordNe} शत्रु हुन् - चुनौतीपूर्ण`;
  }

  kootas.push({
    name: "Rasyadhipati",
    nameNe: "राश्याधिपति",
    description: "Moon sign lord friendship",
    descriptionNe: "चन्द्र राशि स्वामी मैत्री",
    maxPoints: 5,
    pointsObtained: rasyadhipatiPoints,
    details: rasyadhipatiDetails,
    detailsNe: rasyadhipatiDetailsNe,
    isCompatible: rasyadhipatiPoints >= 3,
  });

  // 6. VARNA KOOTA (Caste/Spiritual level) - Max 1 point
  const varna1 = rashi1.varna;
  const varna2 = rashi2.varna;
  const varnaOrder = ["Brahmin", "Kshatriya", "Vaishya", "Shudra"];
  const varnaIndex1 = varnaOrder.indexOf(varna1);
  const varnaIndex2 = varnaOrder.indexOf(varna2);
  let varnaPoints = 0;
  let varnaDetails = "";
  let varnaDetailsNe = "";

  if (varnaIndex1 <= varnaIndex2) {
    varnaPoints = 1;
    varnaDetails = `${varna1} to ${varna2} - compatible (groom's varna >= bride's)`;
    varnaDetailsNe = `${rashi1.varna === "Brahmin" ? "ब्राह्मण" : rashi1.varna === "Kshatriya" ? "क्षत्रिय" : rashi1.varna === "Vaishya" ? "वैश्य" : "शूद्र"} देखि ${rashi2.varna === "Brahmin" ? "ब्राह्मण" : rashi2.varna === "Kshatriya" ? "क्षत्रिय" : rashi2.varna === "Vaishya" ? "वैश्य" : "शूद्र"} - अनुकूल`;
  } else {
    varnaPoints = 0;
    varnaDetails = `${varna1} to ${varna2} - not compatible (groom's varna < bride's)`;
    varnaDetailsNe = `${rashi1.varna === "Brahmin" ? "ब्राह्मण" : rashi1.varna === "Kshatriya" ? "क्षत्रिय" : rashi1.varna === "Vaishya" ? "वैश्य" : "शूद्र"} देखि ${rashi2.varna === "Brahmin" ? "ब्राह्मण" : rashi2.varna === "Kshatriya" ? "क्षत्रिय" : rashi2.varna === "Vaishya" ? "वैश्य" : "शूद्र"} - अनुकूल छैन`;
  }

  kootas.push({
    name: "Varna",
    nameNe: "वर्ण",
    description: "Spiritual/caste compatibility",
    descriptionNe: "आध्यात्मिक/वर्ण अनुकूलता",
    maxPoints: 1,
    pointsObtained: varnaPoints,
    details: varnaDetails,
    detailsNe: varnaDetailsNe,
    isCompatible: varnaPoints === 1,
  });

  // 7. VASHYA KOOTA (Mutual attraction/control) - Max 2 points
  // Based on rashi categories
  const vashyaGroups: Record<string, string[]> = {
    Chatushpada: ["Aries", "Taurus", "Leo", "Sagittarius", "Capricorn"], // Quadruped
    Manava: ["Gemini", "Virgo", "Libra", "Aquarius"], // Human
    Jalachara: ["Cancer", "Scorpio", "Pisces"], // Water-dwelling
    Keeta: ["Scorpio"], // Insect (Scorpio)
  };

  const getVashyaGroup = (sign: string): string => {
    for (const [group, signs] of Object.entries(vashyaGroups)) {
      if (signs.includes(sign)) return group;
    }
    return "Unknown";
  };

  const vashyaGroup1 = getVashyaGroup(rashi1.en);
  const vashyaGroup2 = getVashyaGroup(rashi2.en);
  let vashyaPoints = 0;
  let vashyaDetails = "";
  let vashyaDetailsNe = "";

  if (vashyaGroup1 === vashyaGroup2) {
    vashyaPoints = 2;
    vashyaDetails = `Same vashya group (${vashyaGroup1}) - excellent mutual attraction`;
    vashyaDetailsNe = `एकै वश्य समूह (${vashyaGroup1}) - उत्कृष्ट पारस्परिक आकर्षण`;
  } else if (
    (vashyaGroup1 === "Chatushpada" && vashyaGroup2 === "Manava") ||
    (vashyaGroup1 === "Manava" && vashyaGroup2 === "Chatushpada") ||
    (vashyaGroup1 === "Jalachara" && vashyaGroup2 === "Keeta") ||
    (vashyaGroup1 === "Keeta" && vashyaGroup2 === "Jalachara")
  ) {
    vashyaPoints = 1;
    vashyaDetails = `${vashyaGroup1} and ${vashyaGroup2} - moderate attraction`;
    vashyaDetailsNe = `${vashyaGroup1} र ${vashyaGroup2} - मध्यम आकर्षण`;
  } else {
    vashyaPoints = 0;
    vashyaDetails = `${vashyaGroup1} and ${vashyaGroup2} - low mutual attraction`;
    vashyaDetailsNe = `${vashyaGroup1} र ${vashyaGroup2} - कम पारस्परिक आकर्षण`;
  }

  kootas.push({
    name: "Vashya",
    nameNe: "वश्य",
    description: "Mutual attraction and control",
    descriptionNe: "पारस्परिक आकर्षण र नियन्त्रण",
    maxPoints: 2,
    pointsObtained: vashyaPoints,
    details: vashyaDetails,
    detailsNe: vashyaDetailsNe,
    isCompatible: vashyaPoints >= 1,
  });

  // 8. TARA KOOTA (Nakshatra star compatibility) - Max 3 points
  // Based on nakshatra distance groups
  const taraGroups = [
    [0, 8, 16], // Janma Tara
    [1, 9, 17], // Sampat Tara
    [2, 10, 18], // Vipat Tara
    [3, 11, 19], // Kshema Tara
    [4, 12, 20], // Pratyari Tara
    [5, 13, 21], // Sadhaka Tara
    [6, 14, 22], // Vadha Tara
    [7, 15, 23], // Mitra Tara
    [24, 25, 26], // Ati-Mitra Tara
  ];

  let taraPoints = 0;
  let taraDetails = "";
  let taraDetailsNe = "";

  // Find which tara group the distance falls into
  let taraGroupIndex = -1;
  for (let i = 0; i < taraGroups.length; i++) {
    if (taraGroups[i].includes(dinaDistance)) {
      taraGroupIndex = i;
      break;
    }
  }

  // Favorable tara groups: 1 (Sampat), 3 (Kshema), 5 (Sadhaka), 7 (Mitra), 8 (Ati-Mitra)
  const favorableTaraGroups = [1, 3, 5, 7, 8];
  const unfavorableTaraGroups = [2, 4, 6]; // Vipat, Pratyari, Vadha

  if (favorableTaraGroups.includes(taraGroupIndex)) {
    taraPoints = 3;
    taraDetails = `Favorable tara group - excellent nakshatra compatibility`;
    taraDetailsNe = `अनुकूल तारा समूह - उत्कृष्ट नक्षत्र अनुकूलता`;
  } else if (unfavorableTaraGroups.includes(taraGroupIndex)) {
    taraPoints = 0;
    taraDetails = `Unfavorable tara group - challenging nakshatra compatibility`;
    taraDetailsNe = `प्रतिकूल तारा समूह - चुनौतीपूर्ण नक्षत्र अनुकूलता`;
  } else {
    taraPoints = 1.5;
    taraDetails = `Neutral tara group - moderate nakshatra compatibility`;
    taraDetailsNe = `तटस्थ तारा समूह - मध्यम नक्षत्र अनुकूलता`;
  }

  kootas.push({
    name: "Tara",
    nameNe: "तारा",
    description: "Nakshatra star compatibility",
    descriptionNe: "नक्षत्र तारा अनुकूलता",
    maxPoints: 3,
    pointsObtained: taraPoints,
    details: taraDetails,
    detailsNe: taraDetailsNe,
    isCompatible: taraPoints >= 3,
  });

  // 9. NADI KOOTA (Genetic/Health compatibility) - Max 8 points
  const nadi1 = nak1.nadi;
  const nadi2 = nak2.nadi;
  let nadiPoints = 0;
  let nadiDetails = "";
  let nadiDetailsNe = "";

  if (nadi1 !== nadi2) {
    nadiPoints = 8;
    nadiDetails = `Different nadis (${nak1.nadiNe} & ${nak2.nadiNe}) - excellent genetic compatibility`;
    nadiDetailsNe = `फरक नाडी (${nak1.nadiNe} र ${nak2.nadiNe}) - उत्कृष्ट आनुवंशिक अनुकूलता`;
  } else {
    nadiPoints = 0;
    nadiDetails = `Same nadi (${nak1.nadiNe}) - Nadi Dosha, challenging for progeny`;
    nadiDetailsNe = `एकै नाडी (${nak1.nadiNe}) - नाडी दोष, सन्तानको लागि चुनौतीपूर्ण`;
  }

  kootas.push({
    name: "Nadi",
    nameNe: "नाडी",
    description: "Genetic/health/progeny compatibility",
    descriptionNe: "आनुवंशिक/स्वास्थ्य/सन्तान अनुकूलता",
    maxPoints: 8,
    pointsObtained: nadiPoints,
    details: nadiDetails,
    detailsNe: nadiDetailsNe,
    isCompatible: nadiPoints === 8,
  });

  // 10. MAHENDRA KOOTA (Longevity/Prosperity) - Max 2 points
  // Based on nakshatra position difference
  const mahendraDistance =
    (moon2.nakshatraIndex - moon1.nakshatraIndex + 27) % 27;
  let mahendraPoints = 0;
  let mahendraDetails = "";
  let mahendraDetailsNe = "";

  // Favorable distances for Mahendra: 4, 7, 10, 13, 16, 19, 22, 25
  const favorableMahendra = [4, 7, 10, 13, 16, 19, 22, 25];

  if (favorableMahendra.includes(mahendraDistance)) {
    mahendraPoints = 2;
    mahendraDetails = `Favorable Mahendra distance - good longevity and prosperity`;
    mahendraDetailsNe = `अनुकूल महेन्द्र दूरी - राम्रो आयु र समृद्धि`;
  } else {
    mahendraPoints = 0;
    mahendraDetails = `Unfavorable Mahendra distance - moderate longevity`;
    mahendraDetailsNe = `प्रतिकूल महेन्द्र दूरी - मध्यम आयु`;
  }

  kootas.push({
    name: "Mahendra",
    nameNe: "महेन्द्र",
    description: "Longevity and prosperity",
    descriptionNe: "आयु र समृद्धि",
    maxPoints: 2,
    pointsObtained: mahendraPoints,
    details: mahendraDetails,
    detailsNe: mahendraDetailsNe,
    isCompatible: mahendraPoints === 2,
  });

  // Calculate totals
  const totalPoints = kootas.reduce((sum, k) => sum + k.pointsObtained, 0);
  const maxTotalPoints = kootas.reduce((sum, k) => sum + k.maxPoints, 0);
  const percentage = Math.round((totalPoints / maxTotalPoints) * 100);

  // Determine verdict
  let verdict: "Excellent" | "Good" | "Average" | "Poor";
  let verdictNe: string;
  let summary: string;
  let summaryNe: string;

  if (percentage >= 70) {
    verdict = "Excellent";
    verdictNe = "उत्कृष्ट";
    summary = "Excellent compatibility - highly recommended for marriage";
    summaryNe = "उत्कृष्ट अनुकूलता - विवाहको लागि अति सिफारिस";
  } else if (percentage >= 50) {
    verdict = "Good";
    verdictNe = "राम्रो";
    summary =
      "Good compatibility - favorable for marriage with mutual understanding";
    summaryNe = "राम्रो अनुकूलता - पारस्परिक समझसाथ विवाहको लागि अनुकूल";
  } else if (percentage >= 35) {
    verdict = "Average";
    verdictNe = "मध्यम";
    summary =
      "Average compatibility - marriage possible with effort and remedies";
    summaryNe = "मध्यम अनुकूलता - प्रयास र उपचारसाथ विवाह सम्भव";
  } else {
    verdict = "Poor";
    verdictNe = "नराम्रो";
    summary =
      "Poor compatibility - not recommended without strong remedial measures";
    summaryNe = "नराम्रो अनुकूलता - बलियो उपचार बिना सिफारिस गरिएको छैन";
  }

  return {
    kootas,
    totalPoints,
    maxTotalPoints,
    percentage,
    verdict,
    verdictNe,
    summary,
    summaryNe,
  };
}
