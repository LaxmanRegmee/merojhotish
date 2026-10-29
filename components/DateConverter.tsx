"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Swap } from "@phosphor-icons/react";
import { adToBs, bsToAd, NEPALI_MONTHS, NEPALI_MONTHS_NE } from "@/lib/bs-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Language = "en" | "np";

interface DateConverterProps {
  language?: Language;
  className?: string;
}

export default function DateConverter({ language = "en", className = "" }: DateConverterProps) {
  const isNepali = language === "np";
  const [adDate, setAdDate] = useState<Date | null>(new Date());
  const [bsDate, setBsDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [activeInput, setActiveInput] = useState<"ad" | "bs">("ad");
  const [error, setError] = useState<string | null>(null);

  // Convert AD to BS when AD date changes
  useEffect(() => {
    if (activeInput === "ad" && adDate) {
      try {
        const converted = adToBs(adDate);
        setBsDate(converted);
        setError(null);
      } catch {
        setError(isNepali ? "अमान्य मिति" : "Invalid date");
      }
    }
  }, [adDate, activeInput, isNepali]);

  // Convert BS to AD when BS date changes
  useEffect(() => {
    if (activeInput === "bs" && bsDate) {
      try {
        const converted = bsToAd(bsDate.year, bsDate.month, bsDate.day);
        setAdDate(converted);
        setError(null);
      } catch {
        setError(isNepali ? "अमान्य मिति" : "Invalid date");
      }
    }
  }, [bsDate, activeInput, isNepali]);

  // Format AD date for display
  const formatAdDate = (date: Date): string => {
    return date.toLocaleDateString(isNepali ? "ne-NP" : "en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format BS date for display
  const formatBsDate = (bs: { year: number; month: number; day: number }): string => {
    const months = isNepali ? NEPALI_MONTHS_NE : NEPALI_MONTHS;
    return `${bs.day} ${months[bs.month - 1]} ${isNepali ? toDevanagari(bs.year) : bs.year}`;
  };

  // Convert number to Devanagari
  const toDevanagari = (num: number): string => {
    const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return num.toString().replace(/\d/g, (d) => devanagariDigits[parseInt(d)]);
  };

  // Handle AD date input change
  const handleAdChange = (value: string) => {
    setActiveInput("ad");
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      setAdDate(parsed);
    }
  };

  // Handle BS date inputs
  const handleBsYearChange = (value: string) => {
    setActiveInput("bs");
    const year = parseInt(value);
    if (!isNaN(year) && year >= 1970 && year <= 2100) {
      setBsDate((prev) => (prev ? { ...prev, year } : null));
    }
  };

  const handleBsMonthChange = (value: string) => {
    setActiveInput("bs");
    const month = parseInt(value);
    if (!isNaN(month) && month >= 1 && month <= 12) {
      setBsDate((prev) => (prev ? { ...prev, month } : null));
    }
  };

  const handleBsDayChange = (value: string) => {
    setActiveInput("bs");
    const day = parseInt(value);
    if (!isNaN(day) && day >= 1 && day <= 32) {
      setBsDate((prev) => (prev ? { ...prev, day } : null));
    }
  };

  // Initialize BS date from AD on mount
  useEffect(() => {
    if (adDate && !bsDate) {
      setBsDate(adToBs(adDate));
    }
  }, []);

  const swapDates = () => {
    if (activeInput === "ad" && adDate) {
      setActiveInput("bs");
      setBsDate(adToBs(adDate));
    } else if (activeInput === "bs" && bsDate) {
      setActiveInput("ad");
      setAdDate(bsToAd(bsDate.year, bsDate.month, bsDate.day));
    }
  };

  const today = new Date();
  const todayBs = adToBs(today);

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarIcon size={20} weight="regular" />
            {isNepali ? "एडी / बीएस कन्वर्टर" : "AD / BS Date Converter"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* AD Date Section */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <CalendarIcon size={16} weight="regular" />
              {isNepali ? "एडी (ग्रेगोरियन)" : "AD (Gregorian)"}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={swapDates}
              className="h-8 w-8"
              aria-label={isNepali ? "परेकी गर्नुहोस्" : "Swap dates"}
            >
              <Swap size={16} weight="regular" />
            </Button>
          </div>
          <Input
            type="date"
            value={adDate ? adDate.toISOString().split("T")[0] : ""}
            onChange={(e) => handleAdChange(e.target.value)}
            max={today.toISOString().split("T")[0]}
            className="text-lg"
            onFocus={() => setActiveInput("ad")}
          />
          <p className="text-sm text-muted-foreground">
            {isNepali ? "आज" : "Today"}: {formatAdDate(today)}
          </p>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
            <span className="bg-card px-2">{isNepali ? "तसल" : "Equals"}</span>
          </div>
        </div>

        {/* BS Date Section */}
        <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-base font-medium">
              <CalendarIcon size={16} weight="regular" />
              {isNepali ? "बिक्रम सम्बत" : "BS (Bikram Sambat)"}
            </Label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {isNepali ? "वर्ष" : "Year"}
              </Label>
              <Input
                type="number"
                value={bsDate?.year?.toString() || ""}
                onChange={(e) => handleBsYearChange(e.target.value)}
                min={1970}
                max={2100}
                className="text-center text-lg"
                onFocus={() => setActiveInput("bs")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {isNepali ? "महिना" : "Month"}
              </Label>
              <Select
                value={bsDate?.month?.toString() || ""}
                onValueChange={handleBsMonthChange}
              >
                <SelectTrigger className="text-center text-lg h-12" onFocus={() => setActiveInput("bs")}>
                  <SelectValue placeholder={isNepali ? "छान्नुहोस्" : "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {NEPALI_MONTHS.map((month, index) => (
                    <SelectItem key={index + 1} value={String(index + 1)}>
                      {isNepali ? NEPALI_MONTHS_NE[index] : month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {isNepali ? "गते" : "Day"}
              </Label>
              <Input
                type="number"
                value={bsDate?.day?.toString() || ""}
                onChange={(e) => handleBsDayChange(e.target.value)}
                min={1}
                max={32}
                className="text-center text-lg"
                onFocus={() => setActiveInput("bs")}
              />
            </div>
          </div>

          {bsDate && (
            <p className="text-sm text-muted-foreground text-center">
              {isNepali ? "एडी मा" : "In AD"}: {formatAdDate(bsToAd(bsDate.year, bsDate.month, bsDate.day))}
            </p>
          )}
          <p className="text-sm text-muted-foreground text-center">
            {isNepali ? "आज" : "Today"}: {formatBsDate(todayBs)}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" onClick={() => { setAdDate(today); setActiveInput("ad"); }}>
            {isNepali ? "आज" : "Today"}
          </Button>
          <Button variant="outline" onClick={() => { setAdDate(new Date(today.getFullYear(), 0, 1)); setActiveInput("ad"); }}>
            {isNepali ? "वर्ष सुरु" : "Year Start"}
          </Button>
          <Button variant="outline" onClick={() => { setAdDate(new Date(today.getFullYear(), 3, 13)); setActiveInput("ad"); }}>
            {isNepali ? "नयाँ वर्ष (बैशाख १)" : "New Year (Baishakh 1)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}