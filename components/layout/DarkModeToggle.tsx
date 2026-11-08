"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      const val = saved === "true";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDarkMode(val);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center gap-3">
      <Label>Light</Label>
      <Switch
        checked={darkMode}
        onCheckedChange={setDarkMode}
        aria-label="Toggle dark mode"
      />
      <Label>Dark</Label>
    </div>
  );
}
