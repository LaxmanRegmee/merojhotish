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
  d9SignNameNe: string;
}

export interface DashaPeriod {
  planet: string;
  planetNe: string;
  startDate: string;
  endDate: string;
  durationYears: number;
}

export interface PanchangAtBirth {
  tithiNameNe: string;
  tithiNumber: number;
  pakshaNe: string;
  nakshatraNe: string;
  yogaNameNe: string;
  karanaNameNe: string;
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
    latitude: number;
    longitude: number;
    ayanamshaDeg: string;
  };
  lagna: {
    signIndex: number;
    signNameNe: string;
    dms: string;
    d9SignIndex: number;
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
        latitude,
        longitude,
        ayanamshaDeg: toDMS(ayanamsha),
      },
      lagna: {
        signIndex: lagnaSignIndex,
        signNameNe: RASHIS[lagnaSignIndex].ne,
        dms: toDMS(lagnaSidereal % 30),
        d9SignIndex: lagnaD9SignIndex,
        d9SignNameNe: RASHIS[lagnaD9SignIndex].ne,
      },
      avakahada,
      panchang: {
        tithiNameNe: `तिथि (${Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1})`,
        tithiNumber:
          Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1,
        pakshaNe:
          Math.floor(((moon.longitude - sunLong + 360) % 360) / 12) + 1 <= 15
            ? "शुक्ल पक्ष"
            : "कृष्ण पक्ष",
        nakshatraNe: moonNak.ne,
        yogaNameNe:
          NAKSHATRAS[
            Math.floor(((sunLong + moon.longitude) % 360) / (360 / 27))
          ].ne,
        karanaNameNe: "करण विशेष",
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
