"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CompleteBirthChartReport } from "@/lib/jyotish-engine";

interface AISummaryGeneratorProps {
  reportData: CompleteBirthChartReport;
}

export default function AISummaryGenerator({
  reportData,
}: AISummaryGeneratorProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    if (!reportData) {
      setError("Kundali report data is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartData: reportData }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error (${res.status}). Check server logs.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report summary.");
      }

      setSummary(data.summary);
    } catch (err: unknown) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full z-2 relative flex flex-col items-center justify-center">
      <div className="w-full mx-auto">
        <Card className="mx-auto h-full justify-center  w-fill md:max-w-fill rounded-2xl items-center">
          <CardContent className="p-6 py-6 justify-center items-center w-fill md:w-full">
            <div className="text-center">
              <h3 className="text-2xl font-semibold w-full text-left text-foreground mb-2">
                Report Summary
              </h3>
              <p className="text-muted-foreground text-left  text-base mb-6">
                Generate detailed summary of your birth chart
              </p>

              <Button
                onClick={generateSummary}
                disabled={loading}
                className="w-full rounded-lg px-2.5 h-10 text-base"
                variant="default"
                size="lg"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : summary ? (
                  "Regenerate Summary"
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                {error}
              </div>
            )}

            {summary && (
              <div className="scroll-fade no-scrollbar mt-6 text-foreground leading-relaxed text-sm h-[calc(100vh-100px)]  overflow-y-auto">
                <div className="[&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_h1]:mb-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_hr]:my-4 [&_hr]:border-border">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
