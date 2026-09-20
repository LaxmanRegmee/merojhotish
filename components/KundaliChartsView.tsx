// components/KundaliChartsView.tsx
"use client";

import React from "react";
import NorthIndianChart from "./NorthIndianKundali";
import { CompleteBirthChartReport } from "@/libs/jyotish-engine";

interface Props {
  report: CompleteBirthChartReport;
}

export default function KundaliChartsView({ report }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* D1 Rashi Kundali */}
      <NorthIndianChart
        title="लग्न कुण्डली (D1 Chart)"
        subtitle={`लग्न राशि: ${report.lagna.signNameNe}`}
        lagnaSignIndex={report.lagna.signIndex}
        chartData={report.d1Chart}
      />

      {/* D9 Navamsha Kundali */}
      <NorthIndianChart
        title="नवांश कुण्डली (D9 Chart)"
        subtitle={`नवांश लग्न: ${report.lagna.d9SignNameNe}`}
        lagnaSignIndex={report.lagna.d9SignIndex}
        chartData={report.d9Chart}
      />
    </div>
  );
}
