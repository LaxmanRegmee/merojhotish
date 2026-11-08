// lib/chart-storage.ts
// Client-side persistence of saved birth charts using localStorage.

import type { CompleteBirthChartReport } from "@/lib/jyotish-engine";

export interface SavedChart {
  id: string;
  createdAt: string; // ISO 8601 string
  name: string;
  birthDetails: {
    bsYear: number;
    bsMonth: number;
    bsDay: number;
    birthTime: string;
    city: string;
    lat: number;
    lon: number;
  };
  chartData: CompleteBirthChartReport;
}

const STORAGE_KEY = "merojyotish_saved_charts";
const MAX_SAVED_CHARTS = 50;

function getStoredCharts(): SavedChart[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredCharts(charts: SavedChart[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
  } catch {
    // Storage quota exceeded or private browsing — silently fail.
  }
}

export function saveChart(
  chartData: CompleteBirthChartReport,
  birthDetails: SavedChart["birthDetails"],
  name?: string,
): SavedChart {
  const charts = getStoredCharts();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const { bsYear, bsMonth, bsDay, city } = birthDetails;
  const chartName =
    name ||
    `Birth Chart · ${city} · ${bsYear}/${String(bsMonth).padStart(2, "0")}/${String(bsDay).padStart(2, "0")}`;

  const savedChart: SavedChart = {
    id,
    createdAt: now,
    name: chartName,
    birthDetails,
    chartData,
  };

  // Newest first, capped at MAX_SAVED_CHARTS.
  const updated = [savedChart, ...charts].slice(0, MAX_SAVED_CHARTS);
  saveStoredCharts(updated);
  return savedChart;
}

export function loadCharts(): SavedChart[] {
  return getStoredCharts().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function loadChart(id: string): SavedChart | null {
  return getStoredCharts().find((c) => c.id === id) ?? null;
}

export function deleteChart(id: string): void {
  const charts = getStoredCharts().filter((c) => c.id !== id);
  saveStoredCharts(charts);
}

export function getSavedChartCount(): number {
  return getStoredCharts().length;
}
