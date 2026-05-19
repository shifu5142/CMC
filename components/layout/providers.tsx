"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/layout/command-menu";
import { ThemeProvider, useTheme } from "@/components/layout/theme-provider";

/**
 * All app-wide client providers. Wraps tooltips, toasts and the global cmd-k
 * command palette.
 *
 * Auth (Clerk) is intentionally stubbed out — wire it back in by wrapping the
 * children in `<ClerkProvider>` and re-creating `proxy.ts`.
 */
function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        {children}
        <CommandMenu />
        <ThemedToaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
