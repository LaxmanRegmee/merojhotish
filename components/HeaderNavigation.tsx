"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Tools", hasSubmenu: true },
  { label: "Daily Horoscope" },
  { label: "Marriage Match" },
];

export default function HeaderNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
    >
      {navigationItems.map((item) => (
        <Button
          key={item.label}
          type="button"
          variant="ghost"
          size="lg"
          className="text-sm font-medium"
        >
          {item.label}
          {item.hasSubmenu && <CaretDownIcon aria-hidden="true" />}
        </Button>
      ))}
    </nav>
  );
}
