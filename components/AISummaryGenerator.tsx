"use client";

import { useState } from "react";
import type { Language } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AISummaryGeneratorProps {
  reportData: any;
  language?: Language;
}

export default function AISummaryGenerator({
  reportData,
  language = "en",
}: AISummaryGeneratorProps) {
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
    <div className="h-full z-2 relative flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {isNepali ? "रिपोर्ट सारांश" : "Report Summary"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {isNepali
                  ? "तपाईंको जन्म कुण्डलीको आधारमा AI द्वारा तयार पारिएको विस्तृत सारांश प्राप्त गर्नुहोस्।"
                  : "Generate detailed summary of your birth chart"}
              </p>

              <Button
                onClick={generateSummary}
                disabled={loading}
                className="w-full h-12 text-base"
                variant="default"
                size="lg"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
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
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                {error}
              </div>
            )}

            {summary && (
              <div className="mt-6 p-5 bg-muted/50 rounded-lg text-foreground whitespace-pre-wrap leading-relaxed text-sm border border-border max-h-96 overflow-y-auto">
                {summary}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
