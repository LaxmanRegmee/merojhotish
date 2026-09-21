import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompleteBirthChartReport } from "@/libs/jyotish-engine";

interface FullChartDetailsProps {
  report: CompleteBirthChartReport;
}

export default function FullChartDetails({ report }: FullChartDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>जन्म विवरण र पञ्चाङ्ग</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="जन्म मिति" value={report.birthDetails.gregorianDate} />
          <Detail
            label="स्थान"
            value={`${report.birthDetails.latitude}, ${report.birthDetails.longitude}`}
          />
          <Detail label="अयनांश" value={report.birthDetails.ayanamshaDeg} />
          <Detail label="वार" value={report.panchang.dayOfWeekNe} />
          <Detail label="तिथि" value={report.panchang.tithiNameNe} />
          <Detail label="पक्ष" value={report.panchang.pakshaNe} />
          <Detail label="नक्षत्र" value={report.panchang.nakshatraNe} />
          <Detail label="योग" value={report.panchang.yogaNameNe} />
          <Detail label="करण" value={report.panchang.karanaNameNe} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>अवकहडा चक्र</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="जन्म राशि"
            value={`${report.avakahada.rashiNe} (${report.avakahada.rashiLordNe})`}
          />
          <Detail
            label="नक्षत्र"
            value={`${report.avakahada.nakshatraNe}, पद ${report.avakahada.pada}`}
          />
          <Detail label="गण" value={report.avakahada.ganaNe} />
          <Detail label="योनि" value={report.avakahada.yoniNe} />
          <Detail label="नाडी" value={report.avakahada.nadiNe} />
          <Detail label="वर्ण" value={report.avakahada.varnaNe} />
          <Detail label="पाया" value={report.avakahada.payaNe} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ग्रह स्थिति</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-b-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4">ग्रह</th>
                <th className="p-4">राशि</th>
                <th className="p-4">अंश</th>
                <th className="p-4">भाव</th>
                <th className="p-4">नक्षत्र</th>
                <th className="p-4">नवांश</th>
                <th className="p-4">अवस्था</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((planet) => (
                <tr
                  key={planet.id}
                  className="border-b border-b-border last:border-0"
                >
                  <td className="p-4 font-semibold">{planet.nameNe}</td>
                  <td className="p-4">{planet.signNameNe}</td>
                  <td className="p-4 whitespace-nowrap">{planet.dms}</td>
                  <td className="p-4">{planet.house}</td>
                  <td className="p-4">
                    {planet.nakshatraNameNe} ({planet.pada})
                  </td>
                  <td className="p-4">{planet.d9SignNameNe}</td>
                  <td className="p-4 whitespace-nowrap">
                    {planet.isRetrograde ? "वक्र " : ""}
                    {planet.isCombust ? "अस्त" : ""}
                    {!planet.isRetrograde && !planet.isCombust ? "सामान्य" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>विंशोत्तरी महादशा</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {report.dashaTimeline.map((period) => (
              <div
                key={`${period.planet}-${period.startDate}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <span className="font-semibold">{period.planetNe} महादशा</span>
                <span className="text-muted-foreground">
                  {period.startDate} - {period.endDate}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>दोष एवं योग</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-6">
            <p>
              <strong>मङ्गल दोष:</strong> {report.doshas.manglikDetailsNe}
            </p>
            <p>
              <strong>कालसर्प योग:</strong> {report.doshas.kalsarpaDetailsNe}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
