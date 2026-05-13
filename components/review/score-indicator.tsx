"use client";

import { motion } from "framer-motion";
import { cn, clamp } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: number;
  label?: string;
  size?: number;
}

export function ScoreIndicator({
  score,
  label = "Quality score",
  size = 120,
}: ScoreIndicatorProps) {
  const value = clamp(score, 0, 100);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 90
      ? "text-emerald-400"
      : value >= 70
        ? "text-yellow-400"
        : value >= 50
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            className="stroke-muted"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={8}
            className={cn(color, "stroke-current")}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-semibold tracking-tight", color)}>
            {value}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      {label ? (
        <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
