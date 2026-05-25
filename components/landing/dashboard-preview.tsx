"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  LayoutDashboard,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: LayoutDashboard,
    title: "Dashboard overview",
    description:
      "Track reviews, issues caught, and trends in one place the moment you sign in.",
  },
  {
    icon: Sparkles,
    title: "AI code review",
    description:
      "Paste or upload code, run a review, and get scores plus fixed code and notes.",
  },
  {
    icon: Shield,
    title: "Security & quality",
    description:
      "See security, performance, and maintainability grades on every review.",
  },
  {
    icon: BarChart3,
    title: "Activity & history",
    description:
      "Monitor recent reviews, category breakdowns, and usage over time.",
  },
];

function DashboardPreview() {
  return (
    <section
      id="product"
      className="relative overflow-hidden border-y border-border/40 bg-muted/10 py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[min(100%,900px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,hsl(263_85%_50%/0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product preview"
          title="Everything you need, one dashboard"
          description="Run reviews, read AI feedback, and follow your team's progress without jumping between tools."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <motion.ul
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {CAPABILITIES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex gap-4 rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card/60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}

            <li className="pt-2">
              <Button asChild>
                <Link href="/sign-up">
                  Try the dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent blur-2xl"
            />

            <div className="glass relative rounded-2xl p-2 shadow-2xl ring-1 ring-white/5">
              <div className="overflow-hidden rounded-xl border border-border/80 bg-background">
                <div className="flex items-center gap-2 border-b border-border/60 bg-card/80 px-4 py-3">
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  </span>
                  <span className="ml-1 truncate font-mono text-[11px] text-muted-foreground">
                    app.cmc.dev/dashboard
                  </span>
                </div>

                <div className="relative aspect-[16/10] w-full bg-muted/20">
                  <Image
                    src="/home-page.png"
                    alt="CMC dashboard showing review stats, charts, recent reviews, and activity feed"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={false}
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                "absolute -bottom-4 -left-4 hidden rounded-lg border border-emerald-500/30",
                "bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:block",
              )}
            >
              Live product UI
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
