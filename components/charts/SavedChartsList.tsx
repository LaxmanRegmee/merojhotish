// components/charts/SavedChartsList.tsx
"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  deleteChart,
  loadCharts,
  type SavedChart,
} from "@/lib/chart-storage";

interface SavedChartsListProps {
  onLoadChart: (birthDetails: unknown) => void;
  onClose: () => void;
}

export default function SavedChartsList({
  onLoadChart,
  onClose,
}: SavedChartsListProps) {
  return (
    <div className="mx-auto w-full max-w-96 md:max-w-120 border border-border rounded-xl shadow-sm">
      <div className="flex flex-row items-center justify-between p-4 pb-2">
        <h3 className="text-sm font-semibold">Saved Birth Charts</h3>
        <div className="flex justify-end mt-6 px-4">
          <button
            type="button"
            className="text-xs p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-1.5"
            aria-label="Go back"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go back
          </button>
        </div>
      </div>
      <div className="p-0">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <svg className="h-8 w-8 mb-3 text-muted-foreground" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-foreground">No saved birth charts</h3>
          <p className="mt-1 text-xs text-muted-foreground">Generate a chart and save it to view it here later.</p>
        </div>
      </div>
      <div className="flex justify-end mt-6 px-4">
        <button
          type="button"
          className="text-xs p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-1.5"
          aria-label="Go back"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Go back
        </button>
      </div>
    </div>
  );
}
