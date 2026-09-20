// components/PanchangCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Moon, Sparkles, Sun } from "lucide-react";

interface PanchangProps {
  lagna: { rashiName: string; degree: number };
  panchang: { janmaRashi: string; nakshatra: string; tithi: string };
}

export default function PanchangCard({ lagna, panchang }: PanchangProps) {
  return (
    <Card className="border-primary/10 bg-primary text-primary-foreground shadow-xl shadow-primary/10">
      <CardHeader className="gap-2 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
          The snapshot
        </p>
        <CardTitle className="font-serif text-2xl">
          पञ्चाङ्ग र मुख्य विवरण
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Moon aria-hidden="true" />
            जन्म राशि (Janma Rashi)
          </span>
          <span className="mt-3 block font-serif text-xl font-semibold">
            {panchang.janmaRashi}
          </span>
        </div>

        <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Compass aria-hidden="true" /> लग्न (Lagna)
          </span>
          <span className="mt-3 block font-serif text-xl font-semibold">
            {lagna.rashiName} ({lagna.degree}°)
          </span>
        </div>

        <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Sparkles aria-hidden="true" />
            नक्षत्र (Nakshatra)
          </span>
          <span className="mt-3 block font-serif text-lg font-semibold">
            {panchang.nakshatra}
          </span>
        </div>

        <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/10 p-4">
          <span className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Sun aria-hidden="true" /> तिथि (Tithi)
          </span>
          <span className="mt-3 block font-serif text-lg font-semibold">
            {panchang.tithi}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
