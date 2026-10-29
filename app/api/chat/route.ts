// app/api/chat/route.ts
import { buildAstrologyChatPrompt } from "@/lib/prompts";
import { env } from "@/lib/env";
import { getRateLimiter, getClientIp } from "@/lib/rate-limiter";

function getProviderErrorMessage(payload: string, status: number): string {
  try {
    const parsed = JSON.parse(payload);
    const providerError = parsed.error;
    const message =
      typeof providerError === "string"
        ? providerError
        : providerError?.message || parsed.message;

    if (message) return message;
  } catch {
    // Use the raw response when the provider did not return JSON.
  }

  return `The AI service returned an error (${status}).`;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimiter = getRateLimiter("chat");
    const rateLimit = rateLimiter.check(clientIp);
    
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Validate request body
    let body: { messages: unknown; reportData: unknown; language?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages, reportData, language = "en" } = body;

    // Basic validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!reportData || typeof reportData !== "object") {
      return Response.json(
        { error: "Report data is required" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate messages structure
    for (const msg of messages) {
      if (!msg || typeof msg !== "object" || !("role" in msg) || !("content" in msg)) {
        return Response.json(
          { error: "Each message must have role and content" },
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      const m = msg as { role: string; content: string };
      if (!["user", "assistant", "system"].includes(m.role)) {
        return Response.json(
          { error: "Invalid message role" },
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      if (typeof m.content !== "string" || m.content.length > 4000) {
        return Response.json(
          { error: "Message content must be a string under 4000 characters" },
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const apiKey = env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error("NVIDIA_API_KEY not configured");
      return Response.json(
        { error: "AI service is not configured" },
        { status: 500, headers: { "Content-Type": "application/json" } },
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
            {
              role: "system",
              content: buildAstrologyChatPrompt(reportData as Record<string, unknown>, language),
            },
            ...messages,
          ],
          stream: true,
          reasoning: { enabled: false },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      // Log server-side for debugging (without API key)
      console.error(`NVIDIA API error (${response.status}):`, errorText);
      
      const message =
        response.status === 429
          ? "The AI service is busy with too many requests. Please wait a moment and try again."
          : getProviderErrorMessage(errorText, response.status);

      return Response.json(
        { error: message },
        { 
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let pending = "";
        const encoder = new TextEncoder();

        const sendEvent = (event: { content?: string; error?: string }) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        };

        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") return;

          if (trimmed.startsWith("data: ")) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                sendEvent({ content });
              }
              if (json.error) {
                sendEvent({
                  error: getProviderErrorMessage(JSON.stringify(json), 502),
                });
              }
            } catch {
              sendEvent({
                error:
                  "The AI service returned an invalid response. Please try again.",
              });
            }
          }
        };

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            pending += decoder.decode(value, { stream: true });
            const lines = pending.split("\n");
            pending = lines.pop() ?? "";
            lines.forEach(processLine);
          }

          pending += decoder.decode();
          if (pending) processLine(pending);
        } catch (err) {
          // Log error server-side without exposing to client
          console.error("Stream error:", err);
          sendEvent({
            error:
              "The AI service stopped responding. Please wait a moment and try again.",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}