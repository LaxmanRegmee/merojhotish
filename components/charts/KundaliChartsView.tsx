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
        title="D1 - Rashi Chart"
        subtitle={`Ascendant sign: ${report.lagna.signName}`}
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d1Chart)}
      />

      {/* D2 Hora Chart */}
      <NorthIndianChart
        title="D2 - Hora Chart"
        subtitle="Wealth & Prosperity"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d2Chart)}
      />

      {/* D3 Drekkana Chart */}
      <NorthIndianChart
        title="D3 - Drekkana Chart"
        subtitle="Siblings & Co-born"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d3Chart)}
      />

      {/* D7 Saptamsa Chart */}
      <NorthIndianChart
        title="D7 - Saptamsa Chart"
        subtitle="Children & Progeny"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d7Chart)}
      />

      {/* D9 Navamsha Chart */}
      <NorthIndianChart
        title="D9 - Navamsha Chart"
        subtitle={`Navamsha ascendant: ${report.lagna.d9SignName}`}
        lagnaSignIndex={report.lagna.d9SignIndex}
        chartData={chartLabels(report.d9Chart)}
      />

      {/* D10 Dashamsa Chart */}
      <NorthIndianChart
        title="D10 - Dashamsa Chart"
        subtitle="Career & Profession"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d10Chart)}
      />

      {/* D12 Dwadasamsa Chart */}
      <NorthIndianChart
        title="D12 - Dwadasamsa Chart"
        subtitle="Parents & Ancestors"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d12Chart)}
      />

      {/* D30 Trimsamsa Chart */}
      <NorthIndianChart
        title="D30 - Trimsamsa Chart"
        subtitle="Misfortunes & Illnesses"
        lagnaSignIndex={report.lagna.signIndex}
        chartData={chartLabels(report.d30Chart)}
      />
    </div>
  );
}
