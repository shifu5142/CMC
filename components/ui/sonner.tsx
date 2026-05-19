"use client";

import { Toaster as SonnerToaster } from "sonner";
import type { Theme } from "@/lib/theme";

/**
 * App-wide toast container. Use the `toast()` function from `sonner` to
 * display success / error notifications.
 */
export function Toaster({ theme = "dark" }: { theme?: Theme }) {
  return (
    <SonnerToaster
      theme={theme}
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "glass border-border text-foreground text-sm rounded-lg shadow-xl",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
        },
      }}
    />
  );
}
