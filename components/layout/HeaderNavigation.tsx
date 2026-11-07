"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Tools", hasSubmenu: true, href: "/" },
  { label: "Daily Horoscope", href: "/daily-horoscope" },
  { label: "Marriage Match", href: "/compatibility" },
];

export default function HeaderNavigation() {
  return (
    <nav
      aria-label="Primary navigation"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
    >
      {navigationItems.map((item) => {
        // Items with href render as links; Tools stays a button (submenu trigger)
        if (item.href && !item.hasSubmenu) {
          return (
            <Link key={item.label} href={item.href}>
              <Button
                key={item.label}
                type="button"
                variant="ghost"
                size="lg"
                className="text-sm font-medium"
              >
                {item.label}
              </Button>
            </Link>
          );
        }

        return (
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
        );
      })}
    </nav>
  );
}
