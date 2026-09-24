"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Language } from "@/components/LanguageSwitcher";

interface KundaliReportLayoutProps {
  children: ReactNode;
  language: Language;
}

const sections = [
  { id: "charts", label: "Charts" },
  { id: "panchang", label: "Panchang" },
  { id: "avakahada", label: "Avakahada chart" },
  { id: "planets", label: "Planetary positions" },
  { id: "dasha", label: "Vimshottari dasha" },
  { id: "doshas", label: "Doshas and yogas" },
];

export default function KundaliReportLayout({
  children,
  language,
}: KundaliReportLayoutProps) {
  const [activeSection, setActiveSection] = useState("charts");

  useEffect(() => {
    const sectionElements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -72% 0px",
        threshold: 0,
      },
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
    };
  }, []);

  function scrollToSection(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  const isNepali = language === "np";

  return (
    <div
      role="main"
      className="mx-auto flex w-full items-start bg-background"
    >
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-card px-5 py-16 md:block">
        <nav aria-label={isNepali ? "रिपोर्टका भागहरू" : "Report sections"}>
    
          <div className="flex flex-col gap-1">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`group flex w-full items-start justify-between gap-4 border-l-2 py-1.5 pl-3 text-left text-14px leading-4 transition-colors ${
                    isActive
                      ? "border-primary font-semibold text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span>{section.label}</span>
      
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className=" w-auto pr-80 pl-16 py-16 border-b border-border">
          <p className="text-2xl font-medium leading-8 text-muted-foreground">
            {isNepali
              ? "यो चार्टले तपाईंको जन्म समयमा आकाशीय अवस्थाको सटीक नक्सा प्रस्तुत गर्दछ।"
              : "The chart maps the exact geocentric celestial snapshot at birth, establishing the native's physical constitution, core life path and key patterns."}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
