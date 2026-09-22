// components/PanchangCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Moon, Sparkles, Sun } from "lucide-react";
import type { Language } from "@/components/LanguageSwitcher";

interface PanchangProps {
  lagna: { rashiName: string; degree: string };
  panchang: { janmaRashi: string; nakshatra: string; tithi: string };
  language: Language;
}

export default function PanchangCard({
  lagna,
  panchang,
  language,
}: PanchangProps) {
  const isNepali = language === "np";
  return (
    <Card className="border-border bg-primary text-primary-foreground shadow-xl shadow-primary/10">
      <CardHeader className="gap-2 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
          {isNepali ? "एक झलक" : "The snapshot"}
        </p>
        <CardTitle className="text-2xl">
          {isNepali ? "पञ्चाङ्ग र मुख्य विवरण" : "Panchang and key details"}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Moon aria-hidden="true" />
            {isNepali ? "जन्म राशि" : "Birth sign"}
          </span>
          <span className="mt-3 block text-xl font-semibold">
            {panchang.janmaRashi}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Compass aria-hidden="true" /> {isNepali ? "लग्न" : "Ascendant"}
          </span>
          <span className="mt-3 block text-xl font-semibold">
            {lagna.rashiName} ({lagna.degree})
          </span>
        </div>

        <div className="rounded-lg border border-border bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Sparkles aria-hidden="true" />
            {isNepali ? "नक्षत्र" : "Nakshatra"}
          </span>
          <span className="mt-3 block text-lg font-semibold">
            {panchang.nakshatra}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Sun aria-hidden="true" /> {isNepali ? "तिथि" : "Tithi"}
          </span>
          <span className="mt-3 block text-lg font-semibold">
            {panchang.tithi}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
