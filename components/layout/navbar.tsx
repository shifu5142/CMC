"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCommand = useUIStore((s) => s.setCommandMenuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {MAIN_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommand(true)}
            className="text-muted-foreground"
            aria-label="Open command menu"
          >
            <Command className="size-3.5" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="ml-1 hidden rounded border border-border/80 bg-muted/70 px-1.5 py-0.5 text-[10px] font-mono lg:inline-block">
              ⌘K
            </kbd>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Get started</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 py-3">
            {MAIN_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button asChild variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}

export default Navbar;
