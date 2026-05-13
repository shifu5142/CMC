"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenu } from "@/components/layout/command-menu";

/**
 * All app-wide client providers. Wraps Clerk auth, tooltips, toasts and the
 * global cmd-k command palette.
 *
 * In dev, Clerk requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. The app will still
 * render without it (Clerk shows a friendly error message).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(263 85% 65%)",
          colorBackground: "hsl(240 10% 4%)",
          colorText: "hsl(0 0% 98%)",
          colorInputBackground: "hsl(240 6% 14%)",
          colorInputText: "hsl(0 0% 98%)",
          borderRadius: "0.5rem",
        },
      }}
    >
      <TooltipProvider delayDuration={150}>
        {children}
        <CommandMenu />
        <Toaster />
      </TooltipProvider>
    </ClerkProvider>
  );
}
