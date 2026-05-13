"use client";

import { Menu, Bell, Sparkles, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/store/useUIStore";
import { mockUser } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open user menu"
                >
                  <Avatar className="h-8 w-8">
                    {mockUser.imageUrl ? (
                      <AvatarImage src={mockUser.imageUrl} alt={mockUser.name} />
                    ) : null}
                    <AvatarFallback>{getInitials(mockUser.name)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {mockUser.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mockUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <UserIcon className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <SettingsIcon className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="size-4" />
                    Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
