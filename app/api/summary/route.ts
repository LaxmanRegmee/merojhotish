import { NextResponse } from "next/server";
import { buildAstrologySummaryPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA API key is missing in server environment." },
        { status: 500 },
      );
    }

    const { chartData, language } = await req.json();

    if (!chartData) {
      return NextResponse.json(
        { error: "No chart data provided." },
        { status: 400 },
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
            { role: "system", content: buildAstrologySummaryPrompt(chartData) },
            { role: "user", content: buildAstrologySummaryPrompt(chartData) },
          ],
          temperature: 1,
          max_tokens: 1200,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Free API rate limit reached. Please wait a moment and try again.",
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: `NVIDIA API Error: ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const summary =
      data.choices?.[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate summary." },
      { status: 500 },
    );
  }
}
