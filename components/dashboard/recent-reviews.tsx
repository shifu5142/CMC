"use client";

import Link from "next/link";
import { FileCode2, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ReviewResult } from "@/types";

interface RecentReviewsProps {
  reviews: ReviewResult[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle className="text-base">Recent reviews</CardTitle>
          <CardDescription>
            Your last 10 AI reviews appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<FileCode2 className="size-5" />}
            title="No reviews yet"
            description="Run your first AI code review to see results here."
            action={
              <Button asChild>
                <Link href="/review">Start a review</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card glass>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent reviews</CardTitle>
          <CardDescription>Latest AI analyses across your repos.</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/review">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60">
          {reviews.map((r) => {
            const critical = r.issues.filter((i) => i.severity === "critical").length;
            const high = r.issues.filter((i) => i.severity === "high").length;
            return (
              <li
                key={r.id}
                className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-accent/40"
              >
                <span className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground">
                  <FileCode2 className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-mono text-sm">
                      {r.filename ?? "untitled"}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {r.language}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.summary}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      r.metrics.score >= 90
                        ? "text-emerald-400"
                        : r.metrics.score >= 70
                          ? "text-yellow-400"
                          : "text-red-400",
                    )}
                  >
                    {r.metrics.score}
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    score
                  </div>
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  {critical > 0 ? (
                    <Badge variant="destructive">{critical} crit</Badge>
                  ) : null}
                  {high > 0 ? (
                    <Badge variant="warning">{high} high</Badge>
                  ) : null}
                </div>
                <span className="hidden w-20 text-right text-xs text-muted-foreground md:inline">
                  {formatRelativeTime(r.createdAt)}
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
