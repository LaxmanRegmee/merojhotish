"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";

export default function AstrologyChat({ reportData }: { reportData: Record<string, unknown> }) {
  // 1. Manage input state locally using standard React useState
  const [input, setInput] = useState("");

  // 2. Destructure messages, status/isLoading, error, and append from useChat
  const { messages, status, error, append } = useChat({
    body: { reportData },
  });

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 3. Custom submit handler to send the message and clear input
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(""); // Clear input immediately

    await append({
      role: "user",
      content: userMessage,
    });
  };

  return (
    <div className="mt-8 border border-slate-800 rounded-xl p-4 bg-slate-950">
      <h3 className="text-lg font-semibold mb-4 text-white">
        💬 Ask questions about your chart
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm max-w-[85%] whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-slate-800 text-slate-200"
            }`}
          >
            {m.content}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="text-xs text-slate-400 italic animate-pulse">
            Consulting the stars...
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-800">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. When is a good time for my career switch?"
          className="flex-1 bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-opacity"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
