// components/NorthIndianKundali.tsx
"use client";

import { PlanetaryPosition } from "@/libs/jyotish-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  lagnaRashiIndex: number; // 1-12
  planets: PlanetaryPosition[];
}

// Center coordinates for houses in North Indian Grid (Size: 400x400)
const HOUSE_COORDINATES: Record<
  number,
  { rashi: { x: number; y: number }; planets: { x: number; y: number } }
> = {
  1: { rashi: { x: 200, y: 110 }, planets: { x: 200, y: 140 } }, // Top Diamond (Lagna)
  2: { rashi: { x: 100, y: 50 }, planets: { x: 100, y: 80 } }, // Top Left
  3: { rashi: { x: 50, y: 100 }, planets: { x: 50, y: 130 } }, // Upper Left
  4: { rashi: { x: 110, y: 200 }, planets: { x: 140, y: 200 } }, // Left Diamond
  5: { rashi: { x: 50, y: 300 }, planets: { x: 50, y: 330 } }, // Lower Left
  6: { rashi: { x: 100, y: 350 }, planets: { x: 100, y: 380 } }, // Bottom Left
  7: { rashi: { x: 200, y: 290 }, planets: { x: 200, y: 260 } }, // Bottom Diamond
  8: { rashi: { x: 300, y: 350 }, planets: { x: 300, y: 380 } }, // Bottom Right
  9: { rashi: { x: 350, y: 300 }, planets: { x: 350, y: 330 } }, // Lower Right
  10: { rashi: { x: 290, y: 200 }, planets: { x: 260, y: 200 } }, // Right Diamond
  11: { rashi: { x: 350, y: 100 }, planets: { x: 350, y: 130 } }, // Upper Right
  12: { rashi: { x: 300, y: 50 }, planets: { x: 300, y: 80 } }, // Top Right
};

export default function NorthIndianKundali({
  lagnaRashiIndex,
  planets,
}: Props) {
  const S = 400;

  const getRashiNum = (houseNum: number) => {
    return ((lagnaRashiIndex + houseNum - 2) % 12) + 1;
  };

  const getHousePlanets = (houseNum: number) => {
    return planets
      .filter(
        (planet) =>
          ((planet.signIndex - (lagnaRashiIndex - 1) + 12) % 12) + 1 ===
          houseNum,
      )
      .map(
        (planet) =>
          ({
            Sun: "Su",
            Moon: "Mo",
            Mars: "Ma",
            Mercury: "Me",
            Jupiter: "Ju",
            Venus: "Ve",
            Saturn: "Sa",
            Rahu: "Ra",
            Ketu: "Ke",
          })[planet.name] ?? planet.name,
      )
      .join(" ");
  };

  return (
    <Card className="border-primary/10 bg-card shadow-xl shadow-primary/5">
      <CardHeader className="gap-2 border-b border-border/70 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
          North Indian chart
        </p>
        <CardTitle className="font-serif text-2xl text-primary">
          जन्म कुण्डली <span className="text-muted-foreground">/ लग्न</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rashi numbers by house · planetary abbreviations inside
        </p>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-5 pt-6 md:p-8">
        <svg
          width={S}
          height={S}
          viewBox={`0 0 ${S} ${S}`}
          className="h-auto w-full max-w-[28rem] rounded-2xl border border-primary/20 bg-[#f4ead7] shadow-inner"
        >
          {/* Outer Square */}
          <rect
            x="0"
            y="0"
            width={S}
            height={S}
            fill="none"
            stroke="#78350f"
            strokeWidth="2.5"
          />

          {/* Diagonals */}
          <line
            x1="0"
            y1="0"
            x2={S}
            y2={S}
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <line
            x1={S}
            y1="0"
            x2="0"
            y2={S}
            stroke="#78350f"
            strokeWidth="1.5"
          />

          {/* Inner Diamond */}
          <line
            x1={S / 2}
            y1="0"
            x2="0"
            y2={S / 2}
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1={S / 2}
            x2={S / 2}
            y2={S}
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <line
            x1={S / 2}
            y1={S}
            x2={S}
            y2={S / 2}
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <line
            x1={S}
            y1={S / 2}
            x2={S / 2}
            y2="0"
            stroke="#78350f"
            strokeWidth="1.5"
          />

          {/* Render Rashi Numbers & Planets in 12 Houses */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const coords = HOUSE_COORDINATES[houseNum];
            const planetsStr = getHousePlanets(houseNum);

            return (
              <g key={houseNum}>
                {/* Rashi Number */}
                <text
                  x={coords.rashi.x}
                  y={coords.rashi.y}
                  fill="#9a3412"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {getRashiNum(houseNum)}
                </text>

                {/* Planet Codes */}
                {planetsStr && (
                  <text
                    x={coords.planets.x}
                    y={coords.planets.y}
                    fill="#1e3a8a"
                    fontSize="12"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {planetsStr}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
