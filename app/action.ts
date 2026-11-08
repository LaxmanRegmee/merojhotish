// app/actions.ts
"use server";

import { bsToAd } from "@/lib/bs-converter";
import { generateFullBirthChart } from "@/lib/jyotish-engine";

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

  const [hours, minutes] = birthTime.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 23 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(
      "Please enter a valid birth time (hour 00-23, minute 00-59).",
    );
  }

  // Convert BS to AD Date
  const adDate = bsToAd(bsYear, bsMonth, bsDay);

  // Nepal Standard Time is UTC+5:45. Build a UTC timestamp for the local
  // Nepal time, then subtract the offset to get true UTC.
  const utcOffsetMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000; // 5h45m
  const localTimestamp = Date.UTC(
    adDate.getUTCFullYear(),
    adDate.getUTCMonth(),
    adDate.getUTCDate(),
    hours,
    minutes,
  );
  const utcDate = new Date(localTimestamp - utcOffsetMs);

  // Compute Sidereal Kundali
  const chartData = await generateFullBirthChart(utcDate, lat, lon, {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
  });

  if (!chartData.lagna || !chartData.panchang || !chartData.avakahada) {
    throw new Error("The birth chart response is incomplete.");
  }

  return chartData;
}
