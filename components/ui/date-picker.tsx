"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";

import { NEPALI_MONTHS } from "@/libs/bs-converter";
import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

interface NepaliDatePickerProps {
  year: number;
  month: number;
  day: number;
  onChange: (date: { year: number; month: number; day: number }) => void;
}

export function NepaliDatePicker({
  year,
  month,
  day,
  onChange,
}: NepaliDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  function updateDate(partial: Partial<NepaliDatePickerProps>) {
    onChange({ year, month, day, ...partial });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !year && "text-muted-foreground",
          )}
        >
          <CalendarDays className="h-4 w-4" />
          {year
            ? `${year} ${NEPALI_MONTHS[month - 1]} ${day}`
            : "मिति छान्नुहोस्"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(20rem,calc(100vw-2rem))]">
        <div className="grid grid-cols-[1fr_1.4fr] gap-2">
          <Input
            aria-label="B.S. year"
            type="number"
            min={1}
            value={year}
            onChange={(event) =>
              updateDate({ year: Number(event.target.value) })
            }
          />
          <Select
            value={String(month)}
            onValueChange={(value) => updateDate({ month: Number(value) })}
          >
            <SelectTrigger aria-label="B.S. month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NEPALI_MONTHS.map((monthName, index) => (
                <SelectItem key={monthName} value={String(index + 1)}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="mt-4 grid grid-cols-8 gap-1"
          role="grid"
          aria-label="B.S. day"
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
                  "h-8 rounded-md text-sm hover:bg-accent hover:text-accent-foreground",
                  day === dayNumber &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
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
