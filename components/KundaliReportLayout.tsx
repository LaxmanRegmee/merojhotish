"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Language } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

interface KundaliReportLayoutProps {
  children: ReactNode;
  language: Language;
}

const sections = [
  { id: "charts", label: "Charts" },
  { id: "panchang", label: "Panchang" },
  { id: "avakahada", label: "Avakahada chart" },
  { id: "planets", label: "Planetary positions" },
  { id: "dasha", label: "Dosh and Dashas" },
  { id: "ai-summary", label: "AI Summary" },
  { id: "ai-chat", label: "AI Chat" },
];

export default function KundaliReportLayout({
  children,
  language,
}: KundaliReportLayoutProps) {
  const [activeSection, setActiveSection] = useState("charts");
  const pendingSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const sectionElements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const pendingSection = pendingSectionRef.current;
        if (pendingSection) {
          const targetEntry = entries.find(
            (entry) => entry.target.id === pendingSection,
          );

          if (!targetEntry?.isIntersecting) return;

          pendingSectionRef.current = null;
          setActiveSection(pendingSection);
          return;
        }

        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          );

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
    pendingSectionRef.current = id;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  const isNepali = language === "np";
  const activeSectionIndex = Math.max(
    sections.findIndex((section) => section.id === activeSection),
    0,
  );

  return (
    <div role="main" className="mx-auto flex w-full items-start bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-card px-5 py-16 md:block">
        <nav
          className="relative"
          aria-label={isNepali ? "रिपोर्टका भागहरू" : "Report sections"}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-5 top-0 h-8 w-0.5 bg-primary transition-transform duration-200"
            style={{ transform: `translateY(${activeSectionIndex * 2}rem)` }}
          />
          <div className="flex flex-col">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  onClick={() => scrollToSection(section.id)}
                  className={`flex w-full items-start justify-start text-sm hover:bg-transparent! hover:text-foreground! ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span>{section.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
