// components/KundaliChartsView.tsx
"use client";

import React from "react";
import NorthIndianChart from "./NorthIndianKundali";
import { CompleteBirthChartReport } from "@/lib/jyotish-engine";

interface Props {
  report: CompleteBirthChartReport;
}

export default function KundaliChartsView({ report }: Props) {
  const chartLabels = (
    chart: Record<number, { name: string; nameNe: string }[]>,
  ) =>
    Object.fromEntries(
      Object.entries(chart).map(([house, planets]) => [
        house,
        planets.map((planet) => planet.name),
      ]),
    );
  return (
    <div className="overflow-x-auto grid h-auto w-full grid-cols-1 gap-4 bg-background px-4 py-10 sm:grid-cols-2 sm:px-8 sm:py-12">
      {/* D1 Rashi Kundali */}
      <NorthIndianChart
        title="Ascendant Chart (D1)"
        subtitle={`Ascendant sign: ${report.lagna.signName}`}
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d1Chart)}
      />

      {/* D9 Navamsha Kundali */}
      <NorthIndianChart
        title="Navamsha Chart (D9)"
        subtitle={`Navamsha ascendant: ${report.lagna.d9SignName}`}
        lagnaSignIndex={report.lagna.d9SignIndex}
        chartData={chartLabels(report.d9Chart)}
      />
    </div>
  );
}
