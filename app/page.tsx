"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CakeIcon, Download } from "@phosphor-icons/react";
import { generateKundaliAction } from "@/app/action";
import logo from "@/lib/logo.png";
import { saveChart } from "@/lib/chart-storage";
import { Button } from "@/components/ui/button";
import KundaliForm from "@/components/forms/KundaliForm";
import KundaliChartsView from "@/components/charts/KundaliChartsView";
import FullChartDetails from "@/components/charts/FullChartDetails";
import SavedChartsList from "@/components/charts/SavedChartsList";
import KundaliReportLayout from "@/components/layout/KundaliReportLayout";
import AISummarySection from "@/components/ai/AISummarySection";
import HeaderNavigation from "@/components/layout/HeaderNavigation";
import DarkModeToggle from "@/components/layout/DarkModeToggle";

type ChartData = Awaited<ReturnType<typeof generateKundaliAction>>;

function Home() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedChartsOpen, setSavedChartsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  type InitialForm = {
    bsYear: number;
    bsMonth: number;
    bsDay: number;
    birthTime: string;
    city: string;
  };

  function parseInitialForm(): InitialForm | null {
    const bsYear = Number(searchParams.get("bsYear"));
    const bsMonth = Number(searchParams.get("bsMonth"));
    const bsDay = Number(searchParams.get("bsDay"));
    const birthTime = searchParams.get("birthTime") ?? "";
    const city = searchParams.get("city") ?? "";

    if (
      !Number.isInteger(bsYear) ||
      !Number.isInteger(bsMonth) ||
      !Number.isInteger(bsDay) ||
      !/^\d{2}:\d{2}$/.test(birthTime) ||
      !city
    ) {
      return null;
    }

    return { bsYear, bsMonth, bsDay, birthTime, city };
  }

  const initialForm = parseInitialForm();

  useEffect(() => {
    if (!initialForm || chartData || loading || savedChartsOpen) return;
    const form = initialForm;
    async function autoGenerate() {
      const formData = new FormData();
      formData.set("bsYear", String(form.bsYear));
      formData.set("bsMonth", String(form.bsMonth));
      formData.set("bsDay", String(form.bsDay));
      formData.set("birthTime", form.birthTime);
      formData.set("city", form.city);
      try {
        const result = await generateKundaliAction(formData);
        setChartData(result);
      } catch {
        setError("Could not create the birth chart from the shared link.");
      }
    }
    autoGenerate();
  }, [initialForm, chartData, loading, savedChartsOpen]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await generateKundaliAction(formData);
      setChartData(result);

      const bsYear = formData.get("bsYear");
      const bsMonth = formData.get("bsMonth");
      const bsDay = formData.get("bsDay");
      const birthTime = formData.get("birthTime");
      const city = formData.get("city");
      const params = new URLSearchParams();
      if (bsYear) params.set("bsYear", String(bsYear));
      if (bsMonth) params.set("bsMonth", String(bsMonth));
      if (bsDay) params.set("bsDay", String(bsDay));
      if (birthTime) params.set("birthTime", String(birthTime));
      if (city) params.set("city", String(city));
      router.replace(`?${params.toString()}`);
    } catch (submissionError) {
      setChartData(null);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not create the birth chart.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadSavedChart(birthDetails: {
    bsYear: number;
    bsMonth: number;
    bsDay: number;
    birthTime: string;
    city: string;
  }) {
    setLoading(true);
    setError(null);
    setSavedChartsOpen(false);

    const formData = new FormData();
    formData.set("bsYear", String(birthDetails.bsYear));
    formData.set("bsMonth", String(birthDetails.bsMonth));
    formData.set("bsDay", String(birthDetails.bsDay));
    formData.set("birthTime", birthDetails.birthTime);
    formData.set("city", birthDetails.city);

    try {
      const result = await generateKundaliAction(formData);
      setChartData(result);

      const params = new URLSearchParams();
      params.set("bsYear", String(birthDetails.bsYear));
      params.set("bsMonth", String(birthDetails.bsMonth));
      params.set("bsDay", String(birthDetails.bsDay));
      params.set("birthTime", birthDetails.birthTime);
      params.set("city", birthDetails.city);
      router.replace(`?${params.toString()}`);
    } catch (submissionError) {
      setChartData(null);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Could not load the saved birth chart.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSaveChart() {
    if (!chartData) return;

    const bsYear = searchParams.get("bsYear");
    const bsMonth = searchParams.get("bsMonth");
    const bsDay = searchParams.get("bsDay");
    const birthTime = searchParams.get("birthTime") ?? "";
    const city = searchParams.get("city") ?? "";

    if (!bsYear || !bsMonth || !bsDay || !birthTime || !city) return;

    const birthDetails = {
      bsYear: Number(bsYear),
      bsMonth: Number(bsMonth),
      bsDay: Number(bsDay),
      birthTime,
      city,
      lat: 0, // placeholder; not needed for save, chart data already computed
      lon: 0,
    };

    saveChart(chartData, birthDetails);
  }

  return (
    <main
      className="min-h-screen bg-background font-sans text-foreground"
      lang="en"
    >
      <header className="relative flex h-21.25 items-center justify-between border-b border-b-border px-6 md:px-21">
        <Image
          src={logo}
          alt="MeroJyotish"
          priority
          className="h-auto w-24 md:w-32"
        />
        <HeaderNavigation />
        <DarkModeToggle />
      </header>

      {savedChartsOpen ? (
        <section className="min-h-140.5">
          <div
            id="birth-details"
            className="mx-auto min-h-140.5 w-full max-w-318 border-x border-border"
          >
            <SavedChartsList
              onLoadChart={handleLoadSavedChart}
              onClose={() => setSavedChartsOpen(false)}
            />
          </div>
        </section>
      ) : (
        <section>
          <div className="mx-auto flex h-auto pb-8 max-w-318 flex-col items-center border-x border-border border-b px-5 pt-16">
            <div className="flex max-w-2xl flex-col items-center text-center">
              <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <CakeIcon weight="regular" size={14} aria-hidden="true" />
                Birth chart studio
              </div>
              <h1 className="max-w-154.75 text-5xl font-semibold leading-13 tracking-tight text-primary md:text-6xl md:leading-[1.02]">
                The sky&apos;s map,
                <br />
                Story of your life!
              </h1>
              <p className="mt-4 max-w-136 w-full text-md leading-5 text-muted-foreground">
                Generate a precise North Indian lagna kundali from your Bikram Sambat birth details,
                with sidereal planetary positions and a readable
                panchang summary.
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
                Get Started
              </Button>
            </div>
          </div>

          <section className="min-h-140.5">
            <div
              id="birth-details"
              className="mx-auto min-h-140.5 w-full max-w-318 border-x border-border"
            >
              {chartData ? (
                <>
                  <div className="border-b border-border px-4 md:pl-16 md:pr-16 md:w-full py-12 flex items-center justify-between">
                    <p className=" font-medium text-2xl md:max-w-150 md:w-full text-foreground">
                      The chart maps the exact geocentric celestial snapshot at birth, establishing the native&apos;s physical constitution, core life path and key patterns.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSaveChart}
                      className="text-xs"
                      disabled={loading}
                    >
                      <Download size={14} aria-hidden="true" />
                      {loading ? "Saving..." : "Save chart"}
                    </Button>
                  </div>
                  <KundaliReportLayout>
                    <div className="report-enter w-auto flex flex-col">
                      <section id="charts" className="scroll-mt-6">
                        <KundaliChartsView report={chartData} />
                      </section>

                      <FullChartDetails report={chartData} />

                      {/* AI Summary Section */}
                      <section className=" border-t border-border">
                        <AISummarySection reportData={chartData} />
                      </section>
                    </div>
                  </KundaliReportLayout>
                </>
              ) : (
                <>
                  <KundaliForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    initialForm={initialForm ?? undefined}
                  />
                  <p
                    className="mx-auto mt-4 text-center text-xs text-muted-foreground"
                  >
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => setSavedChartsOpen(true)}
                      className="text-xs underline underline-offset-4 hover:text-foreground"
                    >
                      View saved charts
                    </Button>
                  </p>
                  {error && !chartData && (
                    <p className="mx-auto mt-3 max-w-96.75 rounded-lg border border-border bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
