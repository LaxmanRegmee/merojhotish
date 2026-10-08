import { buildAstrologyChatPrompt } from "@/lib/prompts";

function getProviderErrorMessage(payload: string, status: number) {
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

  return payload || `The AI service returned an error (${status}).`;
}

export async function POST(req: Request) {
  const { messages, reportData, language = "en" } = await req.json();

  const response = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          {
            role: "system",
            content: buildAstrologyChatPrompt(reportData, language),
          },
          ...messages,
        ],
        stream: true,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    const message =
      response.status === 429
        ? "The AI service is busy with too many requests. Please wait a moment and try again."
        : getProviderErrorMessage(errorText, response.status);

    return Response.json({ error: message }, { status: response.status });
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
    },
  });
}
