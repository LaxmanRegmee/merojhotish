// app/api/summary/route.ts
import { NextResponse } from "next/server";
import { buildAstrologySummaryPrompt } from "@/lib/prompts";
import { summaryRateLimiter, getClientIp } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = summaryRateLimiter.check(clientIp);
    
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

    // Validate request body
    let body: { chartData: unknown; language?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { chartData, language = "en" } = body;

    if (!chartData || typeof chartData !== "object") {
      return NextResponse.json(
        { error: "Chart data is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-ultra-550b-a55b",
          messages: [
            { role: "system", content: buildAstrologySummaryPrompt(chartData as Record<string, unknown>) },
            { role: "user", content: buildAstrologySummaryPrompt(chartData as Record<string, unknown>) },
          ],
          temperature: 1,
          max_tokens: 1200,
          reasoning: { enabled: false },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`NVIDIA API error (${response.status}):`, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Free API rate limit reached. Please wait a moment and try again.",
          },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Remaining": String(rateLimit.remaining),
              "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
            },
          },
        );
      }
      return NextResponse.json(
        { error: "AI service error. Please try again later." },
        { 
          status: response.status,
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
          },
        },
      );
    }

    const data = await response.json();
    const summary =
      data.choices?.[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ summary }, {
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
      },
    });
  } catch (error: unknown) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 },
    );
  }
}