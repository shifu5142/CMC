"use client";

import { motion } from "framer-motion";
import { Bug, Brush, Shield, Wand2, Zap, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/review/severity-badge";
import type { IssueCategory, ReviewIssue } from "@/types";

const CATEGORY_ICONS: Record<IssueCategory, LucideIcon> = {
  security: Shield,
  performance: Zap,
  bug: Bug,
  refactor: Wand2,
  style: Brush,
};

interface IssueCardProps {
  issue: ReviewIssue;
  index?: number;
}

export function IssueCard({ issue, index = 0 }: IssueCardProps) {
  const Icon = CATEGORY_ICONS[issue.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Card className="overflow-hidden border-border/80">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold">{issue.title}</h4>
                <SeverityBadge severity={issue.severity} />
                <Badge variant="outline" className="text-[10px] capitalize">
                  {issue.category}
                </Badge>
                {issue.reference ? (
                  <Badge variant="info" className="text-[10px]">
                    {issue.reference}
                  </Badge>
                ) : null}
                {typeof issue.line === "number" ? (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    L{issue.line}
                    {issue.endLine ? `–${issue.endLine}` : ""}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">
                {issue.description}
              </p>

              {issue.snippet ? (
                <pre className="mt-3 overflow-x-auto rounded-md border border-border/80 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-zinc-300 scrollbar-thin">
                  <code>{issue.snippet}</code>
                </pre>
              ) : null}

              {issue.suggestion ? (
                <div className="mt-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-400">
                    Suggested fix
                  </p>
                  <pre className="mt-1.5 overflow-x-auto font-mono text-[12px] leading-relaxed text-emerald-200 scrollbar-thin">
                    <code>{issue.suggestion}</code>
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
