import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "NVIDIA API key is missing in server environment." },
        { status: 500 },
      );
    }

    const { person1, person2, language = "en" } = await req.json();

    if (!person1 || !person2) {
      return NextResponse.json(
        { error: "Both persons' birth data are required." },
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
          model: "nvidia/nemotron-3-super-120b-a12b",
          messages: [
            {
              role: "system",
              content: `You are an expert Vedic astrologer specializing in marriage compatibility (Guna Milan / Kundali matching). Reply in ${
                language === "np" ? "Nepali" : "English"
              }.`,
            },
            {
              role: "user",
              content: `Analyze the marriage compatibility between two people based on their birth charts:

Person 1: ${JSON.stringify(person1, null, 2)}
Person 2: ${JSON.stringify(person2, null, 2)}

Provide a concise compatibility assessment covering:
1. Overall compatibility score (out of 36 gunas if calculable)
2. Key strengths of the match
3. Potential challenges
4. Recommendations

Reply in ${language === "np" ? "Nepali" : "English"}.`,
            },
          ],
          temperature: 0.7,
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
    const result =
      data.choices?.[0]?.message?.content || "No compatibility analysis generated.";

    return NextResponse.json({ compatibility: result });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : "Failed to generate compatibility analysis.",
      },
      { status: 500 },
    );
  }
}
