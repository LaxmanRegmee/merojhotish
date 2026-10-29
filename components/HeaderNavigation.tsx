"use client";

import { useState } from "react";
import { CaretDownIcon, CalendarIcon, HeartIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Tools", hasSubmenu: true },
  { label: "Daily Horoscope" },
  { label: "Date Converter", href: "/converter" },
  { label: "Marriage Match", href: "/compatibility" },
];

const toolsSubmenu = [
  { label: "Kundali Generator", href: "/", icon: CalendarIcon },
  { label: "Date Converter", href: "/converter", icon: ArrowRightIcon },
  { label: "Marriage Match", href: "/compatibility", icon: HeartIcon },
];

export default function HeaderNavigation() {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  return (
    <nav
      aria-label="Primary navigation"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
    >
      {navigationItems.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href}>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="text-sm font-medium"
            >
              {item.label}
            </Button>
          </Link>
        ) : (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setOpenSubmenu(true)}
            onMouseLeave={() => setOpenSubmenu(false)}
          >
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="text-sm font-medium flex items-center gap-1"
              onClick={() => setOpenSubmenu(!openSubmenu)}
              aria-expanded={openSubmenu}
              aria-haspopup="true"
            >
              {item.label}
              <CaretDownIcon aria-hidden="true" size={14} className={openSubmenu ? "rotate-180" : ""} />
            </Button>
            {openSubmenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onMouseEnter={() => setOpenSubmenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-48 z-20 rounded-md border bg-popover p-1 shadow-lg">
                  {toolsSubmenu.map((tool) => (
                    <Link key={tool.label} href={tool.href} onClick={() => setOpenSubmenu(false)}>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm"
                      >
                        <tool.icon weight="regular" size={16} aria-hidden="true" />
                        {tool.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ),
      )}
    </nav>
  );
}