"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          {error.message ||
            "An unexpected error occurred. You can try again or head back to the dashboard."}
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard">Go to dashboard</a>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default RootError;
