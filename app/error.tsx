"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-foreground">
      <div className="max-w-md w-full rounded-lg border border-border p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an unexpected error while preparing your birth chart.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
