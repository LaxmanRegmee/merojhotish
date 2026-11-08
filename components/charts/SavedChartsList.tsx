// components/charts/SavedChartsList.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteChart,
  loadCharts,
  type SavedChart,
} from "@/lib/chart-storage";

interface SavedChartsListProps {
  onLoadChart: (
    birthDetails: SavedChart["birthDetails"],
  ) => void;
  onClose: () => void;
}

export default function SavedChartsList({
  onLoadChart,
  onClose,
}: SavedChartsListProps) {
  const [charts, setCharts] = useState<SavedChart[]>(() => loadCharts());

  function handleLoad(chart: SavedChart) {
    onLoadChart(chart.birthDetails);
    onClose();
  }

  function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    deleteChart(id);
    setCharts(loadCharts());
  }

  return (
    <Card className="mx-auto w-full max-w-96 md:max-w-120 border border-border rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-semibold">Saved Birth Charts</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-xs p-1.5"
          aria-label="Close saved charts"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {charts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock size={32} className="mb-3 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              No saved birth charts yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Generate a chart and save it to view it here later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {charts.map((chart) => {
              const date = new Date(chart.createdAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "short", day: "numeric" },
              );
              const time = new Date(chart.createdAt).toLocaleTimeString(
                undefined,
                { hour: "2-digit", minute: "2-digit" },
              );
              const { bsYear, bsMonth, bsDay, birthTime, city } =
                chart.birthDetails;
              return (
                <div
                  key={chart.id}
                  onClick={() => handleLoad(chart)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {chart.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {city} · {bsYear}/{String(bsMonth).padStart(2, "0")}/{String(bsDay).padStart(2, "0")} · {birthTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Saved {date} at {time}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={(e) => handleDelete(chart.id, e)}
                    className="size-6 shrink-0"
                    aria-label={`Delete ${chart.name}`}
                  >
                    <Trash size={14} aria-hidden="true" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
