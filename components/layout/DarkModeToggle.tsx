"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  return (
    <div
      className="flex h-5 items-center gap-2"
      aria-label={darkMode ? "Dark mode" : "Light mode"}
    >
      <span className="text-sm font-medium leading-5 opacity-50">🌙</span>
      <button
        type="button"
        role="switch"
        aria-checked={darkMode}
        aria-label={
          darkMode ? "Switch to light mode" : "Switch to dark mode"
        }
        onClick={toggleDarkMode}
        className={`ui-control relative flex h-4.5 w-8 shrink-0 items-center rounded-full border-0 p-px ${darkMode ? "justify-end bg-primary" : "justify-start bg-input"}`}
      >
        <span
          aria-hidden="true"
          className={`size-4 rounded-full shadow-sm ${darkMode ? "bg-primary-foreground" : "bg-background"}`}
        />
      </button>
      <span className="text-sm font-medium leading-5 opacity-50">☀️</span>
    </div>
  );
}
