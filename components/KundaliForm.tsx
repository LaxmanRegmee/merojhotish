// components/KundaliForm.tsx
"use client";

import { useState } from "react";
import { CircleNotch, Clock } from "@phosphor-icons/react";
import { MAJOR_NEPALI_CITIES } from "@/libs/bs-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NepaliDatePicker } from "@/components/ui/date-picker";
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
import type { Language } from "@/components/LanguageSwitcher";

interface FormProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  language: Language;
}

export default function KundaliForm({
  onSubmit,
  loading,
  language,
}: FormProps) {
  const isNepali = language === "np";
  const [birthDate, setBirthDate] = useState({ year: 2059, month: 4, day: 0 });
  const [birthTime, setBirthTime] = useState("21:23");
  const [city, setCity] = useState("");

  return (
    <form action={onSubmit} className="flex flex-col pt-16 gap-6">
      <Card className="mx-auto w-full max-w-96.75 overflow-visible rounded-xl border border-border">
        <CardHeader className=" px-4 pb-0 pt-4 flex h-auto w-full flex-col">
          <CardTitle className="w-full text-sm leading-6 font-semibold">
            {isNepali ? "जन्म विवरण" : "Birth Details"}
          </CardTitle>
          <p className="text-sm leading-5 text-muted-foreground">
            {isNepali
              ? "आफ्नो जन्म कुण्डली थाहा पाउन तल जन्म विवरण भर्नुहोस्।"
              : "Enter your birth details below to find out your birth chart."}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 px-4 py-3">
          <div className="flex h-15 flex-col gap-2">
            <Label htmlFor="bsYear">
              {isNepali ? "जन्म मिति" : "Date of birth"}
            </Label>
            <NepaliDatePicker
              {...birthDate}
              language={language}
              onChange={setBirthDate}
            />
            <input type="hidden" name="bsYear" value={birthDate.year} />
            <input type="hidden" name="bsMonth" value={birthDate.month} />
            <input type="hidden" name="bsDay" value={birthDate.day} />
          </div>

          <div className="flex h-22 flex-col gap-2">
            <Label htmlFor="city">
              {isNepali ? "तपाईं कहाँ जन्मनुभयो?" : "Where were you born?"}
            </Label>
            <Select name="city" value={city} onValueChange={setCity}>
              <SelectTrigger id="city" className="h-8 rounded-lg px-2.5">
                <SelectValue
                  placeholder={
                    isNepali ? "जिल्ला छान्नुहोस्" : "Choose a district"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {MAJOR_NEPALI_CITIES.map((city) => (
                  <SelectItem key={city.name} value={`${city.lat},${city.lon}`}>
                    {isNepali ? city.nameNe : city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs leading-5 text-muted-foreground">
              {isNepali
                ? "तपाईं जन्मनुभएको जिल्ला छान्नुहोस्"
                : "Select a district that you were born in"}
            </p>
          </div>

          <div className="flex h-15 flex-col gap-2">
            <Label htmlFor="birthTime">
              {isNepali ? "जन्म समय सम्झनुहुन्छ?" : "Remember the time?"}
            </Label>
            <TimePicker
              value={birthTime}
              onChange={setBirthTime}
              language={language}
            />
            <input type="hidden" name="birthTime" value={birthTime} />
          </div>
        </CardContent>

        <div className="flex h-16 flex-col justify-center gap-3 rounded-b-xl border-t border-t-border bg-muted/60 px-4 py-4">
          <Button
            type="submit"
            disabled={loading || !birthDate.day || !city}
            className="h-8 w-full rounded-lg bg-primary text-xs font-medium text-primary-foreground"
          >
            {loading ? (
              <>
                <CircleNotch
                  className="animate-spin"
                  size={14}
                  aria-hidden="true"
                />
                {isNepali ? "कुण्डली बन्दैछ..." : "Creating chart..."}
              </>
            ) : isNepali ? (
              "जारी राख्नुहोस्"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}

function TimePicker({
  value,
  onChange,
  language,
}: {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const meridiem = hourValue >= 12 ? "PM" : "AM";
  const meridiemLabel =
    language === "np"
      ? meridiem === "PM"
        ? "अपराह्न"
        : "पूर्वाह्न"
      : meridiem;
  const displayHour = hourValue % 12 || 12;
  const hours = Array.from({ length: 12 }, (_, index) => index + 1);
  const minutes = Array.from({ length: 60 }, (_, index) => index);

  function updateTime(hour: number, minute: number, nextMeridiem = meridiem) {
    const normalizedHour = nextMeridiem === "PM" ? (hour % 12) + 12 : hour % 12;
    onChange(
      `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="birthTime"
          type="button"
          variant="outline"
          className="ui-picker-trigger h-8 w-full justify-between rounded-lg px-2.5 text-left text-sm font-normal"
        >
          {displayHour}:{String(minuteValue).padStart(2, "0")} {meridiemLabel}
          <Clock aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-32.75 p-2">
        <div className="flex h-49 w-28.75">
          <div className="flex max-h-49 flex-col gap-0 overflow-y-auto scrollbar-thin">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => updateTime(hour, minuteValue)}
                className="ui-picker-option flex size-7 items-center justify-center rounded-full text-sm"
                data-selected={hour === displayHour}
              >
                {String(hour).padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className="ml-2 flex max-h-49 flex-col gap-0 overflow-y-auto scrollbar-thin">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => updateTime(displayHour, minute)}
                className="ui-picker-option flex size-7 items-center justify-center rounded-full text-sm"
                data-selected={minute === minuteValue}
              >
                {String(minute).padStart(2, "0")}
              </button>
            ))}
          </div>

          <div className="ml-5.75 flex flex-col justify-center gap-0">
            {(["AM", "PM"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => updateTime(displayHour, minuteValue, period)}
                className="ui-picker-option flex size-7 items-center justify-center rounded-full text-sm"
                data-selected={period === meridiem}
              >
                {language === "np"
                  ? period === "PM"
                    ? "अपराह्न"
                    : "पूर्वाह्न"
                  : period}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
