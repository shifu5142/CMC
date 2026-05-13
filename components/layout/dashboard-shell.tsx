"use client";

import { Menu, Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { useUIStore } from "@/store/useUIStore";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardShell({
  children,
  title,
  description,
  actions,
}: DashboardShellProps) {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const setChatOpen = useUIStore((s) => s.setChatOpen);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-4" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Notifications"
              className="text-muted-foreground"
            >
              <Bell className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="hidden sm:inline-flex"
            >
              <Sparkles className="size-3.5" />
              Ask AI
            </Button>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button asChild size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </SignedOut>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {title || actions ? (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title ? (
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                  </h1>
                ) : null}
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              {actions ? <div className="flex gap-2">{actions}</div> : null}
            </div>
          ) : null}

          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
