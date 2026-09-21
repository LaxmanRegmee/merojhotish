// app/kundali/page.tsx
import { generateFullBirthChart } from "@/libs/jyotish-engine";
import KundaliChartsView from "@/components/KundaliChartsView";
import FullChartDetails from "@/components/FullChartDetails";

export default async function KundaliReportPage() {
  const report = await generateFullBirthChart(
    new Date("1998-08-15T08:30:00Z"),
    27.7172,
    85.324,
  );

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <KundaliChartsView report={report} />
      <FullChartDetails report={report} />
    </main>
  );
}
