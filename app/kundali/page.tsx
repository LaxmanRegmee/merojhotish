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
          <div className="border-b border-border px-6 py-16 md:px-16 md:pr-80">
            <p className="text-2xl font-medium leading-8 text-muted-foreground">
              The chart maps the exact geocentric celestial snapshot at birth,
              establishing the native&apos;s physical constitution, core life
              path and key patterns.
            </p>
          </div>
          <KundaliChartsView report={report} language="en" />
        </section>
        <FullChartDetails report={report} language="en" />
      </div>
    </KundaliReportLayout>
  );
}
