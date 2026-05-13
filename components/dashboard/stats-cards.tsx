"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: number | string;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
}

interface StatsCardsProps {
  items: StatItem[];
}

export function StatsCards({ items }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat, i) => {
        const positive = (stat.delta ?? 0) >= 0;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Card glass className="overflow-hidden">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {typeof stat.value === "number"
                      ? formatNumber(stat.value)
                      : stat.value}
                  </p>
                  {typeof stat.delta === "number" ? (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5",
                          positive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400",
                        )}
                      >
                        {positive ? (
                          <ArrowUpRight className="size-3" />
                        ) : (
                          <ArrowDownRight className="size-3" />
                        )}
                        {Math.abs(stat.delta)}%
                      </span>
                      {stat.hint ? (
                        <span className="text-muted-foreground">
                          {stat.hint}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <stat.icon className="size-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
