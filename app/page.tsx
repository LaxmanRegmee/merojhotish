// app/page.tsx
"use client";

import { useState } from "react";
import { CircleHalfTiltIcon, CakeIcon } from "@phosphor-icons/react";
import { generateKundaliAction } from "@/app/action";
import KundaliForm from "@/components/KundaliForm";
import KundaliChartsView from "@/components/KundaliChartsView";
import FullChartDetails from "@/components/FullChartDetails";
import PanchangCard from "@/components/PanchangCard";

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
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex h-[85px] items-center justify-between border-b border-b-border px-6 md:px-[84px]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CircleHalfTiltIcon weight="regular" size={24} aria-hidden="true" />
          </div>
          <span className="text-[24px] font-semibold tracking-tight">
            MeroJyotish
          </span>
        </div>
        <span className="rounded-lg bg-muted px-3 py-2 text-xs font-medium">
          Birth Chart
        </span>
      </header>

      {chartData ? (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:px-10">
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
          <FullChartDetails report={chartData} />
        </div>
      ) : (
        <>
          <section >
            <div className="mx-auto flex h-114 max-w-318 flex-col items-center border-x border-border border-b px-5 pt-25">
              <div className="flex max-w-2xl flex-col items-center text-center">
                <div className="mb-5 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                  <CakeIcon weight="fill" size={12} aria-hidden="true" />
                  Birth chart studio
                </div>
                <h1 className="max-w-[619px] text-5xl font-semibold leading-none tracking-tight text-primary md:text-[3.25rem] md:leading-[1.02]">
                  Map of the sky,
                  <br />
                  Story of your life!
                </h1>
                <p className="mt-6 max-w-[619px] text-sm leading-5 text-foreground">
                  Generate a precise North Indian lagna kundali from your Bikram
                  Sambat birth details, with sidereal planetary positions and a
                  readable panchang summary.
                </p>
                <a
                  href="#birth-details"
                  className="mt-7 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get Started
                </a>
              </div>
            </div>
          </section>

          <section className="min-h-140.5">
            <div
              id="birth-details"
              className="mx-auto min-h-[562px] w-full max-w-[1272px] border-x border-border px-5 pt-[78px]"
            >
              <KundaliForm onSubmit={handleSubmit} loading={loading} />
              {error && (
                <p className="mt-3 rounded-lg border border-border bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
