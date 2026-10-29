// app/action.ts
"use server";

import { z } from "zod";
import { bsToAd } from "@/lib/bs-converter";
import { generateFullBirthChart } from "@/lib/jyotish-engine";

// Validation schema for birth chart input
const BirthChartInputSchema = z.object({
  bsYear: z.number().int().min(1900).max(2100),
  bsMonth: z.number().int().min(1).max(12),
  bsDay: z.number().int().min(1).max(32),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format. Use HH:MM"),
  city: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, "Invalid city coordinates"),
});

type BirthChartInput = z.infer<typeof BirthChartInputSchema>;

export async function generateKundaliAction(formData: FormData) {
  // Parse and validate input
  const rawInput = {
    bsYear: Number(formData.get("bsYear")),
    bsMonth: Number(formData.get("bsMonth")),
    bsDay: Number(formData.get("bsDay")),
    birthTime: String(formData.get("birthTime") ?? ""),
    city: String(formData.get("city") ?? ""),
  };

  const validationResult = BirthChartInputSchema.safeParse(rawInput);
  
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    throw new Error(`Invalid input: ${errors}`);
  }

  const { bsYear, bsMonth, bsDay, birthTime, city } = validationResult.data;
  const cityCoords = city.split(",");
  const lat = parseFloat(cityCoords[0]);
  const lon = parseFloat(cityCoords[1]);

  // Additional coordinate validation
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error("Invalid coordinates: latitude must be -90 to 90, longitude -180 to 180");
  }

  // Convert BS to AD Date
  const adDate = bsToAd(bsYear, bsMonth, bsDay);
  const [hours, minutes] = birthTime.split(":").map((v) => parseInt(v, 10));

  // Validate time components
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time: hours must be 0-23, minutes 0-59");
  }

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