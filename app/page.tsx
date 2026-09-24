// app/page.tsx
"use client";

import { useState } from "react";
import { CircleHalfTiltIcon, CakeIcon } from "@phosphor-icons/react";
import { generateKundaliAction } from "@/app/action";
import KundaliForm from "@/components/KundaliForm";
import KundaliChartsView from "@/components/KundaliChartsView";
import FullChartDetails from "@/components/FullChartDetails";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";
import KundaliReportLayout from "@/components/KundaliReportLayout";

type ChartData = Awaited<ReturnType<typeof generateKundaliAction>>;

export default function Home() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const isNepali = language === "np";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await generateKundaliAction(formData);
      setChartData(result);
    } catch (submissionError) {
      setChartData(null);
      setError(
        isNepali
          ? "कुण्डली बनाउन सकिएन।"
          : submissionError instanceof Error
            ? submissionError.message
            : "Could not create the birth chart.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-background font-sans text-foreground"
      lang={language === "np" ? "ne" : "en"}
    >
      <header className="flex h-[85px] items-center justify-between border-b border-b-border px-6 md:px-[84px]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CircleHalfTiltIcon weight="regular" size={24} aria-hidden="true" />
          </div>
          <span className="text-[24px] font-semibold tracking-tight">
            MeroJyotish
          </span>
        </div>
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      <>
        <section>
          <div className="mx-auto flex h-auto pb-8 max-w-318 flex-col items-center border-x border-border border-b px-5 pt-16">
            <div className="flex max-w-2xl flex-col items-center text-center">
              <div className="mb-5 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                <CakeIcon weight="fill" size={12} aria-hidden="true" />
                {isNepali ? "जन्म कुण्डली स्टुडियो" : "Birth chart studio"}
              </div>
              <h1 className="max-w-[619px] text-5xl font-semibold leading-15 tracking-tight text-primary md:text-[3.25rem] md:leading-[1.02]">
                {isNepali ? "आकाशको नक्सा," : "Map of the sky,"}
                <br />
                {isNepali ? "तपाईंको जीवनको कथा!" : "Story of your life!"}
              </h1>
              <p className="mt-6 w-auto px-15 text-lg leading-7 text-muted-foreground">
                {isNepali
                  ? "तपाईंको विक्रम संवत् जन्म विवरणबाट सटीक उत्तर भारतीय लग्न कुण्डली, नक्षत्रीय ग्रह स्थिति र पढ्न सजिलो पञ्चाङ्ग सारांश तयार गर्नुहोस्।"
                  : "Generate a precise North Indian lagna kundali from your Bikram Sambat birth details, with sidereal planetary positions and a readable panchang summary."}
              </p>
              <a
                href="#birth-details"
                className="mt-7 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {isNepali ? "सुरु गर्नुहोस्" : "Get Started"}
              </a>
            </div>
          </div>
        </section>

        <section className="min-h-140.5">
          <div
            id="birth-details"
            className="mx-auto min-h-140.5 w-full max-w-318 border-x border-border"
          >
            {chartData ? (
              <KundaliReportLayout language={language}>
                <div className="report-enter w-auto flex flex-col">
                  <section id="charts" className="scroll-mt-6">
                    <KundaliChartsView report={chartData} language={language} />
                  </section>

                  <FullChartDetails report={chartData} language={language} />
                </div>
              </KundaliReportLayout>
            ) : (
              <KundaliForm
                onSubmit={handleSubmit}
                loading={loading}
                language={language}
              />
            )}
            {error && !chartData && (
              <p className="mx-auto mt-3 max-w-[387px] rounded-lg border border-border bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        </section>
      </>
    </main>
  );
}
