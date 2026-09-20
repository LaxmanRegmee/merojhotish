// components/NorthIndianKundali.tsx
"use client";

import React from "react";

interface NorthIndianChartProps {
  title: string;
  subtitle?: string;
  lagnaSignIndex: number;
  chartData: Record<number, string[]>;
}

const HOUSE_POSITIONS = [
  { house: 1, signPos: { x: 200, y: 180 }, planetPos: { x: 200, y: 100 } },
  { house: 2, signPos: { x: 135, y: 25 }, planetPos: { x: 100, y: 60 } },
  { house: 3, signPos: { x: 25, y: 135 }, planetPos: { x: 60, y: 100 } },
  { house: 4, signPos: { x: 180, y: 200 }, planetPos: { x: 100, y: 200 } },
  { house: 5, signPos: { x: 25, y: 265 }, planetPos: { x: 60, y: 300 } },
  { house: 6, signPos: { x: 135, y: 375 }, planetPos: { x: 100, y: 340 } },
  { house: 7, signPos: { x: 200, y: 220 }, planetPos: { x: 200, y: 300 } },
  { house: 8, signPos: { x: 265, y: 375 }, planetPos: { x: 300, y: 340 } },
  { house: 9, signPos: { x: 375, y: 265 }, planetPos: { x: 340, y: 300 } },
  { house: 10, signPos: { x: 220, y: 200 }, planetPos: { x: 300, y: 200 } },
  { house: 11, signPos: { x: 375, y: 135 }, planetPos: { x: 340, y: 100 } },
  { house: 12, signPos: { x: 265, y: 25 }, planetPos: { x: 300, y: 60 } },
];

export default function NorthIndianKundali({
  title,
  subtitle,
  lagnaSignIndex,
  chartData,
}: NorthIndianChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="mx-auto aspect-square w-full max-w-105">
        <svg viewBox="0 0 400 400" className="h-full w-full select-none">
          <rect
            x="2"
            y="2"
            width="396"
            height="396"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            rx="4"
          />
          <line x1="2" y1="2" x2="398" y2="398" stroke="currentColor" strokeWidth="1.5" />
          <line x1="398" y1="2" x2="2" y2="398" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="200,2 398,200 200,398 2,200" fill="none" stroke="currentColor" strokeWidth="1.5" />

          {HOUSE_POSITIONS.map(({ house, signPos, planetPos }) => {
            const signNumber = ((lagnaSignIndex + house - 1) % 12) + 1;
            const planetsInHouse = chartData[house] ?? [];

            return (
              <g key={house}>
                <text x={signPos.x} y={signPos.y} textAnchor="middle" dominantBaseline="central" className="fill-primary font-bold text-[13px]">
                  {signNumber}
                </text>
                <text x={planetPos.x} y={planetPos.y} textAnchor="middle" dominantBaseline="central" className="fill-foreground font-semibold text-[13px]">
                  {planetsInHouse.map((planetName, index) => (
                    <tspan key={`${planetName}-${index}`} x={planetPos.x} dy={index === 0 ? `-${(planetsInHouse.length - 1) * 7}` : "15"}>
                      {planetName}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
