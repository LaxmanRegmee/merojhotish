// app/api/compatibility/route.ts
import { NextResponse } from "next/server";
import { bsToAd } from "@/lib/bs-converter";
import { generateFullBirthChart, calculateDashakoota } from "@/lib/jyotish-engine";
import { compatibilityRateLimiter, getClientIp } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = compatibilityRateLimiter.check(clientIp);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
          },
        },
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = [
      "bsYear1", "bsMonth1", "bsDay1", "birthTime1", "city1",
      "bsYear2", "bsMonth2", "bsDay2", "birthTime2", "city2",
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Parse and validate dates
    const parseBirthData = (prefix: string) => {
      const bsYear = Number(body[`bsYear${prefix}`]);
      const bsMonth = Number(body[`bsMonth${prefix}`]);
      const bsDay = Number(body[`bsDay${prefix}`]);
      const birthTime = String(body[`birthTime${prefix}`]);
      const city = String(body[`city${prefix}`]);

      // Validate date components
      if (!Number.isInteger(bsYear) || bsYear < 1900 || bsYear > 2100) {
        throw new Error(`Invalid BS year for person ${prefix}`);
      }
      if (!Number.isInteger(bsMonth) || bsMonth < 1 || bsMonth > 12) {
        throw new Error(`Invalid BS month for person ${prefix}`);
      }
      if (!Number.isInteger(bsDay) || bsDay < 1 || bsDay > 32) {
        throw new Error(`Invalid BS day for person ${prefix}`);
      }
      if (!/^\d{2}:\d{2}$/.test(birthTime)) {
        throw new Error(`Invalid birth time format for person ${prefix}. Use HH:MM`);
      }
      
      const cityCoords = city.split(",");
      if (cityCoords.length !== 2) {
        throw new Error(`Invalid city coordinates for person ${prefix}`);
      }
      
      const lat = parseFloat(cityCoords[0]);
      const lon = parseFloat(cityCoords[1]);
      
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        throw new Error(`Invalid latitude for person ${prefix}`);
      }
      if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
        throw new Error(`Invalid longitude for person ${prefix}`);
      }

      return { bsYear, bsMonth, bsDay, birthTime, lat, lon };
    };

    const person1 = parseBirthData("1");
    const person2 = parseBirthData("2");

    // Convert BS to AD and create UTC dates
    const createUtcDate = (bsYear: number, bsMonth: number, bsDay: number, birthTime: string) => {
      const adDate = bsToAd(bsYear, bsMonth, bsDay);
      const [hours, minutes] = birthTime.split(":").map((v) => parseInt(v, 10));
      
      // Nepal Standard Time is UTC+5:45
      const utcTimestamp = Date.UTC(
        adDate.getUTCFullYear(),
        adDate.getUTCMonth(),
        adDate.getUTCDate(),
        hours - 5,
        minutes - 45,
      );
      
      return new Date(utcTimestamp);
    };

    const utcDate1 = createUtcDate(person1.bsYear, person1.bsMonth, person1.bsDay, person1.birthTime);
    const utcDate2 = createUtcDate(person2.bsYear, person2.bsMonth, person2.bsDay, person2.birthTime);

    // Generate birth charts for both persons
    const [chart1, chart2] = await Promise.all([
      generateFullBirthChart(utcDate1, person1.lat, person1.lon, {
        year: person1.bsYear,
        month: person1.bsMonth,
        day: person1.bsDay,
      }),
      generateFullBirthChart(utcDate2, person2.lat, person2.lon, {
        year: person2.bsYear,
        month: person2.bsMonth,
        day: person2.bsDay,
      }),
    ]);

    // Calculate compatibility using Dashakoota
    const language = body.language === "np" ? "np" : "en";
    const compatibility = calculateDashakoota(chart1, chart2, language);

    // Return only necessary data (privacy: don't return full planet details)
    const response = {
      person1: {
        birthDetails: chart1.birthDetails,
        lagna: chart1.lagna,
        avakahada: chart1.avakahada,
        panchang: chart1.panchang,
      },
      person2: {
        birthDetails: chart2.birthDetails,
        lagna: chart2.lagna,
        avakahada: chart2.avakahada,
        panchang: chart2.panchang,
      },
      compatibility,
    };

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
      },
    });
  } catch (error: unknown) {
    // Log error server-side without exposing details to client
    console.error("Compatibility API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to calculate compatibility";
    
    // Don't expose internal errors to client
    const clientMessage = errorMessage.includes("Invalid") || errorMessage.includes("required")
      ? errorMessage
      : "Failed to calculate compatibility. Please check your inputs and try again.";
    
    return NextResponse.json(
      { error: clientMessage },
      { status: errorMessage.includes("Invalid") || errorMessage.includes("required") ? 400 : 500 },
    );
  }
}