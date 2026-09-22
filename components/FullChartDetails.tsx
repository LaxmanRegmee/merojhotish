import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompleteBirthChartReport } from "@/libs/jyotish-engine";
import type { Language } from "@/components/LanguageSwitcher";

interface FullChartDetailsProps {
  report: CompleteBirthChartReport;
  language: Language;
}

export default function FullChartDetails({
  report,
  language,
}: FullChartDetailsProps) {
  const isNepali = language === "np";
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isNepali ? "जन्म विवरण र पञ्चाङ्ग" : "Birth details and panchang"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label={isNepali ? "जन्म मिति" : "Birth date"}
            value={report.birthDetails.gregorianDate}
          />
          <Detail
            label={isNepali ? "स्थान" : "Location"}
            value={`${report.birthDetails.latitude}, ${report.birthDetails.longitude}`}
          />
          <Detail
            label={isNepali ? "अयनांश" : "Ayanamsha"}
            value={report.birthDetails.ayanamshaDeg}
          />
          <Detail
            label={isNepali ? "वार" : "Day"}
            value={report.panchang.dayOfWeekNe}
          />
          <Detail
            label={isNepali ? "तिथि" : "Tithi"}
            value={report.panchang.tithiNameNe}
          />
          <Detail
            label={isNepali ? "पक्ष" : "Paksha"}
            value={report.panchang.pakshaNe}
          />
          <Detail
            label={isNepali ? "नक्षत्र" : "Nakshatra"}
            value={report.panchang.nakshatraNe}
          />
          <Detail
            label={isNepali ? "योग" : "Yoga"}
            value={report.panchang.yogaNameNe}
          />
          <Detail
            label={isNepali ? "करण" : "Karana"}
            value={report.panchang.karanaNameNe}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isNepali ? "अवकहडा चक्र" : "Avakahada chart"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label={isNepali ? "जन्म राशि" : "Birth sign"}
            value={`${isNepali ? report.avakahada.rashiNe : report.avakahada.rashi} (${isNepali ? report.avakahada.rashiLordNe : report.avakahada.rashiLord})`}
          />
          <Detail
            label={isNepali ? "नक्षत्र" : "Nakshatra"}
            value={`${isNepali ? report.avakahada.nakshatraNe : report.avakahada.nakshatra}, ${isNepali ? "पद" : "Pada"} ${report.avakahada.pada}`}
          />
          <Detail
            label={isNepali ? "गण" : "Gana"}
            value={isNepali ? report.avakahada.ganaNe : report.avakahada.gana}
          />
          <Detail
            label={isNepali ? "योनि" : "Yoni"}
            value={isNepali ? report.avakahada.yoniNe : report.avakahada.yoni}
          />
          <Detail
            label={isNepali ? "नाडी" : "Nadi"}
            value={isNepali ? report.avakahada.nadiNe : report.avakahada.nadi}
          />
          <Detail
            label={isNepali ? "वर्ण" : "Varna"}
            value={isNepali ? report.avakahada.varnaNe : report.avakahada.varna}
          />
          <Detail
            label={isNepali ? "पाया" : "Paya"}
            value={isNepali ? report.avakahada.payaNe : report.avakahada.paya}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isNepali ? "ग्रह स्थिति" : "Planetary positions"}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-b-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4">{isNepali ? "ग्रह" : "Planet"}</th>
                <th className="p-4">{isNepali ? "राशि" : "Sign"}</th>
                <th className="p-4">{isNepali ? "अंश" : "Degree"}</th>
                <th className="p-4">{isNepali ? "भाव" : "House"}</th>
                <th className="p-4">{isNepali ? "नक्षत्र" : "Nakshatra"}</th>
                <th className="p-4">{isNepali ? "नवांश" : "Navamsha"}</th>
                <th className="p-4">{isNepali ? "अवस्था" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((planet) => (
                <tr
                  key={planet.id}
                  className="border-b border-b-border last:border-0"
                >
                  <td className="p-4 font-semibold">
                    {isNepali ? planet.nameNe : planet.name}
                  </td>
                  <td className="p-4">
                    {isNepali ? planet.signNameNe : planet.signName}
                  </td>
                  <td className="p-4 whitespace-nowrap">{planet.dms}</td>
                  <td className="p-4">{planet.house}</td>
                  <td className="p-4">
                    {isNepali ? planet.nakshatraNameNe : planet.nakshatraName} (
                    {planet.pada})
                  </td>
                  <td className="p-4">{planet.d9SignNameNe}</td>
                  <td className="p-4 whitespace-nowrap">
                    {planet.isRetrograde
                      ? isNepali
                        ? "वक्र "
                        : "Retrograde "
                      : ""}
                    {planet.isCombust ? (isNepali ? "अस्त" : "Combust") : ""}
                    {!planet.isRetrograde && !planet.isCombust
                      ? isNepali
                        ? "सामान्य"
                        : "Normal"
                      : ""}
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
            <CardTitle>
              {isNepali ? "विंशोत्तरी महादशा" : "Vimshottari dasha"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {report.dashaTimeline.map((period) => (
              <div
                key={`${period.planet}-${period.startDate}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <span className="font-semibold">
                  {isNepali
                    ? `${period.planetNe} महादशा`
                    : `${period.planet} dasha`}
                </span>
                <span className="text-muted-foreground">
                  {period.startDate} - {period.endDate}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isNepali ? "दोष एवं योग" : "Doshas and yogas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-6">
            <p>
              <strong>{isNepali ? "मङ्गल दोष:" : "Manglik dosha:"}</strong>{" "}
              {isNepali
                ? report.doshas.manglikDetailsNe
                : report.doshas.isManglik
                  ? "Manglik dosha is present."
                  : "Manglik dosha is not present."}
            </p>
            <p>
              <strong>{isNepali ? "कालसर्प योग:" : "Kalsarpa yoga:"}</strong>{" "}
              {isNepali
                ? report.doshas.kalsarpaDetailsNe
                : report.doshas.hasKalsarpa
                  ? "Kalsarpa yoga is present."
                  : "Kalsarpa yoga is not present."}
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
