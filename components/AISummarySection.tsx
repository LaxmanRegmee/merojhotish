"use client";

import type { Language } from "@/components/LanguageSwitcher";
import AISummaryGenerator from "@/components/AISummaryGenerator";
import AIChat from "@/components/AIChat";
import { Circle, FlutedGlass, Shader } from "shaders/react";

interface AISummarySectionProps {
  reportData: any;
  language?: Language;
}

export default function AISummarySection({
  reportData,
  language = "en",
}: AISummarySectionProps) {
  const isNepali = language === "np";

  return (
    <section id="ai-summary">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        {/* Left Panel - AI Summary Generator */}
        <div className="relative justify-content justify-center  border-r border-border md:px-8 md:py-8">
          <AISummaryGenerator reportData={reportData} language={language} />
          <Shader className="absolute w-full h-full inset-0 z-0">
            <FlutedGlass
              waveFrequency={10.6}
              waveAmplitude={30}
              highlight={12}
              speed={0.4}
              refraction={6}
            >
              <Circle radius={0.9} softness={0.6} color="orange" />
            </FlutedGlass>
          </Shader>
        </div>

        {/* Right Panel - AI Chat */}
        <div className="h-full min-h-172">
          <AIChat reportData={reportData} language={language} />
        </div>
      </div>
    </section>
  );
}
