"use client";

import { useState } from "react";
import { CaretDownIcon, Hamburger, X } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Tools", hasSubmenu: true, href: "/" },
  { label: "Daily Horoscope", href: "/daily-horoscope" },
  { label: "Marriage Match", href: "/compatibility" },
];

export default function HeaderNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav aria-label="Primary navigation" className="relative z-20">
      {/* Desktop navigation: always visible on md+ */}
      <div className="relative z-20 hidden md:flex flex-1 items-center justify-center gap-1">
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
      </div>

      {/* Mobile hamburger toggle */}
      <Button
        type="button"
        variant="ghost"
        size="lg"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        className="text-sm block md:hidden"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        {mobileMenuOpen ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Hamburger size={20} aria-hidden="true" />
        )}
      </Button>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col md:hidden">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          <div className="relative flex-1 flex flex-col p-6">
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
              <span className="text-sm font-medium text-foreground">Menu</span>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium"
              >
                <X size={20} aria-hidden="true" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="text-sm font-medium w-full text-left"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.hasSubmenu && <CaretDownIcon aria-hidden="true" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
