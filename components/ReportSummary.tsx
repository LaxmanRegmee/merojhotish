"use client";

import React, { useState } from "react";
import type { Language } from "@/components/LanguageSwitcher";

interface ReportSummaryProps {
  reportData: any;
  language?: Language;
}

export default function ReportSummary({
  reportData,
  language = "en",
}: ReportSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isNepali = language === "np";

  const generateSummary = async () => {
    if (!reportData) {
      setError(
        isNepali
          ? "कुण्डलीको विवरण भेटिएन।"
          : "Kundali report data is missing.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartData: reportData, language }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          isNepali
            ? "सर्भरमा समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।"
            : `Server error (${res.status}). Check server logs.`,
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report summary.");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isNepali ? "एआई कुण्डली सारांश" : "AI Kundali Summary"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isNepali
              ? "ग्रह र नक्षत्रको आधारमा AI द्वारा तयार पारिएको संक्षिप्त विश्लेषण।"
              : "Instant AI interpretation synthesized from your calculated planetary positions."}
          </p>
        </div>

        <button
          onClick={generateSummary}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2 shrink-0"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></span>
              {isNepali ? "तयार हुँदैछ..." : "Generating..."}
            </>
          ) : summary ? (
            isNepali ? (
              "पुनः तयार गर्नुहोस्"
            ) : (
              "Regenerate Summary"
            )
          ) : isNepali ? (
            "AI सारांश प्राप्त गर्नुहोस्"
          ) : (
            "Generate AI Summary"
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-4 p-5 bg-muted/50 rounded-lg text-foreground whitespace-pre-wrap leading-relaxed text-sm border border-border">
          {summary}
        </div>
      )}
    </div>
  );
}
