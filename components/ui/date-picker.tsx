"use client";

import * as React from "react";
import { CalendarDots, CaretLeft, CaretRight } from "@phosphor-icons/react";

import { NEPALI_MONTHS, NEPALI_MONTHS_NE } from "@/libs/bs-converter";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import type { Language } from "@/components/LanguageSwitcher";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NepaliDatePickerProps {
  year: number;
  month: number;
  day: number;
  language: Language;
  onChange: (date: { year: number; month: number; day: number }) => void;
}

export function NepaliDatePicker({
  year,
  month,
  day,
  language,
  onChange,
}: NepaliDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const isNepali = language === "np";
  const monthNames = isNepali ? NEPALI_MONTHS_NE : NEPALI_MONTHS;

  function updateDate(partial: Partial<NepaliDatePickerProps>) {
    onChange({ year, month, day, ...partial });
  }

  function changeMonth(direction: 1 | -1) {
    const nextMonth = month + direction;
    if (nextMonth < 1) {
      updateDate({ year: year - 1, month: 12, day: 1 });
      return;
    }
    if (nextMonth > 12) {
      updateDate({ year: year + 1, month: 1, day: 1 });
      return;
    }
    updateDate({ month: nextMonth, day: 1 });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "ui-picker-trigger h-8 w-full justify-between rounded-lg px-2.5 text-left text-sm font-normal",
            !year && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {year && day
              ? `${year} ${monthNames[month - 1]} ${day}`
              : isNepali
                ? "मिति छान्नुहोस्"
                : "Select a date"}
          </span>
          <CalendarDots className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-53 rounded-lg border border-border bg-white p-2 shadow-[0_4px_10px_rgba(0,0,0,0.14)]"
      >
        <div className="mb-2 flex h-8 items-center justify-between">
          <button
            type="button"
            aria-label={isNepali ? "अघिल्लो महिना" : "Previous month"}
            onClick={() => changeMonth(-1)}
            className="ui-picker-option flex size-7 items-center justify-center rounded-md"
          >
            <CaretLeft aria-hidden="true" className="size-4" />
          </button>

          <div className="flex items-center gap-1 text-sm font-normal">
            <Select
              value={String(month)}
              onValueChange={(value) =>
                updateDate({ month: Number(value), day: 1 })
              }
            >
              <SelectTrigger
                aria-label={isNepali ? "वि.सं. महिना" : "B.S. month"}
                className="h-7 w-auto gap-0 border-0 bg-transparent px-1 text-sm shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((monthName, index) => (
                  <SelectItem key={monthName} value={String(index + 1)}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(year)}
              onValueChange={(value) =>
                updateDate({ year: Number(value), day: 1 })
              }
            >
              <SelectTrigger
                aria-label={isNepali ? "वि.सं. वर्ष" : "B.S. year"}
                className="h-7 w-14.5 border-0 bg-transparent px-1 text-sm shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 101 }, (_, index) => 2000 + index).map(
                  (yearOption) => (
                    <SelectItem key={yearOption} value={String(yearOption)}>
                      {yearOption}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            aria-label={isNepali ? "अर्को महिना" : "Next month"}
            onClick={() => changeMonth(1)}
            className="ui-picker-option flex size-7 items-center justify-center rounded-md"
          >
            <CaretRight aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
          {(isNepali
            ? ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"]
            : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
          ).map((weekday) => (
            <span key={weekday} className="h-7 leading-7">
              {weekday}
            </span>
          ))}
        </div>

        <div
          className="grid grid-cols-7"
          role="grid"
          aria-label={isNepali ? "वि.सं. दिन" : "B.S. day"}
        >
          {Array.from({ length: 32 }, (_, index) => index + 1).map(
            (dayNumber) => (
              <button
                key={dayNumber}
                type="button"
                role="gridcell"
                aria-selected={day === dayNumber}
                onClick={() => {
                  updateDate({ day: dayNumber });
                  setOpen(false);
                }}
                className={cn(
                  "ui-picker-option mx-auto flex size-7 items-center justify-center rounded-full text-sm",
                )}
                data-selected={day === dayNumber}
              >
                {dayNumber}
              </button>
            ),
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
