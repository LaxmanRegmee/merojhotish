"use client";

import type { AvakahadaChakra as AvakahadaChakraData } from "@/libs/jyotish-engine";
import type { Language } from "@/components/LanguageSwitcher";

interface AvakahadaChakraProps {
  data: AvakahadaChakraData;
  language: Language;
}

const NODE_POSITIONS = [
  { x: 200, y: 48 },
  { x: 328, y: 110 },
  { x: 390, y: 238 },
  { x: 328, y: 366 },
  { x: 200, y: 428 },
  { x: 72, y: 366 },
  { x: 10, y: 238 },
  { x: 72, y: 110 },
];

const RASHI_SYMBOLS: Record<string, string> = {
  Aries: "♈︎",
  Taurus: "♉︎",
  Gemini: "♊︎",
  Cancer: "♋︎",
  Leo: "♌︎",
  Virgo: "♍︎",
  Libra: "♎︎",
  Scorpio: "♏︎",
  Sagittarius: "♐︎",
  Capricorn: "♑︎",
  Aquarius: "♒︎",
  Pisces: "♓︎",
};

export default function AvakahadaChakra({
  data,
  language,
}: AvakahadaChakraProps) {
  const isNepali = language === "np";
  const rashiSymbol = RASHI_SYMBOLS[data.rashi] ?? data.rashi.slice(0, 1);
  const nodes = [
    [isNepali ? "वर्ण" : "Varna", isNepali ? data.varnaNe : data.varna],
    [isNepali ? "राशि" : "Rashi", isNepali ? data.rashiNe : data.rashi],
    [
      isNepali ? "नक्षत्र" : "Nakshatra",
      isNepali ? data.nakshatraNe : data.nakshatra,
    ],
    [isNepali ? "गण" : "Gana", isNepali ? data.ganaNe : data.gana],
    [isNepali ? "योनि" : "Yoni", isNepali ? data.yoniNe : data.yoni],
    [isNepali ? "नाडी" : "Nadi", isNepali ? data.nadiNe : data.nadi],
    [isNepali ? "पाया" : "Paya", isNepali ? data.payaNe : data.paya],
    [isNepali ? "पद" : "Pada", String(data.pada)],
  ];

  return (
    <div className="mx-auto aspect-square w-full">
      <svg
        viewBox="-45 0 490 476"
        className="h-full w-full overflow-visible select-none"
        role="img"
      >
        <circle
          cx="200"
          cy="238"
          r="195"
          fill="none"
          stroke="var(--chart-3)"
          strokeWidth="3"
        />
        <polygon
          points="200,52 245,154 350,108 304,213 406,238 304,263 350,368 245,322 200,424 155,322 50,368 96,263 -6,238 96,213 50,108 155,154"
          fill="var(--chart-1)"
          opacity="0.55"
        />
        <circle
          cx="200"
          cy="238"
          r="118"
          fill="var(--chart-2)"
          opacity="0.28"
        />
        <circle cx="200" cy="238" r="76" fill="var(--chart-3)" opacity="0.95" />
        <circle
          cx="200"
          cy="238"
          r="61"
          fill="var(--card)"
          stroke="var(--primary-foreground)"
          strokeWidth="5"
        />
        <text
          x="200"
          y="238"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-primary text-[42px] font-semibold"
        >
          {rashiSymbol}
        </text>

        {nodes.map(([label, value], index) => {
          const position = NODE_POSITIONS[index];
          return (
            <g key={label} transform={`translate(${position.x} ${position.y})`}>
              <circle
                r="39"
                fill="var(--card)"
                stroke="var(--chart-3)"
                strokeWidth="3"
              />
              <text
                y="-5"
                textAnchor="middle"
                className="fill-primary text-[11px] font-semibold"
              >
                {label}
              </text>
              <text
                y="10"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
