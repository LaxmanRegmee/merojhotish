"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-4 text-muted-foreground max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent text-accent-foreground"
      >
        Try Again
      </button>
    </div>
  );
}
