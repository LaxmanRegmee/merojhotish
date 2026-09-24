// app/kundali/page.tsx
import { generateFullBirthChart } from "@/libs/jyotish-engine";
import KundaliChartsView from "@/components/KundaliChartsView";
import FullChartDetails from "@/components/FullChartDetails";
import KundaliReportLayout from "@/components/KundaliReportLayout";

export default async function KundaliReportPage() {
  const report = await generateFullBirthChart(
    new Date("1998-08-15T08:30:00Z"),
    27.7172,
    85.324,
  );

  return (
    <KundaliReportLayout language="en">
      <div className="space-y-8">
        <section id="charts" className="scroll-mt-6">
          <KundaliChartsView report={report} language="en" />
        </section>
        <FullChartDetails report={report} language="en" />
      </div>
    </KundaliReportLayout>
  );
}
