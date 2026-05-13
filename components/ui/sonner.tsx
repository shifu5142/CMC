"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast container. Use the `toast()` function from `sonner` to
 * display success / error notifications.
 */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
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
