"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Language } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bubble, BubbleContent } from "./ui/bubble";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loadingAnimation from "@/components/animations/loadinganimation.json";
import type { CompleteBirthChartReport } from "@/lib/jyotish-engine";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isSuggestion?: boolean;
}

interface AIChatProps {
  reportData: CompleteBirthChartReport;
  language?: Language;
}

// Generate unique ID without using Date.now in render
let idCounter = 0;
function generateId(): string {
  return `${Date.now()}-${++idCounter}`;
}

export default function AIChat({ reportData, language = "en" }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const assistantContentRef = useRef("");
  const submittingRef = useRef(false);
  const userHasScrolledRef = useRef(false);

  const isNepali = language === "np";

  // Default suggestions from Figma design
  const defaultSuggestions = useMemo(
    () => [
      "What is my career like?",
      "am i gonna be married in next 5 years?",
      "what does mangal dosha mean?",
    ],
    [],
  );

  // Auto-scroll to bottom when new messages arrive, but only if user hasn't scrolled up
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current && !userHasScrolledRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, analyzing, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      // User has scrolled up if they're not at the bottom
      userHasScrolledRef.current = scrollTop + clientHeight < scrollHeight - 50;
    }
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    void handleSubmit(
      new Event("submit") as unknown as React.FormEvent,
      suggestion,
    );
  };

  const handleSubmit = async (e: React.FormEvent, messageOverride?: string) => {
    e.preventDefault();
    const userMessage = (messageOverride ?? input).trim();
    if (!userMessage || loading || submittingRef.current) return;
    submittingRef.current = true;

    setInput("");
    setError(null);
    setShowSuggestions(false);
    userHasScrolledRef.current = false;

    const newUserMessage: Message = {
      id: generateId(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setAnalyzing(true);
    assistantContentRef.current = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          reportData,
          language,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = errorText;
        try {
          const errorPayload = JSON.parse(errorText);
          errorMessage =
            errorPayload.error || errorPayload.message || errorText;
        } catch {
          // Keep the raw response when the API did not return JSON.
        }
        throw new Error(`API Error: ${errorMessage}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const assistantMessageId = generateId();
      let pending = "";

      const processEvent = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") return;
        if (!trimmed.startsWith("data: ")) return;

        const event = JSON.parse(trimmed.slice(6)) as {
          content?: string;
          error?: string;
        };

        if (event.error) throw new Error(event.error);
        if (event.content) {
          assistantContentRef.current += event.content;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: assistantContentRef.current,
                    isStreaming: true,
                  }
                : m,
            ),
          );
        }
      };

      // Add empty assistant message with streaming flag
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          isStreaming: true,
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        pending += decoder.decode(value, { stream: true });
        const lines = pending.split("\n");
        pending = lines.pop() ?? "";
        lines.forEach(processEvent);
      }

      pending += decoder.decode();
      if (pending) processEvent(pending);

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m,
        ),
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      // Remove the empty assistant message if there was an error
      setMessages((prev) =>
        prev.filter((m) => m.content !== "" || m.role === "user"),
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <section
      id="ai-chat"
      className="w-full min-h-172 h-full gap-6 md:px-8 md:py-8 "
    >
      <Card className="h-[calc(100vh-100px)] border-0! shadow-none! flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className=" shrink-0">
          <h2 className="text-2xl px-6 pb-6 font-medium leading-8 text-foreground tracking-normal">
            {isNepali ? "च्याट" : "Chat"}
          </h2>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="scroll-fade no-scrollbar flex-1 overflow-y-auto h-full gap-6 py-5 px-5 flex flex-col"
          role="log"
          aria-live="polite"
          aria-label={isNepali ? "च्याट सन्देशहरू" : "Chat messages"}
        >
          {showSuggestions && messages.length === 0 && (
            // Initial state with suggestion bubbles - pushed to bottom
            <div className="flex flex-col flex-1 w-full">
              {/* Spacer pushes suggestions to bottom */}
              <div className="flex-1" />
              <div className="flex flex-col gap-2.5 items-end w-full">
                {defaultSuggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="w-full flex justify-end"
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{ cursor: "pointer" }}
                  >
                    <Bubble variant="outline" align="end" className="w-fit">
                      <BubbleContent
                        className="px-3 py-2.5 rounded-3xl"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </BubbleContent>
                    </Bubble>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <Bubble
              key={message.id}
              variant={message.role === "user" ? "secondary" : "ghost"} // also fix: user=default, assistant=secondary
              align={message.role === "user" ? "end" : "start"}
              className="w-fit max-w-[80%]"
            >
              <BubbleContent className="p-3 rounded-3xl">
                {message.role === "assistant" ? (
                  <div className="text-sm leading-6 [&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_hr]:my-4 [&_hr]:border-border">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-5 whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
              </BubbleContent>
            </Bubble>
          ))}

          {analyzing && (
            // Analyzing state marker (Figma 192-1847)
            <div className="flex justify-start flex-col gap-2 items-start w-full">
              <div className="flex items-center gap-1">
                <div className="h-18 w-18">
                  <DotLottieReact
                    data={JSON.stringify(loadingAnimation)}
                    loop
                    autoplay
                    speed={1}
                    mode="bounce"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {loading &&
            messages[messages.length - 1]?.role === "user" &&
            !analyzing && (
              // Streaming indicator
              <div className="flex justify-start">
                <Card className="bg-secondary text-secondary-foreground rounded-[22px] rounded-tl-none px-3 py-2.5 w-full border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="flex gap-1 items-center">
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {error && (
            <Bubble
              variant="destructive"
              align="start"
              className="w-fit max-w-[80%]"
            >
              <BubbleContent className="group/bubble relative flex min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3! bg-(--destructive-subtle) text-(--text-destructive) [a]:hover:bg-[var(--destructive-subtle)">
                <p className="text-sm leading-5">{error}</p>
              </BubbleContent>
            </Bubble>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - matching Figma design exactly */}
        <div className="flex gap-2 items-center justify-end px-2.5 py-2">
          <div className="bg-muted rounded-[22px] w-full">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 items-center p-2"
            >
              <div className="flex-1 min-w-0 ">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isNepali ? "प्रश्न गर्नुहोस्..." : "Ask chat..."}
                  className="w-full border-0! bg-transparent! text-sm! leading-5 text-foreground placeholder:text-muted-foreground font-['Noto_Sans_Devanagari']"
                  disabled={loading}
                  aria-label={
                    isNepali
                      ? "प्रश्न प्रविष्ट गर्नुहोस्"
                      : "Enter your question"
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="icon"
                variant="default"
                className="rounded-full shrink-0 transition-opacity disabled:opacity-50"
                aria-label={isNepali ? "पठाउनुहोस्" : "Send message"}
              >
                <ArrowUpIcon
                  size={16}
                  weight="bold"
                  className="text-primary-foreground"
                />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </section>
  );
}
