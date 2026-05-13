"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Github,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  Command,
  type LucideIcon,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sparkles,
  Github,
  BarChart3,
  Users,
  CreditCard,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const setCommand = useUIStore((s) => s.setCommandMenuOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <>
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen || true ? 0 : -280 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl",
          "transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-md border border-border lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          {DASHBOARD_NAV.map((item) => {
            const Icon = item.icon ? ICONS[item.icon] : LayoutDashboard;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {Icon ? <Icon className="size-4" /> : null}
                <span>{item.label}</span>
                {active ? (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            onClick={() => setCommand(true)}
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <Command className="size-3.5" />
              Search
            </span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
