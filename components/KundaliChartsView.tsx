// components/KundaliChartsView.tsx
"use client";

import React from "react";
import NorthIndianChart from "./NorthIndianKundali";
import { CompleteBirthChartReport } from "@/libs/jyotish-engine";
import type { Language } from "@/components/LanguageSwitcher";

interface Props {
  report: CompleteBirthChartReport;
  language: Language;
}

export default function KundaliChartsView({ report, language }: Props) {
  const isNepali = language === "np";
  const chartLabels = (chart: Record<number, string[]>) =>
    Object.fromEntries(
      Object.entries(chart).map(([house, planets]) => [
        house,
        planets.map((planetName) => {
          if (isNepali) return planetName;
          return (
            report.planets.find((planet) => planet.nameNe === planetName)
              ?.name ?? planetName
          );
        }),
      ]),
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* D1 Rashi Kundali */}
      <NorthIndianChart
        title={isNepali ? "लग्न कुण्डली (D1)" : "Ascendant Chart (D1)"}
        subtitle={`${isNepali ? "लग्न राशि" : "Ascendant sign"}: ${isNepali ? report.lagna.signNameNe : report.lagna.signNameNe}`}
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d1Chart)}
      />

      {/* D9 Navamsha Kundali */}
      <NorthIndianChart
        title={isNepali ? "नवांश कुण्डली (D9)" : "Navamsha Chart (D9)"}
        subtitle={`${isNepali ? "नवांश लग्न" : "Navamsha ascendant"}: ${isNepali ? report.lagna.d9SignNameNe : report.lagna.d9SignNameNe}`}
        lagnaSignIndex={report.lagna.d9SignIndex}
        chartData={chartLabels(report.d9Chart)}
      />
    </div>
  );
}
