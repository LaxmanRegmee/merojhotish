// components/KundaliForm.tsx
"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { MAJOR_NEPALI_CITIES } from "@/libs/bs-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NepaliDatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
}

export default function KundaliForm({ onSubmit, loading }: FormProps) {
  const [birthDate, setBirthDate] = useState({ year: 2055, month: 4, day: 15 });

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      <Card className="border-primary/10 bg-card shadow-xl shadow-primary/5">
        <CardHeader className="gap-2 border-b border-border/70 pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Start here
          </p>
          <CardTitle className="font-serif text-2xl">जन्म विवरण</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter the moment and place you arrived in the world.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 pt-6">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2" htmlFor="bsYear">
              <CalendarDays aria-hidden="true" /> वि.सं. जन्म मिति
            </Label>
            <NepaliDatePicker {...birthDate} onChange={setBirthDate} />
            <input type="hidden" name="bsYear" value={birthDate.year} />
            <input type="hidden" name="bsMonth" value={birthDate.month} />
            <input type="hidden" name="bsDay" value={birthDate.day} />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2" htmlFor="birthTime">
              <Clock3 aria-hidden="true" /> जन्म समय{" "}
              <span className="text-muted-foreground">NPT</span>
            </Label>
            <Input
              id="birthTime"
              type="time"
              name="birthTime"
              defaultValue="08:30"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2" htmlFor="city">
              <MapPin aria-hidden="true" /> जन्म स्थान
            </Label>
            <Select
              name="city"
              defaultValue={`${MAJOR_NEPALI_CITIES[0].lat},${MAJOR_NEPALI_CITIES[0].lon}`}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="स्थान छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {MAJOR_NEPALI_CITIES.map((city) => (
                  <SelectItem key={city.name} value={`${city.lat},${city.lon}`}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
          >
            {loading ? "कुण्डली बनाउँदैछ..." : "कुण्डली तयार पार्नुहोस्"}
            {!loading && <ArrowRight aria-hidden="true" />}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
