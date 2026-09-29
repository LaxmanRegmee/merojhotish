import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is missing in server environment." },
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

    const isNepali = language === "np";

    const systemPrompt = isNepali
      ? `तपाईं एक अनुभवी वैदिक ज्योतिषी हुनुहुन्छ।
प्रदान गरिएको जन्म कुण्डली विवरणको विश्लेषण गरी देवनागरी नेपाली भाषामा स्पष्ट र सरल सारांश (Markdown) प्रस्तुत गर्नुहोस्।
सारांशलाई ४ भागमा विभाजन गर्नुहोस्:
१. **लग्न र व्यक्तित्व स्वभाव**
२. **मुख्य ग्रह स्थिति र शक्ति**
३. **पेसा, करियर र जीवन मार्ग**
४. **वर्तमान दशा र ज्योतिषीय परामर्श**`
      : `You are an expert Vedic Astrologer (Jyotish). 
Analyze the provided Kundali / birth chart details and generate a clear, empowering summary in Markdown format.
Structure your summary into 4 distinct sections:
1. **Core Temperament & Lagna Overview**
2. **Key Planetary Influences & Strengths**
3. **Career & Life Path Outlook**
4. **Current Dasha & Astrological Guidance**`;

    const userPrompt = `Kundali birth chart data:
${JSON.stringify(chartData, null, 2)}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://merojhotish.vercel.app",
          "X-Title": "MeroJyotish Astrology App",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
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
        { error: `OpenRouter API Error: ${errorText}` },
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
