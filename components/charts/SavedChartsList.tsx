// components/charts/SavedChartsList.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleLoad(chart: SavedChart) {
    onLoadChart(chart.birthDetails);
    onClose();
  }

  function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    if (confirmDeleteId === id) {
      deleteChart(id);
      setCharts(loadCharts());
      setConfirmDeleteId(null);
      return;
    }
    setConfirmDeleteId(id);
  }

  return (
    <Card className="mx-auto w-full max-w-96 md:max-w-120 border border-border rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-semibold">Saved Birth Charts</CardTitle>
        <Button
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
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock size={34} className="mb-3 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-foreground">
              No saved birth charts
            </h3>
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
                  className={cn(
                    "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
                    "border-b border-border last:border-b-0",
                    "hover:bg-muted hover:shadow-sm transition-colors duration-150",
                    "rounded-md",
                  )}
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
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="w-px h-4 bg-border shrink-0"
                      aria-hidden="true"
                    />
                      {confirmDeleteId === chart.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={(e) => handleDelete(chart.id, e)}
                            className="min-h-[44px] min-w-[44px] shrink-0 p-1.5"
                            aria-label={`Delete ${chart.name}`}
                          >
                            <Trash size={14} aria-hidden="true" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                            }}
                            className="min-h-[44px] min-w-[44px] shrink-0 p-1.5"
                            aria-label="Cancel delete"
                          >
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={(e) => handleDelete(chart.id, e)}
                          className="min-h-[44px] min-w-[44px] shrink-0 p-1.5"
                          aria-label={`Delete ${chart.name}`}
                        >
                          <Trash size={14} aria-hidden="true" />
                        </Button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
