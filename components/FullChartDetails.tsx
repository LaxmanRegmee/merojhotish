import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoonIcon,
  GenderMaleIcon,
  SunIcon,
  AsclepiusIcon,
} from "@phosphor-icons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Saturn02Icon,
  JupiterIcon,
  VenusIcon,
  Asteroid02Icon,
  Moon01Icon,
} from "@hugeicons/core-free-icons";

import AvakahadaChakra from "@/components/AvakahadaChakra";
import { MAJOR_NEPALI_CITIES, NEPALI_MONTHS_NE } from "@/lib/bs-converter";
import type {
  CompleteBirthChartReport,
  DashaPeriod,
} from "@/lib/jyotish-engine";
import type { Language } from "@/components/LanguageSwitcher";
import type { ReactNode } from "react";

interface FullChartDetailsProps {
  report: CompleteBirthChartReport;
  language: Language;
}

export default function FullChartDetails({
  report,
  language,
}: FullChartDetailsProps) {
  const isNepali = language === "np";
  const today = new Date();
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
            value={formatBirthDate(
              report.birthDetails.gregorianDate,
              report.birthDetails.nepaliDate,
              isNepali,
            )}
          />
          <Detail
            label={isNepali ? "स्थान" : "Location"}
            value={formatBirthLocation(
              report.birthDetails.latitude,
              report.birthDetails.longitude,
              isNepali,
            )}
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
        className="scroll-mt-6 py-16 px-48 w-auto h-auto rounded-none bg-gray-50"
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

      <div className="grid grid-cols-1 border-t border-border lg:grid-cols-2">
        <section
          id="dasha"
          className="scroll-mt-6 border-b border-border px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-16"
        >
          <h2 className="text-base font-normal leading-6 text-muted-foreground">
            {isNepali ? "विंशोत्तरी महादशा" : "Vimshottari dasha"}
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {report.dashaTimeline.map((period) => (
              <DashaItem
                key={`${period.planet}-${period.startDate}`}
                icon={getDashaIcon(period.planet)}
                title={
                  isNepali
                    ? `${period.planetNe} महादशा`
                    : `${period.planet} dasha`
                }
                description={`${period.startDate} - ${period.endDate}`}
                status={getDashaStatus(period, today)}
                statusLabel={getDashaStatusLabel(
                  getDashaStatus(period, today),
                  isNepali,
                )}
              />
            ))}
          </div>
        </section>

        <section
          id="doshas"
          className="scroll-mt-6 px-6 py-10 sm:px-10 lg:px-16 lg:py-16"
        >
          <h2 className="text-base font-normal leading-6 text-muted-foreground">
            {isNepali ? "दोष एवं योग" : "Doshas and yogas"}
          </h2>
          <div className="mt-3 flex flex-col ">
            <InsightItem
              icon={
                <GenderMaleIcon size={32} color="foreground" weight="regular" />
              }
              title={
                isNepali
                  ? `मङ्गल दोष · ${report.doshas.isManglik ? "छ" : "छैन"}`
                  : `Manglik Dosha · ${report.doshas.isManglik ? "Present" : "Not present"}`
              }
              description={
                isNepali
                  ? report.doshas.manglikDetailsNe
                  : `Mangal Dosh arises when Mars, known as Mangal Graha, is placed in some specific house in the native birth chart. Individuals who have this placement are called Manglik. It is ${report.doshas.isManglik ? "present" : "not present"} in this chart.`
              }
            />
            <InsightItem
              icon={
                <AsclepiusIcon size={32} color="foreground" weight="regular" />
              }
              title={
                isNepali
                  ? `कालसर्प योग · ${report.doshas.hasKalsarpa ? "छ" : "छैन"}`
                  : `Kalsarpa Yoga · ${report.doshas.hasKalsarpa ? "Present" : "Not present"}`
              }
              description={
                isNepali
                  ? report.doshas.kalsarpaDetailsNe
                  : `Rahu and Ketu always sit opposite each other. If all planets fall inside the arc between them, Kalsarpa Yoga is said to be present. It is ${report.doshas.hasKalsarpa ? "present" : "not present"} in this chart.`
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function formatBirthDate(
  gregorianValue: string,
  nepaliDate: { year: number; month: number; day: number },
  isNepali: boolean,
) {
  if (isNepali) {
    return `${nepaliDate.day} ${NEPALI_MONTHS_NE[nepaliDate.month - 1]} ${nepaliDate.year}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(gregorianValue));
}

function formatBirthLocation(
  latitude: number,
  longitude: number,
  isNepali: boolean,
) {
  const city = MAJOR_NEPALI_CITIES.find(
    (candidate) => candidate.lat === latitude && candidate.lon === longitude,
  );
  const cityName = city
    ? isNepali
      ? city.nameNe
      : city.name
    : isNepali
      ? "स्थान"
      : "Location";

  return `${cityName} (${latitude}, ${longitude})`;
}

function getDashaIcon(planet: string) {
  const iconProps = {
    size: 32,
    color: "currentColor",
    weight: "regular" as const,
  };

  switch (planet) {
    case "Sun":
      return <SunIcon {...iconProps} />;
    case "Moon":
      return <MoonIcon {...iconProps} />;
    case "Mars":
      return <GenderMaleIcon {...iconProps} />;
    case "Mercury":
      return <AsclepiusIcon {...iconProps} />;
    case "Jupiter":
      return <HugeiconsIcon icon={JupiterIcon} {...iconProps} />;
    case "Saturn":
      return <HugeiconsIcon icon={Saturn02Icon} {...iconProps} />;
    case "Venus":
      return <HugeiconsIcon icon={VenusIcon} {...iconProps} />;
    case "Rahu":
      return <HugeiconsIcon icon={Moon01Icon} {...iconProps} />;
    case "Ketu":
      return <HugeiconsIcon icon={Asteroid02Icon} {...iconProps} />;
    default:
      return <AsclepiusIcon {...iconProps} />;
  }
}

function DashaItem({
  icon,
  title,
  description,
  status,
  statusLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status: DashaStatus;
  statusLabel: string;
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center text-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-5 text-card-foreground">
          {title}
        </p>
        <p className="truncate text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <Badge variant={getDashaBadgeVariant(status)}>{statusLabel}</Badge>
    </div>
  );
}

type DashaStatus = "passed" | "active" | "upcoming";

function getDashaBadgeVariant(status: DashaStatus) {
  return status === "active"
    ? "destructive"
    : status === "upcoming"
      ? "outline"
      : "secondary";
}

function getDashaStatus(period: DashaPeriod, today: Date): DashaStatus {
  const startDate = new Date(`${period.startDate}T00:00:00`);
  const endDate = new Date(`${period.endDate}T00:00:00`);

  if (today < startDate) return "upcoming";
  if (today >= endDate) return "passed";
  return "active";
}

function getDashaStatusLabel(status: DashaStatus, isNepali: boolean) {
  if (isNepali) {
    return status === "active"
      ? "हाल"
      : status === "upcoming"
        ? "आगामी"
        : "समाप्त";
  }

  return status[0].toUpperCase() + status.slice(1);
}

function InsightItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-26 gap-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-card-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-41 flex-col items-start justify-center gap-3 border-b border-r border-border px-4 py-12 sm:px-8 lg:px-16">
      <span className="text-base leading-6 text-muted-foreground">{label}</span>
      <span className="text-2xl font-medium leading-8 text-accent-foreground">
        {value}
      </span>
    </div>
  );
}
