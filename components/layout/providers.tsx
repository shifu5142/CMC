"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/layout/command-menu";

/**
 * All app-wide client providers. Wraps tooltips, toasts and the global cmd-k
 * command palette.
 *
 * Auth (Clerk) is intentionally stubbed out — wire it back in by wrapping the
 * children in `<ClerkProvider>` and re-creating `proxy.ts`.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      {children}
      <CommandMenu />
      <Toaster />
    </TooltipProvider>
  );
}
