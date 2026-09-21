// app/actions.ts
"use server";

import { bsToAd } from "@/libs/bs-converter";
import { generateFullBirthChart } from "@/libs/jyotish-engine";

export async function generateKundaliAction(formData: FormData) {
  const bsYear = Number(formData.get("bsYear"));
  const bsMonth = Number(formData.get("bsMonth"));
  const bsDay = Number(formData.get("bsDay"));
  const birthTime = String(formData.get("birthTime") ?? "");
  const city = String(formData.get("city") ?? "");
  const cityCoords = city.split(",");

  const lat = parseFloat(cityCoords[0]);
  const lon = parseFloat(cityCoords[1]);

  if (
    !Number.isInteger(bsYear) ||
    !Number.isInteger(bsMonth) ||
    !Number.isInteger(bsDay) ||
    !/^\d{2}:\d{2}$/.test(birthTime) ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {
    throw new Error("Please enter a valid birth date, time, and birthplace.");
  }

  // Convert BS to AD Date
  const adDate = bsToAd(bsYear, bsMonth, bsDay);
  const [hours, minutes] = birthTime.split(":").map((v) => parseInt(v, 10));

  // Set Local Time in Nepal Standard Time (UTC+5:45) -> Subtract 5h 45m for UTC
  const utcTimestamp = Date.UTC(
    adDate.getUTCFullYear(),
    adDate.getUTCMonth(),
    adDate.getUTCDate(),
    hours - 5,
    minutes - 45,
  );

  const utcDate = new Date(utcTimestamp);

  // Compute Sidereal Kundali
  const chartData = await generateFullBirthChart(utcDate, lat, lon);

  if (!chartData.lagna || !chartData.panchang || !chartData.avakahada) {
    throw new Error("The birth chart response is incomplete.");
  }

  return chartData;
}
