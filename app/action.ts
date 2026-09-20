// app/actions.ts
"use server";

import { bsToAd } from "@/libs/bs-converter";
import { generateFullBirthChart } from "@/libs/jyotish-engine";

export async function generateKundaliAction(formData: FormData) {
  const bsYear = parseInt(formData.get("bsYear") as string, 10);
  const bsMonth = parseInt(formData.get("bsMonth") as string, 10);
  const bsDay = parseInt(formData.get("bsDay") as string, 10);
  const birthTime = formData.get("birthTime") as string; // "08:30"
  const cityCoords = (formData.get("city") as string).split(",");

  const lat = parseFloat(cityCoords[0]);
  const lon = parseFloat(cityCoords[1]);

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
