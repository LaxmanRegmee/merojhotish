// lib/bs-converter.ts
// The package does not ship TypeScript declarations.
// @ts-expect-error Missing declaration file for "bikram-sambat".
import * as BikramSambat from "bikram-sambat";

export function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  const ad = BikramSambat.toGreg(bsYear, bsMonth, bsDay);
  return new Date(Date.UTC(ad.year, ad.month - 1, ad.day));
}

export const NEPALI_MONTHS = [
  "वैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कात्तिक",
  "मंसिर",
  "पुस",
  "माघ",
  "फागुन",
  "चैत",
];

export const MAJOR_NEPALI_CITIES = [
  { name: "काठमाडौँ (Kathmandu)", lat: 27.7172, lon: 85.324 },
  { name: "पोखरा (Pokhara)", lat: 28.2096, lon: 83.9856 },
  { name: "विराटनगर (Biratnagar)", lat: 26.4525, lon: 87.2718 },
  { name: "चितवन (Chitwan)", lat: 27.5291, lon: 84.3542 },
  { name: "बुटवल (Butwal)", lat: 27.7, lon: 83.45 },
  { name: "नेपालगञ्ज (Nepalgunj)", lat: 28.05, lon: 81.6167 },
  { name: "धनगढी (Dhangadhi)", lat: 28.6833, lon: 80.6 },
];
