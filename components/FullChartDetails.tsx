import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AvakahadaChakra from "@/components/AvakahadaChakra";
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
    <div className="flex flex-col">
      <Card
        id="panchang"
        className="rounded-none border-0 bg-transparent shadow-none hover:border-transparent"
      >
        <CardContent className="grid grid-cols-1 border-y border-border p-0 sm:grid-cols-2 sm:[&>*:nth-child(even)]:border-r-0 lg:grid-cols-3 lg:[&>*:nth-child(even)]:border-r lg:[&>*:nth-child(3n)]:border-r-0">
          <Detail
            label={isNepali ? "जन्म राशि" : "Birth sign"}
            value={isNepali ? report.avakahada.rashiNe : report.avakahada.rashi}
          />
          <Detail
            label={isNepali ? "नक्षत्र" : "Nakshatra"}
            value={
              isNepali ? report.panchang.nakshatraNe : report.panchang.nakshatra
            }
          />
          <Detail
            label={isNepali ? "लग्न" : "Ascendant"}
            value={`${isNepali ? report.lagna.signNameNe : report.lagna.signName} (${report.lagna.dms})`}
          />
          <Detail
            label={isNepali ? "तिथि" : "Tithi"}
            value={
              isNepali ? report.panchang.tithiNameNe : report.panchang.tithiName
            }
          />
          <Detail
            label={isNepali ? "जन्म मिति" : "Birth date"}
            value={report.birthDetails.gregorianDate}
          />
          <Detail
            label={isNepali ? "स्थान" : "Location"}
            value={`${report.birthDetails.latitude}, ${report.birthDetails.longitude}`}
          />
          <Detail
            label={isNepali ? "पक्ष" : "Paksha"}
            value={isNepali ? report.panchang.pakshaNe : report.panchang.paksha}
          />

          <Detail
            label={isNepali ? "योग" : "Yoga"}
            value={
              isNepali ? report.panchang.yogaNameNe : report.panchang.yogaName
            }
          />
          <Detail
            label={isNepali ? "करण" : "Karana"}
            value={
              isNepali
                ? report.panchang.karanaNameNe
                : report.panchang.karanaName
            }
          />
        </CardContent>
      </Card>

      <Card
        id="avakahada"
        className="scroll-mt-6 py-16 px-48 w-auto h-auto rounded-none bg-gray-100"
      >
        <CardContent className="w-auto h-auto p-0">
          <AvakahadaChakra data={report.avakahada} language={language} />
        </CardContent>
      </Card>

      <Card
        id="planets"
        className="scroll-mt-6 rounded-none border-x-0 shadow-none"
      >
        <CardContent className="w-full overflow-x-auto p-0 pb-8">
          <table className="w-full min-w-245 table-fixed text-base leading-6">
            <thead className="border-b  border-border bg-secondary">
              <tr>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "ग्रह" : "Planet"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "राशि" : "Sign"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "अंश" : "Degree"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "भाव" : "House"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "नक्षत्र" : "Nakshatra"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "नवांश" : "Navamsha"}
                </th>
                <th className="px-4 py-4 text-center font-bold text-muted-foreground">
                  {isNepali ? "अवस्था" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              {report.planets.map((planet) => (
                <tr
                  key={planet.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-4 text-center font-bold text-card-foreground">
                    {isNepali ? planet.nameNe : planet.name}
                  </td>
                  <td className="px-4 py-4 text-center text-card-foreground">
                    {isNepali ? planet.signNameNe : planet.signName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-card-foreground">
                    {planet.dms}
                  </td>
                  <td className="px-4 py-4 text-center text-card-foreground">
                    {planet.house}
                  </td>
                  <td className="px-4 py-4 text-center text-card-foreground">
                    {isNepali ? planet.nakshatraNameNe : planet.nakshatraName} (
                    {planet.pada})
                  </td>
                  <td className="px-4 py-4 text-center text-card-foreground">
                    {isNepali ? planet.d9SignNameNe : planet.d9SignName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center text-card-foreground">
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

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Card
          id="dasha"
          className="scroll-mt-6 rounded-none border-r border-t border-border shadow-none"
        >
          <CardHeader className="px-16 pb-0 pt-16">
            <CardTitle className="text-base font-normal leading-6 text-muted-foreground">
              {isNepali ? "विंशोत्तरी महादशा" : "Vimshottari dasha"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 px-16 pb-16 pt-3">
            {report.dashaTimeline.map((period) => (
              <div
                key={`${period.planet}-${period.startDate}`}
                className="flex flex-wrap items-center justify-between gap-3 py-1.5"
              >
                <span className="text-2xl font-medium leading-8 text-card-foreground">
                  {isNepali
                    ? `${period.planetNe} महादशा`
                    : `${period.planet} dasha`}
                </span>
                <span className="text-sm leading-5 text-muted-foreground">
                  {period.startDate} - {period.endDate}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          id="doshas"
          className="scroll-mt-6 rounded-none border-r border-t border-border shadow-none"
        >
          <CardHeader className="px-16 pb-0 pt-16">
            <CardTitle className="text-base font-normal leading-6 text-muted-foreground">
              {isNepali ? "दोष एवं योग" : "Doshas and yogas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-16 pb-16 pt-3">
            <p className="text-2xl font-medium leading-8 text-accent-foreground">
              {isNepali
                ? report.doshas.manglikDetailsNe
                : report.doshas.isManglik
                  ? "Manglik dosha is present."
                  : "Manglik dosha is not present."}
            </p>
            <p className="text-2xl font-medium leading-8 text-accent-foreground">
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
    <div className="flex min-h-[164px] flex-col items-start justify-center gap-3 border-b border-r border-border px-4 py-12 sm:px-8 lg:px-16">
      <span className="text-base leading-6 text-muted-foreground">{label}</span>
      <span className="text-2xl font-medium leading-8 text-accent-foreground">
        {value}
      </span>
    </div>
  );
}
