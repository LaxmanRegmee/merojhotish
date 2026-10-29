"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, HeartIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import DateConverter from "@/components/DateConverter";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";
import HeaderNavigation from "@/components/HeaderNavigation";
import logo from "@/lib/logo.png";

export default function ConverterPage() {
  const [language, setLanguage] = useState<Language>("en");
  const isNepali = language === "np";

  return (
    <main className="min-h-screen bg-background font-sans text-foreground" lang={language === "np" ? "ne" : "en"}>
      <header className="relative flex h-21.25 items-center justify-between border-b border-b-border px-6 md:px-21">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="MeroJyotish" priority className="h-auto w-24 md:w-32" />
        </Link>
        <HeaderNavigation />
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      <section className="py-12 md:py-16 px-6">
        <div className="mx-auto max-w-318">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon size={16} weight="regular" />
            {isNepali ? "मुख्य पृष्ठमा फर्कनुहोस्" : "Back to Home"}
          </Link>

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <CalendarIcon size={12} aria-hidden="true" />
              {isNepali ? "मिति रूपान्तरण" : "Date Conversion"}
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-foreground">
              {isNepali ? "एडी र बीएस मिति कन्वर्टर" : "AD & BS Date Converter"}
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
              {isNepali
                ? "ग्रेगोरियन (एडी) र बिक्रम सम्बत (बीएस) मितिहरू बिच सहज रूपान्तरण गर्नुहोस्। कुण्डली, जन्मपत्री, वा कुनै पनि आयोजनाका लागि सटीक मिति प्राप्त गर्नुहोस्।"
                : "Easily convert between Gregorian (AD) and Bikram Sambat (BS) dates. Get accurate dates for kundali, birth charts, or any planning."}
            </p>
          </div>

          {/* Converter Component */}
          <DateConverter language={language} />

          {/* Info Section */}
          <section className="mt-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border bg-muted/30">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarIcon size={20} weight="regular" />
                  {isNepali ? "बिक्रम सम्बत (बीएस) भनेको के हो?" : "What is Bikram Sambat (BS)?"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isNepali
                    ? "बिक्रम सम्बत नेपालको आधिकारिक पञ्चाङ्ग प्रणाली हो, जुन ग्रेगोरियन क्यान्डरेन्ट भन्दा ५६ वर्ष ८ महिना अगाडि हुन्छ। यो चन्द्र-सौर क्यान्डरेन्ट नेपालमा धार्मिक, सांस्कृतिक र प्रशासनिक प्रयोजनका लागि प्रयोग हुन्छ।"
                    : "Bikram Sambat is Nepal's official calendar system, which is 56 years 8 months ahead of the Gregorian calendar. This lunisolar calendar is used in Nepal for religious, cultural, and administrative purposes."}
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-muted/30">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarIcon size={20} weight="regular" />
                  {isNepali ? "कसरी प्रयोग गर्ने?" : "How to use?"}
                </h3>
                <ul className="space-y-2 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 text-primary">•</span>
                    <span>{isNepali ? "एडी मिति छान्नुहोस् र बीएस मिति स्वतः देखिनेछ" : "Pick an AD date to see the BS equivalent"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 text-primary">•</span>
                    <span>{isNepali ? "वा बीएस वर्ष, महिना, गते प्रविष्ट गरी एडी मिति पाउनुहोस्" : "Or enter BS year, month, day to get the AD date"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 text-primary">•</span>
                    <span>{isNepali ? "परेकी बटनबाट दुवै दिशामा रूपान्तरण गर्नुहोस्" : "Use swap button to convert both ways"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-muted/30">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <CalendarIcon size={20} weight="regular" />
                {isNepali ? "नेपाली महिनाहरू" : "Nepali Months"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                {[
                  { en: "Baishak", ne: "बैशाख" },
                  { en: "Jestha", ne: "जेठ" },
                  { en: "Ashadh", ne: "असार" },
                  { en: "Shrawan", ne: "श्रावण" },
                  { en: "Bhadra", ne: "भाद्र" },
                  { en: "Ashwin", ne: "आश्विन" },
                  { en: "Kartik", ne: "कार्तिक" },
                  { en: "Mangsir", ne: "मंसिर" },
                  { en: "Poush", ne: "पौष" },
                  { en: "Magh", ne: "माघ" },
                  { en: "Falgun", ne: "फाल्गुण" },
                  { en: "Chaitra", ne: "चैत्र" },
                ].map((month, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-6 text-center font-mono text-primary">{i + 1}.</span>
                    <span>{isNepali ? month.ne : month.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                {isNepali ? "जन्म कुण्डली बनाउनुहोस्" : "Create Birth Chart"}
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {isNepali
                ? "आफ्नो बीएस जन्म मिति प्रयोग गरेर सटीक कुण्डली तयार गर्नुहोस्"
                : "Use your BS birth date to generate an accurate birth chart"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}