"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Language } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, SpinnerIcon } from "@phosphor-icons/react";
import { Bubble, BubbleContent } from "./ui/bubble";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isSuggestion?: boolean;
}

interface AIChatProps {
  reportData: Record<string, unknown>;
  language?: Language;
}

// Spinner component for analyzing state
function Spinner({ className = "" }: { className?: string }) {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotate((prev) => (prev + 10) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <SpinnerIcon
      size={16}
      weight="bold"
      className={`${className} transition-transform duration-50 linear`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
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
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
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
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      const assistantMessageId = generateId();

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

      const assistantContentRef = useRef("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantContentRef.current =
                  assistantContentRef.current + content;
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
            } catch {
              // Ignore parsing errors for partial chunks
            }
          }
        }
      }

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
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <section id="ai-chat" className="w-full md:px-8 md:py-8 ">
      <Card className="h-[calc(100vh-200px)] border-0! shadow-none! flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className=" shrink-0">
          <h2 className="text-2xl font-medium leading-8 text-foreground tracking-normal">
            {isNepali ? "च्याट" : "Chat"}
          </h2>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto gap-6 py-5 px-5 flex flex-col"
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
                {defaultSuggestions.map((suggestion, index) => (
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
              variant={message.role === "user" ? "default" : "secondary"} // also fix: user=default, assistant=secondary
              align={message.role === "user" ? "end" : "start"}
              className="w-fit max-w-[80%]"
            >
              <BubbleContent className="p-3 rounded-3xl">
                <p className="text-sm leading-5 whitespace-pre-wrap">
                  {message.content}
                </p>
              </BubbleContent>
            </Bubble>
          ))}

          {analyzing && (
            // Analyzing state marker (Figma 192-1847)
            <div className="flex justify-start flex-col gap-2 items-start w-full">
              <div className="flex gap-2 items-center">
                <div className="flex h-4 items-center">
                  <Spinner className="text-muted-foreground" />
                </div>
                <div className="flex items-center">
                  <p className="text-sm leading-5 text-muted-foreground whitespace-pre">
                    {isNepali
                      ? "अनुरोध विश्लेषण गर्दै..."
                      : "Analyzing request"}
                  </p>
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
              <BubbleContent className="p-3 rounded-3xl">
                <p className="text-sm">{error}</p>
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
                  className="w-full border-0! bg-transparent! text-sm leading-5 text-foreground placeholder:text-muted-foreground font-['Noto_Sans_Devanagari']"
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
