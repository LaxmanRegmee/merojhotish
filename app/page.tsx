// app/page.tsx
"use client";

import { useState } from "react";
import { ArrowUpRight, Orbit, Sparkles } from "lucide-react";
import { generateKundaliAction } from "@/app/action";
import KundaliForm from "@/components/KundaliForm";
import KundaliChartsView from "@/components/KundaliChartsView";
import PanchangCard from "@/components/PanchangCard";
import { Card, CardContent } from "@/components/ui/card";

type ChartData = Awaited<ReturnType<typeof generateKundaliAction>>;

export default function Home() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await generateKundaliAction(formData);
      setChartData(result);
    } catch (submissionError) {
      setChartData(null);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "कुण्डली बनाउन सकिएन।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-5 md:px-10 md:py-8">
        <header className="flex items-center justify-between border-b border-foreground/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Orbit aria-hidden="true" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Jyotish / 01
              </p>
              <p className="font-serif text-lg font-semibold tracking-tight">
                नेपाली ज्योतिष
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-accent" />
            Sidereal calculations · Lahiri ayanamsha
          </div>
        </header>

        <section className="grid gap-8 pb-10 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-end md:pt-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles aria-hidden="true" />
              Birth chart studio
            </div>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-primary md:text-7xl">
              आकाशको नक्सा,
              <br />
              तपाईंको कथा।
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Generate a precise North Indian lagna kundali from your Bikram
              Sambat birth details, with sidereal planetary positions and a
              readable panchang summary.
            </p>
          </div>
          <div className="hidden justify-self-end text-right md:block">
            <p className="font-serif text-6xl leading-none text-accent/80">
              १२
            </p>
            <p className="mt-2 max-w-32 text-xs leading-5 text-muted-foreground">
              houses · signs · a moment in time
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <KundaliForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <p className="mt-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
            {chartData ? (
              <>
                <KundaliChartsView report={chartData} />
                <PanchangCard
                  lagna={{
                    rashiName: chartData.lagna.signNameNe,
                    degree: chartData.lagna.dms,
                  }}
                  panchang={{
                    janmaRashi: chartData.avakahada.rashiNe,
                    nakshatra: chartData.panchang.nakshatraNe,
                    tithi: chartData.panchang.tithiNameNe,
                  }}
                />
              </>
            ) : (
              <Card className="min-h-96 border-primary/15 bg-primary text-primary-foreground shadow-2xl shadow-primary/10">
                <CardContent className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10">
                    <ArrowUpRight aria-hidden="true" />
                  </div>
                  <p className="font-serif text-2xl">
                    तपाईंको कुण्डली यहाँ देखिनेछ
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/65">
                    विवरण भरेर आफ्नो जन्म क्षणको नक्सा खोल्नुहोस्।
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
