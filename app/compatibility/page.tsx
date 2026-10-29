"use client";

import { useState } from "react";
import type { CompleteBirthChartReport, DashakootaResult, DashakootaKoota } from "@/lib/jyotish-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KundaliForm from "@/components/KundaliForm";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";
import HeaderNavigation from "@/components/HeaderNavigation";
import Image from "next/image";
import logo from "@/lib/logo.png";
import { HeartIcon, ArrowRightIcon } from "@phosphor-icons/react";
import ErrorBoundary from "@/components/ErrorBoundary";

type PersonSummary = Pick<CompleteBirthChartReport, "birthDetails" | "lagna" | "avakahada" | "panchang">;

type CompatibilityResult = {
  person1: PersonSummary;
  person2: PersonSummary;
  compatibility: DashakootaResult;
};

function CompatibilityPageContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const isNepali = language === "np";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setShowResults(false);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bsYear1: formData.get("bsYear"),
          bsMonth1: formData.get("bsMonth"),
          bsDay1: formData.get("bsDay"),
          birthTime1: formData.get("birthTime"),
          city1: formData.get("city"),
          bsYear2: formData.get("bsYear2"),
          bsMonth2: formData.get("bsMonth2"),
          bsDay2: formData.get("bsDay2"),
          birthTime2: formData.get("birthTime2"),
          city2: formData.get("city2"),
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate compatibility");
      }

      setResult(data);
      setShowResults(true);
    } catch (submissionError) {
      setError(
        isNepali
          ? "मिलान गर्न सकिएन।"
          : submissionError instanceof Error
            ? submissionError.message
            : "Could not calculate compatibility. Please check both birth details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNewAnalysis() {
    setShowResults(false);
    setResult(null);
    setError(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main
      className="min-h-screen bg-background font-sans text-foreground"
      lang={language === "np" ? "ne" : "en"}
    >
      <header className="relative flex h-21.25 items-center justify-between border-b border-b-border px-6 md:px-21">
        <Image
          src={logo}
          alt="MeroJyotish"
          priority
          className="h-auto w-24 md:w-32"
        />
        <HeaderNavigation />
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      {!showResults ? (
        // Input Form View
        <>
          <section>
            <div className="mx-auto flex h-auto pb-8 max-w-318 flex-col items-center border-x border-border border-b px-5 pt-16">
              <div className="flex max-w-2xl flex-col items-center text-center">
                <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  <HeartIcon weight="regular" size={14} aria-hidden="true" />
                  {isNepali ? "विवाह मिलान" : "Marriage Compatibility"}
                </div>
                <h1 className="max-w-154.75 text-5xl font-semibold leading-13 tracking-tight text-primary md:text-6xl md:leading-[1.02]">
                  {isNepali ? "दुई जना व्यक्तिहरूको" : "Two people's"}
                  <br />
                  {isNepali
                    ? "विवाह अनुकूलता जाँच्नुहोस्"
                    : "Check your marriage compatibility"}
                </h1>
                <p className="mt-4 max-w-136 w-full text-md leading-5 text-muted-foreground">
                  {isNepali
                    ? "दशकूट (१० गुना) पद्धति अनुसार दुई जना व्यक्तिहरूको जन्म विवरणबाट विवाह मिलान गर्नुहोस्।"
                    : "Check marriage compatibility between two people using the Dashakoota (10-fold) method based on their birth details."}
                </p>
              </div>
            </div>
          </section>

          <section className="min-h-140.5">
            <form
              id="compatibility-form"
              onSubmit={handleSubmit}
              className="mx-auto min-h-140.5 w-full max-w-318 border-x border-border"
            >
              <div className="mx-auto grid max-w-318 gap-6 px-5 py-10 md:grid-cols-2 md:gap-8 md:px-8">
                {/* Person 1 Form */}
                <div className="flex flex-col">
                  <Card className="flex-1 overflow-visible rounded-xl border border-border">
                    <CardHeader className="px-4 pb-0 pt-4 flex h-auto w-full flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          1
                        </div>
                        <CardTitle className="text-sm leading-6 font-semibold">
                          {isNepali ? "पहिलो व्यक्ति" : "First Person"}
                        </CardTitle>
                      </div>
                      <p className="text-sm leading-5 text-muted-foreground">
                        {isNepali
                          ? "वर वा कन्याको जन्म विवरण भर्नुहोस्"
                          : "Enter birth details of groom or bride"}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 px-4 py-3">
                      <KundaliForm
                        loading={loading}
                        language={language}
                        personId="1"
                        standalone={false}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Person 2 Form */}
                <div className="flex flex-col">
                  <Card className="flex-1 overflow-visible rounded-xl border border-border">
                    <CardHeader className="px-4 pb-0 pt-4 flex h-auto w-full flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          2
                        </div>
                        <CardTitle className="text-sm leading-6 font-semibold">
                          {isNepali ? "दोस्रो व्यक्ति" : "Second Person"}
                        </CardTitle>
                      </div>
                      <p className="text-sm leading-5 text-muted-foreground">
                        {isNepali
                          ? "कन्या वा वरको जन्म विवरण भर्नुहोस्"
                          : "Enter birth details of bride or groom"}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 px-4 py-3">
                      <KundaliForm
                        loading={loading}
                        language={language}
                        personId="2"
                        standalone={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mx-auto max-w-318 px-5 pb-10">
                <Button
                  type="submit"
                  form="compatibility-form"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? isNepali
                      ? "मिलान गर्दै..."
                      : "Calculating Compatibility..."
                    : isNepali
                      ? "विवाह मिलान गर्नुहोस्"
                      : "Check Marriage Compatibility"}
                  <ArrowRightIcon weight="regular" size={18} className="ml-2" />
                </Button>

                {error && (
                  <p
                    className="mt-4 text-center text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
            </form>
          </section>
        </>
      ) : (
        // Results View
        <CompatibilityResults
          result={result!}
          language={language}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </main>
  );
}

// Compatibility Results Component
function CompatibilityResults({
  result,
  language,
  onNewAnalysis,
}: {
  result: CompatibilityResult;
  language: Language;
  onNewAnalysis: () => void;
}) {
  const isNepali = language === "np";
  const { compatibility, person1, person2 } = result;
  const {
    kootas,
    totalPoints,
    maxTotalPoints,
    percentage,
    verdict,
    verdictNe,
    summary,
    summaryNe,
  } = compatibility;
  const typedKootas: DashakootaKoota[] = kootas;

  // Verdict color mapping
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Average":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Poor":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getKootaColor = (points: number, maxPoints: number) => {
    const ratio = points / maxPoints;
    if (ratio === 1)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300";
    if (ratio >= 0.75)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300";
    if (ratio >= 0.5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300";
  };

  const getNadiCardClass = () => {
    const nadiKoota = typedKootas.find((k) => k.name === "Nadi");
    const hasDosha = nadiKoota?.pointsObtained === 0;
    return hasDosha
      ? "border-red-300 bg-red-50 dark:bg-red-900/20"
      : "border-green-300 bg-green-50 dark:bg-green-900/20";
  };

  const getGanaCardClass = () => {
    const ganaKoota = typedKootas.find((k) => k.name === "Gana");
    const hasDosha = ganaKoota?.pointsObtained === 0;
    return hasDosha
      ? "border-red-300 bg-red-50 dark:bg-red-900/20"
      : "border-green-300 bg-green-50 dark:bg-green-900/20";
  };

  const getNadiIconClass = () => {
    const nadiKoota = typedKootas.find((k) => k.name === "Nadi");
    const hasDosha = nadiKoota?.pointsObtained === 0;
    return hasDosha
      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400";
  };

  const getGanaIconClass = () => {
    const ganaKoota = typedKootas.find((k) => k.name === "Gana");
    const hasDosha = ganaKoota?.pointsObtained === 0;
    return hasDosha
      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400";
  };

  const getNadiText = () => {
    const nadiKoota = typedKootas.find((k) => k.name === "Nadi");
    const hasDosha = nadiKoota?.pointsObtained === 0;
    if (isNepali) {
      return hasDosha
        ? "एकै नाडी भएकोले सन्तान प्राप्तिमा समस्या आउन सक्छ। उपचार आवश्यक छ।"
        : "नाडी दोष छैन। सन्तान प्राप्तिमा समस्या नआउने।";
    }
    return hasDosha
      ? "Same nadi detected - may cause progeny issues. Remedies recommended."
      : "No Nadi Dosha - favorable for progeny.";
  };

  const getGanaText = () => {
    const ganaKoota = typedKootas.find((k) => k.name === "Gana");
    const hasDosha = ganaKoota?.pointsObtained === 0;
    if (isNepali) {
      return hasDosha
        ? "गण मिलान नभएकोले स्वभावमा टकराव हुन सक्छ।"
        : "गण मिलान अनुकूल छ। स्वभावमा सामञ्जस्य रहन्छ।";
    }
    return hasDosha
      ? "Gana mismatch may cause temperament clashes."
      : "Gana compatibility is favorable - harmonious temperaments.";
  };

  const getNadiIcon = () => {
    const nadiKoota = typedKootas.find((k) => k.name === "Nadi");
    return nadiKoota?.pointsObtained === 0 ? "!" : "OK";
  };

  const getGanaIcon = () => {
    const ganaKoota = typedKootas.find((k) => k.name === "Gana");
    return ganaKoota?.pointsObtained === 0 ? "!" : "OK";
  };

  return (
    <div className="min-h-screen">
      {/* Summary Header */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="mx-auto max-w-318 px-5 py-12">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <HeartIcon weight="regular" size={16} />
              <span>
                {isNepali
                  ? "विवाह मिलान परिणाम"
                  : "Marriage Compatibility Result"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {isNepali ? "कुल अनुकूलता स्कोर" : "Overall Compatibility Score"}
            </h2>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="text-6xl md:text-7xl font-bold text-primary">
                {percentage}%
              </div>
              <div className="flex flex-col items-start">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getVerdictColor(verdict)}`}
                >
                  {isNepali ? verdictNe : verdict}
                </span>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  {isNepali ? summaryNe : summary}
                </p>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              {isNepali
                ? `कुल अंक: ${totalPoints} / ${maxTotalPoints}`
                : `Total Points: ${totalPoints} / ${maxTotalPoints}`}
            </div>
          </div>
        </div>
      </section>

      {/* Person Details */}
      <section className="mx-auto max-w-318 px-5 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Person 1 Card */}
          <Card className="border-primary/30">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </div>
                {isNepali ? "पहिलो व्यक्ति" : "First Person"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "जन्म मिति" : "Birth Date"}
                  </span>
                  <p className="font-medium">
                    {person1.birthDetails.nepaliDate.year}-
                    {person1.birthDetails.nepaliDate.month}-
                    {person1.birthDetails.nepaliDate.day} BS
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "लग्न राशि" : "Ascendant"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person1.lagna.signNameNe
                      : person1.lagna.signName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "जन्म नक्षत्र" : "Birth Nakshatra"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person1.avakahada.nakshatraNe
                      : person1.avakahada.nakshatra}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "चन्द्र राशि" : "Moon Sign"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person1.avakahada.rashiNe
                      : person1.avakahada.rashi}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "गण" : "Gana"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person1.avakahada.ganaNe
                      : person1.avakahada.gana}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "नाडी" : "Nadi"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person1.avakahada.nadiNe
                      : person1.avakahada.nadi}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Person 2 Card */}
          <Card className="border-primary/30">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </div>
                {isNepali ? "दोस्रो व्यक्ति" : "Second Person"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "जन्म मिति" : "Birth Date"}
                  </span>
                  <p className="font-medium">
                    {person2.birthDetails.nepaliDate.year}-
                    {person2.birthDetails.nepaliDate.month}-
                    {person2.birthDetails.nepaliDate.day} BS
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "लग्न राशि" : "Ascendant"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person2.lagna.signNameNe
                      : person2.lagna.signName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "जन्म नक्षत्र" : "Birth Nakshatra"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person2.avakahada.nakshatraNe
                      : person2.avakahada.nakshatra}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "चन्द्र राशि" : "Moon Sign"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person2.avakahada.rashiNe
                      : person2.avakahada.rashi}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "गण" : "Gana"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person2.avakahada.ganaNe
                      : person2.avakahada.gana}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    {isNepali ? "नाडी" : "Nadi"}
                  </span>
                  <p className="font-medium">
                    {isNepali
                      ? person2.avakahada.nadiNe
                      : person2.avakahada.nadi}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Koota Breakdown */}
      <section className="mx-auto max-w-318 px-5 pb-12">
        <h3 className="mb-6 text-2xl font-bold text-center">
          {isNepali
            ? "दशकूट विवरण (१० गुना मिलान)"
            : "Dashakoota Breakdown (10-Fold Matching)"}
        </h3>
        <div className="space-y-3">
          {typedKootas.map((koota, index) => (
            <Card
              key={koota.name}
              className={`overflow-hidden border-l-4 ${getKootaColor(koota.pointsObtained, koota.maxPoints)}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {isNepali ? koota.nameNe : koota.name} Koota
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {isNepali ? koota.descriptionNe : koota.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg">
                          {koota.pointsObtained ===
                          Math.floor(koota.pointsObtained)
                            ? koota.pointsObtained
                            : koota.pointsObtained.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          / {koota.maxPoints}
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${(koota.pointsObtained / koota.maxPoints) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        koota.isCompatible
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {koota.isCompatible ? "OK" : "✗"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {isNepali ? koota.detailsNe : koota.details}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Insights */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Nadi Dosha Alert */}
          <Card
            className={getNadiCardClass()}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    typedKootas.find((k) => k.name === "Nadi")
                      ?.pointsObtained === 0
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}
                >
                  {typedKootas.find((k) => k.name === "Nadi")
                    ?.pointsObtained === 0
                    ? "!"
                    : "OK"}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {isNepali ? "नाडी दोष" : "Nadi Dosha"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isNepali
                      ? typedKootas.find((k) => k.name === "Nadi")
                          ?.pointsObtained === 0
                        ? "एकै नाडी भएकोले सन्तान प्राप्तिमा समस्या आउन सक्छ। उपचार आवश्यक छ।"
                        : "नाडी दोष छैन। सन्तान प्राप्तिमा समस्या नआउने।"
                      : typedKootas.find((k) => k.name === "Nadi")
                            ?.pointsObtained === 0
                        ? "Same nadi detected - may cause progeny issues. Remedies recommended."
                        : "No Nadi Dosha - favorable for progeny."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gana Compatibility */}
          <Card
            className={getGanaCardClass()}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getGanaIconClass()}`}
                >
                  {getGanaIcon()}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {isNepali ? "गण मिलान" : "Gana Compatibility"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getGanaText()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onNewAnalysis}
            className="w-full sm:w-auto"
          >
            {isNepali ? "नयाँ मिलान गर्नुहोस्" : "New Compatibility Check"}
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => window.print()}
            className="w-full sm:w-auto"
          >
            {isNepali ? "प्रिन्ट गर्नुहोस्" : "Print Report"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function CompatibilityPage() {
  return (
    <ErrorBoundary>
      <CompatibilityPageContent />
    </ErrorBoundary>
  );
}
