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

export const MAJOR_NEPALI_CITIES = [
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
  { name: "Pokhara", lat: 28.2096, lon: 83.9856 },
  { name: "Biratnagar", lat: 26.4525, lon: 87.2718 },
  { name: "Chitwan", lat: 27.5291, lon: 84.3542 },
  { name: "Butwal", lat: 27.7, lon: 83.45 },
  { name: "Nepalgunj", lat: 28.05, lon: 81.6167 },
  { name: "Dhangadhi", lat: 28.6833, lon: 80.6 },
];
