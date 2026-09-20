// lib/jyotish-engine.ts
import SwissEph from "swisseph-wasm";

export interface PlanetaryPosition {
  name: string;
  nameNe: string;
  longitude: number; // 0° to 360° Sidereal
  signIndex: number; // 0 = Mesha, 1 = Vrishabha, ...
  signName: string;
  signNameNe: string;
  degreeInSign: number;
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraNameNe: string;
  pada: number;
  isRetrograde: boolean;
}

export interface KundaliResult {
  lagnaSignIndex: number;
  lagnaSignName: string;
  lagnaSignNameNe: string;
  lagnaDegree: number;
  planets: PlanetaryPosition[];
  ayanamshaDeg: number;
  panchang: {
    janmaRashi: string;
    tithiNameNe: string;
    tithiNumber: number;
    nakshatraNe: string;
  };
}

const RASHI_NAMES = [
  { en: "Aries", ne: "मेष" },
  { en: "Taurus", ne: "वृष" },
  { en: "Gemini", ne: "मिथुन" },
  { en: "Cancer", ne: "कर्कट" },
  { en: "Leo", ne: "सिंह" },
  { en: "Virgo", ne: "कन्या" },
  { en: "Libra", ne: "तुला" },
  { en: "Scorpio", ne: "वृश्चिक" },
  { en: "Sagittarius", ne: "धनु" },
  { en: "Capricorn", ne: "मकर" },
  { en: "Aquarius", ne: "कुम्भ" },
  { en: "Pisces", ne: "मीन" },
];

const NAKSHATRA_NAMES = [
  { en: "Ashwini", ne: "अश्विनी" },
  { en: "Bharani", ne: "भरणी" },
  { en: "Krittika", ne: "कृत्तिका" },
  { en: "Rohini", ne: "रोहिणी" },
  { en: "Mrigashira", ne: "मृगशिरा" },
  { en: "Ardra", ne: "आर्द्रा" },
  { en: "Punarvasu", ne: "पुनर्वसु" },
  { en: "Pushya", ne: "पुष्य" },
  { en: "Ashlesha", ne: "अश्लेषा" },
  { en: "Magha", ne: "मघा" },
  { en: "Purva Phalguni", ne: "पूर्वाफाल्गुनी" },
  { en: "Uttara Phalguni", ne: "उत्तराफाल्गुनी" },
  { en: "Hasta", ne: "हस्त" },
  { en: "Chitra", ne: "चित्रा" },
  { en: "Swati", ne: "स्वाती" },
  { en: "Vishakha", ne: "विशाखा" },
  { en: "Anuradha", ne: "अनुराधा" },
  { en: "Jyeshtha", ne: "ज्येष्ठा" },
  { en: "Moola", ne: "मूल" },
  { en: "Purva Ashadha", ne: "पूर्वाषाढा" },
  { en: "Uttara Ashadha", ne: "उत्तराषाढा" },
  { en: "Shravana", ne: "श्रवण" },
  { en: "Dhanishta", ne: "धनिष्ठा" },
  { en: "Shatabhisha", ne: "शतभिषा" },
  { en: "Purva Bhadrapada", ne: "पूर्वभाद्रपदा" },
  { en: "Uttara Bhadrapada", ne: "उत्तरभाद्रपदा" },
  { en: "Revati", ne: "रेवती" },
];

const TITHI_NAMES_NE = [
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पञ्चमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पूर्णिमा / औंसी",
];

/**
 * Calculates complete Sidereal Kundali using Swiss Ephemeris
 */
export async function calculateKundali(
  gregorianDate: Date,
  latitude: number,
  longitude: number,
): Promise<KundaliResult> {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    // 1. Convert Date & Time to UTC Decimal Hours
    const year = gregorianDate.getUTCFullYear();
    const month = gregorianDate.getUTCMonth() + 1;
    const day = gregorianDate.getUTCDate();
    const utHours =
      gregorianDate.getUTCHours() +
      gregorianDate.getUTCMinutes() / 60 +
      gregorianDate.getUTCSeconds() / 3600;

    // 2. Compute Julian Day Number
    const jd = swe.julday(year, month, day, utHours);

    // 3. Configure Sidereal Mode to Lahiri (NCS Ayanamsha)
    swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    const ayanamsha = swe.get_ayanamsa_ut(jd);

    // Flag for Sidereal positions with planetary speed
    const flags = swe.SEFLG_SIDEREAL | swe.SEFLG_SPEED;

    // 4. Planet Map Definitions
    const targetPlanets = [
      { id: swe.SE_SUN, en: "Sun", ne: "सूर्य" },
      { id: swe.SE_MOON, en: "Moon", ne: "चन्द्र" },
      { id: swe.SE_MARS, en: "Mars", ne: "मङ्गल" },
      { id: swe.SE_MERCURY, en: "Mercury", ne: "बुध" },
      { id: swe.SE_JUPITER, en: "Jupiter", ne: "गुरु" },
      { id: swe.SE_VENUS, en: "Venus", ne: "शुक्र" },
      { id: swe.SE_SATURN, en: "Saturn", ne: "शनि" },
      { id: swe.SE_MEAN_NODE, en: "Rahu", ne: "राहु" },
    ];

    const planets: PlanetaryPosition[] = [];

    for (const p of targetPlanets) {
      const pos = swe.calc_ut(jd, p.id, flags);
      const long = (pos[0] + 360) % 360;
      const speed = pos[3];

      const signIndex = Math.floor(long / 30);
      const degreeInSign = long % 30;
      const nakshatraIndex = Math.floor(long / (360 / 27));
      const pada = Math.floor((long % (360 / 27)) / (360 / 108)) + 1;

      planets.push({
        name: p.en,
        nameNe: p.ne,
        longitude: long,
        signIndex,
        signName: RASHI_NAMES[signIndex].en,
        signNameNe: RASHI_NAMES[signIndex].ne,
        degreeInSign,
        nakshatraIndex,
        nakshatraName: NAKSHATRA_NAMES[nakshatraIndex].en,
        nakshatraNameNe: NAKSHATRA_NAMES[nakshatraIndex].ne,
        pada,
        isRetrograde: speed < 0,
      });
    }

    // Add Ketu (180° opposite Rahu)
    const rahu = planets.find((p) => p.name === "Rahu")!;
    const ketuLong = (rahu.longitude + 180) % 360;
    const ketuSignIdx = Math.floor(ketuLong / 30);
    const ketuNakIdx = Math.floor(ketuLong / (360 / 27));

    planets.push({
      name: "Ketu",
      nameNe: "केतु",
      longitude: ketuLong,
      signIndex: ketuSignIdx,
      signName: RASHI_NAMES[ketuSignIdx].en,
      signNameNe: RASHI_NAMES[ketuSignIdx].ne,
      degreeInSign: ketuLong % 30,
      nakshatraIndex: ketuNakIdx,
      nakshatraName: NAKSHATRA_NAMES[ketuNakIdx].en,
      nakshatraNameNe: NAKSHATRA_NAMES[ketuNakIdx].ne,
      pada: Math.floor((ketuLong % (360 / 27)) / (360 / 108)) + 1,
      isRetrograde: rahu.isRetrograde,
    });

    // 5. Compute Lagna (Ascendant) using Houses Calculation
    // 'E' = Equal House System, widely used in Vedic Jyotish
    const houses = swe.houses_ex(jd, flags, latitude, longitude, "E");
    const ascendantTropical = houses.ascmc[0];
    const ascendantSidereal = (ascendantTropical + 360) % 360;
    const lagnaSignIndex = Math.floor(ascendantSidereal / 30);

    // 6. Panchang Metrics: Tithi Calculation
    const sun = planets.find((p) => p.name === "Sun")!;
    const moon = planets.find((p) => p.name === "Moon")!;
    const moonSunDiff = (moon.longitude - sun.longitude + 360) % 360;
    const tithiNumber = Math.floor(moonSunDiff / 12) + 1;
    const tithiIndex = (tithiNumber - 1) % 15;
    const paksha = tithiNumber <= 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    return {
      lagnaSignIndex,
      lagnaSignName: RASHI_NAMES[lagnaSignIndex].en,
      lagnaSignNameNe: RASHI_NAMES[lagnaSignIndex].ne,
      lagnaDegree: ascendantSidereal % 30,
      planets,
      ayanamshaDeg: ayanamsha,
      panchang: {
        janmaRashi: moon.signName,
        tithiNameNe: `${paksha} - ${TITHI_NAMES_NE[tithiIndex]}`,
        tithiNumber,
        nakshatraNe: moon.nakshatraNameNe,
      },
    };
  } finally {
    // Always release WASM memory resources
    swe.close();
  }
}
