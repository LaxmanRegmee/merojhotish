"use client";

import { useState } from "react";
import Image from "next/image";
import { CakeIcon } from "@phosphor-icons/react";
import { generateKundaliAction } from "@/app/action";
import logo from "@/lib/logo.png";
import { Button } from "@/components/ui/button";
import KundaliForm from "@/components/KundaliForm";
import KundaliChartsView from "@/components/KundaliChartsView";
import FullChartDetails from "@/components/FullChartDetails";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";
import KundaliReportLayout from "@/components/KundaliReportLayout";
import AISummarySection from "@/components/AISummarySection";
import HeaderNavigation from "@/components/HeaderNavigation";

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
      <header className="relative flex h-21.25 items-center justify-between border-b border-b-border px-6 md:px-21">
        <Image src={logo} alt="MeroJyotish" priority className="h-auto w-24 md:w-32" />
        <HeaderNavigation />
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      <section>
        <div className="mx-auto flex h-auto pb-8 max-w-318 flex-col items-center border-x border-border border-b px-5 pt-16">
          <div className="flex max-w-2xl flex-col items-center text-center">
            <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              <CakeIcon weight="regular" size={14} aria-hidden="true" />
              {isNepali ? "जन्म कुण्डली स्टुडियो" : "Birth chart studio"}
            </div>
            <h1 className="max-w-154.75 text-5xl font-semibold leading-13 tracking-tight text-primary md:text-6xl md:leading-[1.02]">
              {isNepali ? "आकाशको नक्सा," : "Map of the sky,"}
              <br />
              {isNepali ? "तपाईंको जीवनको कथा!" : "Story of your life!"}
            </h1>
            <p className="mt-4 max-w-136 w-full text-md leading-5 text-muted-foreground">
              {isNepali
                ? "तपाईंको विक्रम संवत् जन्म विवरणबाट सटीक उत्तर भारतीय लग्न कुण्डली,\nनक्षत्रीय ग्रह स्थिति र पढ्न सजिलो\nपञ्चाङ्ग सारांश तयार गर्नुहोस्।"
                : "Generate a precise North Indian lagna kundali from your Bikram Sambat birth details,\nwith sidereal planetary positions and a readable\npanchang summary."}
            </p>
            <Button
              variant="default"
              size="lg"
              className="mt-12"
              onClick={() =>
                document
                  .getElementById("birth-details")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {isNepali ? "सुरु गर्नुहोस्" : "Get Started"}
            </Button>
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
                  <div className="border-b border-border px-4 md:pl-16 md:pr-32 py-12 ">
                    <p className=" font-medium text-2xl text-foreground">
                      {isNepali
                        ? "यो चार्टले तपाईंको जन्म समयमा आकाशीय अवस्थाको सटीक नक्सा प्रस्तुत गर्दछ।"
                        : "The chart maps the exact geocentric celestial snapshot at birth, establishing the native's physical constitution, core life path and key patterns."}
                    </p>
                  </div>
                  <KundaliChartsView report={chartData} language={language} />
                </section>

                <FullChartDetails report={chartData} language={language} />

                {/* AI Summary Section */}
                <section className=" border-t border-border">
                  <AISummarySection
                    reportData={chartData}
                    language={language}
                  />
                </section>
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
            <p className="mx-auto mt-3 max-w-96.75 rounded-lg border border-border bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
