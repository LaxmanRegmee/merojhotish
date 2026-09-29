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
  { name: "Kathmandu", nameNe: "काठमाडौं", lat: 27.7172, lon: 85.324 },
  { name: "Pokhara", nameNe: "पोखरा", lat: 28.2096, lon: 83.9856 },
  { name: "Biratnagar", nameNe: "विराटनगर", lat: 26.4525, lon: 87.2718 },
  { name: "Chitwan", nameNe: "चितवन", lat: 27.5291, lon: 84.3542 },
  { name: "Butwal", nameNe: "बुटवल", lat: 27.7, lon: 83.45 },
  { name: "Nepalgunj", nameNe: "नेपालगञ्ज", lat: 28.05, lon: 81.6167 },
  { name: "Dhangadhi", nameNe: "धनगढी", lat: 28.6833, lon: 80.6 },
];
