// lib/bs-converter.ts
// The package does not ship TypeScript declarations.
// @ts-expect-error Missing declaration file for "bikram-sambat".
import * as BikramSambat from "bikram-sambat";

export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  const ad = BikramSambat.toGreg(bsYear, bsMonth, bsDay);
  return new Date(Date.UTC(ad.year, ad.month - 1, ad.day));
}

export const NEPALI_MONTHS = [
  "Baishak",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const NEPALI_MONTHS_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुण",
  "चैत्र",
];

export const MAJOR_NEPALI_CITIES = [
  // Major Metropolises & Sub-Metropolises
  { name: "Kathmandu", nameNe: "काठमाडौं", lat: 27.7172, lon: 85.324 },
  { name: "Pokhara", nameNe: "पोखरा", lat: 28.2096, lon: 83.9856 },
  { name: "Lalitpur", nameNe: "ललितपुर", lat: 27.6667, lon: 85.3167 },
  { name: "Bharatpur", nameNe: "भरतपुर", lat: 27.6833, lon: 84.4333 },
  { name: "Biratnagar", nameNe: "विराटनगर", lat: 26.4525, lon: 87.2718 },
  { name: "Birgunj", nameNe: "वीरगञ्ज", lat: 27.0, lon: 84.8667 },
  { name: "Dharan", nameNe: "धरान", lat: 26.8124, lon: 87.2847 },
  { name: "Itahari", nameNe: "इटहरी", lat: 26.6644, lon: 87.2718 },
  { name: "Janakpur", nameNe: "जनकपुर", lat: 26.7288, lon: 85.9254 },
  { name: "Butwal", nameNe: "बुटवल", lat: 27.7, lon: 83.45 },
  { name: "Hetauda", nameNe: "हेटौंडा", lat: 27.4286, lon: 85.0322 },
  { name: "Nepalgunj", nameNe: "नेपालगञ्ज", lat: 28.05, lon: 81.6167 },
  { name: "Dhangadhi", nameNe: "धनगढी", lat: 28.6833, lon: 80.6 },
  { name: "Birendranagar", nameNe: "वीरेन्द्रनगर", lat: 28.6, lon: 81.6333 },
  { name: "Tulsipur", nameNe: "तुलसीपुर", lat: 28.1311, lon: 82.2972 },
  { name: "Ghorahi", nameNe: "घोराही", lat: 28.0333, lon: 82.4833 },
  { name: "Siddharthanagar", nameNe: "सिद्धार्थनगर", lat: 27.5, lon: 83.45 },

  // Koshi Province (District HQ & Major Hubs)
  { name: "Bhadrapur", nameNe: "भद्रपुर", lat: 26.5443, lon: 88.0929 },
  { name: "Birtamod", nameNe: "बिर्तामोड", lat: 26.6333, lon: 87.9833 },
  { name: "Damak", nameNe: "दमक", lat: 26.6667, lon: 87.7 },
  { name: "Ilam", nameNe: "इलाम", lat: 26.9089, lon: 87.9286 },
  { name: "Phidim", nameNe: "फिदिम", lat: 27.15, lon: 87.7667 },
  { name: "Fungling", nameNe: "फुङ्लिङ", lat: 27.35, lon: 87.6667 },
  { name: "Dhankuta", nameNe: "धनकुटा", lat: 26.9833, lon: 87.3333 },
  { name: "Myanglung", nameNe: "म्याङ्लुङ", lat: 27.1333, lon: 87.5333 },
  { name: "Khandbari", nameNe: "खाँदबारी", lat: 27.3742, lon: 87.2039 },
  { name: "Bhojpur", nameNe: "भोजपुर", lat: 27.17, lon: 87.05 },
  { name: "Salleri", nameNe: "सल्लेरी", lat: 27.5, lon: 86.5833 },
  { name: "Namche Bazaar", nameNe: "नाम्चे बजार", lat: 27.8069, lon: 86.714 },
  { name: "Okhaldhunga", nameNe: "ओखलढुङ्गा", lat: 27.3167, lon: 86.5 },
  { name: "Diktel", nameNe: "दिक्तेल", lat: 27.2, lon: 86.7833 },
  { name: "Gaighat", nameNe: "गाईघाट", lat: 26.8431, lon: 86.7022 },
  { name: "Inaruwa", nameNe: "इनरुवा", lat: 26.6, lon: 87.15 },

  // Madhesh Province (District HQ & Major Hubs)
  { name: "Rajbiraj", nameNe: "राजविराज", lat: 26.5414, lon: 86.7456 },
  { name: "Lahan", nameNe: "लहान", lat: 26.7297, lon: 86.4817 },
  { name: "Siraha", nameNe: "सिराहा", lat: 26.6528, lon: 86.2081 },
  { name: "Jaleshwar", nameNe: "जलेश्वर", lat: 26.6472, lon: 85.8028 },
  { name: "Malangwa", nameNe: "मलङ्गवा", lat: 26.8569, lon: 85.5581 },
  { name: "Gaur", nameNe: "गौर", lat: 26.7667, lon: 85.2833 },
  { name: "Kalaiya", nameNe: "कलैया", lat: 27.0306, lon: 85.0028 },
  { name: "Simara", nameNe: "सिमरा", lat: 27.1583, lon: 84.9806 },

  // Bagmati Province (District HQ & Major Hubs)
  { name: "Bhaktapur", nameNe: "भक्तपुर", lat: 27.671, lon: 85.4298 },
  { name: "Dhulikhel", nameNe: "धुलिखेल", lat: 27.6222, lon: 85.5539 },
  { name: "Banepa", nameNe: "बनेपा", lat: 27.6297, lon: 85.5214 },
  { name: "Chautara", nameNe: "चौतारा", lat: 27.7833, lon: 85.7167 },
  { name: "Charikot", nameNe: "चरीकोट", lat: 27.6667, lon: 86.05 },
  { name: "Manthali", nameNe: "मन्थली", lat: 27.3878, lon: 86.0622 },
  { name: "Sindhulimadi", nameNe: "सिन्धुलीमाढी", lat: 27.2167, lon: 85.9167 },
  { name: "Dhading Besi", nameNe: "धादिङबेसी", lat: 27.8667, lon: 84.9 },
  { name: "Bidur", nameNe: "विदुर", lat: 27.9167, lon: 85.15 },
  { name: "Dhunche", nameNe: "धुन्चे", lat: 28.1167, lon: 85.3 },

  // Gandaki Province (District HQ & Major Hubs)
  { name: "Damauli", nameNe: "दमौली", lat: 27.9667, lon: 84.2833 },
  { name: "Besisahar", nameNe: "बेसीशहर", lat: 28.2333, lon: 84.3833 },
  { name: "Gorkha", nameNe: "गोरखा", lat: 28.0, lon: 84.6333 },
  { name: "Chame", nameNe: "चामे", lat: 28.55, lon: 84.2333 },
  { name: "Jomsom", nameNe: "जोमसोम", lat: 28.7833, lon: 83.7333 },
  { name: "Beni", nameNe: "बेनी", lat: 28.3442, lon: 83.5642 },
  { name: "Kusma", nameNe: "कुश्मा", lat: 28.2333, lon: 83.6833 },
  { name: "Baglung", nameNe: "बागलुङ", lat: 28.2667, lon: 83.6 },
  { name: "Syangja", nameNe: "स्याङ्जा", lat: 28.0833, lon: 83.8667 },
  { name: "Kawasoti", nameNe: "कावासोती", lat: 27.65, lon: 84.1333 },

  // Lumbini Province (District HQ & Major Hubs)
  { name: "Parasi", nameNe: "परासी", lat: 27.5333, lon: 83.6667 },
  { name: "Taulihawa", nameNe: "तौलिहवा", lat: 27.55, lon: 83.05 },
  { name: "Tansen", nameNe: "तानसेन", lat: 27.8667, lon: 83.55 },
  { name: "Sandhikharka", nameNe: "सन्धिखर्क", lat: 27.96, lon: 83.12 },
  { name: "Tamghas", nameNe: "तमघास", lat: 28.0667, lon: 83.25 },
  { name: "Lamahi", nameNe: "लमाही", lat: 27.8667, lon: 82.3 },
  { name: "Pyuthan", nameNe: "प्युठान", lat: 28.1, lon: 82.8667 },
  { name: "Liwang", nameNe: "लिवाङ", lat: 28.3, lon: 82.6333 },
  { name: "Rukumkot", nameNe: "रुकुमकोट", lat: 28.6, lon: 82.6333 },
  { name: "Kohalpur", nameNe: "कोहलपुर", lat: 28.1833, lon: 81.6833 },
  { name: "Gulariya", nameNe: "गुलेरिया", lat: 28.2333, lon: 81.3333 },

  // Karnali Province (District HQ & Major Hubs)
  { name: "Musikot", nameNe: "मुसिकोट", lat: 28.6333, lon: 82.4667 },
  { name: "Salyan", nameNe: "सल्यान", lat: 28.3833, lon: 82.1667 },
  { name: "Dailekh", nameNe: "दैलेख", lat: 28.8333, lon: 81.7 },
  { name: "Jajarkot", nameNe: "जाजरकोट", lat: 28.7, lon: 82.2 },
  { name: "Dunai", nameNe: "दुनै", lat: 28.9333, lon: 82.9167 },
  { name: "Jumla", nameNe: "जुम्ला", lat: 29.2747, lon: 82.1838 },
  { name: "Manma", nameNe: "मान्म", lat: 29.15, lon: 81.6167 },
  { name: "Gamgadhi", nameNe: "गमगढी", lat: 29.55, lon: 82.1667 },
  { name: "Simikot", nameNe: "सिमिकोट", lat: 29.9667, lon: 81.8333 },

  // Sudurpashchim Province (District HQ & Major Hubs)
  { name: "Tikapur", nameNe: "टीकापुर", lat: 28.5, lon: 81.1333 },
  { name: "Bhimdatta", nameNe: "महेन्द्रनगर", lat: 28.9667, lon: 80.1833 },
  { name: "Martadi", nameNe: "मार्तडी", lat: 29.45, lon: 81.3 },
  { name: "Chainpur", nameNe: "चैनपुर", lat: 29.55, lon: 81.2 },
  { name: "Darchula", nameNe: "दार्चुला", lat: 29.85, lon: 80.5333 },
  { name: "Baitadi", nameNe: "बैतडी", lat: 29.5333, lon: 80.4167 },
  { name: "Dadeldhura", nameNe: "डडेल्धुरा", lat: 29.3, lon: 80.5833 },
  {
    name: "Dipayal Silgadhi",
    nameNe: "दिपायल सिलगढी",
    lat: 29.2667,
    lon: 80.9333,
  },
  { name: "Mangalsen", nameNe: "मङ्गलसेन", lat: 29.1333, lon: 81.2667 },
];
