"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 text-foreground">
      <div className="max-w-md w-full rounded-lg border border-border p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/")}>Go back home</Button>
      </div>
    </div>
  );
}
