"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileCode2, ListFilter, Sparkles, ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreIndicator } from "@/components/review/score-indicator";
import { ReviewDescriptionPanel } from "@/components/review/review-description";
import { IssueCard } from "@/components/review/issue-card";
import type { IssueCategory, ReviewResult, Severity } from "@/types";

interface ResultsPanelProps {
  result: ReviewResult | null;
  loading?: boolean;
  reviewLimitReached?: boolean;
}

function ReviewLimitBanner() {
  return (
    <div className="rounded-xl border border-amber-500/35 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <ShieldAlert className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Daily review limit reached
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Free accounts include 3 reviews per day. Upgrade for unlimited
              reviews and full access.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/billing/billingPayment">Upgrade plan</Link>
        </Button>
      </div>
    </div>
  );
}

function getIssues(result: ReviewResult) {
  return Array.isArray(result.issues) ? result.issues : [];
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function AiGradeHeader({ result }: { result: ReviewResult }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-5">
        <ScoreIndicator score={result.metrics.score} />
        <div>
          <CardTitle className="text-base">
            {result.filename?.trim() || "Review result"}
          </CardTitle>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="capitalize">
              {result.language}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-2.5">
        <Metric label="Security" value={result.metrics.security} />
        <Metric label="Performance" value={result.metrics.performance} />
        <Metric label="Maintainability" value={result.metrics.maintainability} />
      </div>
    </div>
  );
}

function AiReviewOutput({
  result,
  aiTab,
  setAiTab,
}: {
  result: ReviewResult;
  aiTab: "fixed code" | "description";
  setAiTab: (tab: "fixed code" | "description") => void;
}) {
  return (
    <Tabs
      value={aiTab}
      onValueChange={(v) => setAiTab(v as "fixed code" | "description")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="fixed code">Fixed Code</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
      </TabsList>

      <TabsContent value="fixed code" className="mt-4">
        {result.reviewCode ? (
          <pre className="max-h-[min(420px,50vh)] overflow-auto rounded-lg border border-border/60 bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-zinc-200 scrollbar-thin">
            <code>{result.reviewCode}</code>
          </pre>
        ) : (
          <EmptyState
            icon={<FileCode2 className="size-5" />}
            title="No fixed code"
            description="The review did not return fixed code."
          />
        )}
      </TabsContent>

      <TabsContent value="description" className="mt-4">
        {result.reviewDescription ? (
          <ReviewDescriptionPanel text={result.reviewDescription} />
        ) : (
          <EmptyState
            title="No description"
            description="The review did not return a description."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

function LegacyResultsHeader({
  r,
  c,
  fc,
}: {
  r: ReviewResult;
  c: Record<Severity, number> | null;
  fc?: number;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-5">
        <ScoreIndicator score={r.metrics?.score ?? 0} />
        <div>
          <CardTitle className="text-base">
            {r.filename ?? "Review result"}
          </CardTitle>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {r.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {fc ? (
              <Badge variant="outline" className="gap-1">
                <ListFilter className="size-3" />
                {fc} finding{fc === 1 ? "" : "s"}
              </Badge>
            ) : null}
            {c && c.critical ? (
              <Badge variant="destructive">{c.critical} critical</Badge>
            ) : null}
            {c && c.high ? (
              <Badge variant="warning">{c.high} high</Badge>
            ) : null}
            {c && c.medium ? (
              <Badge variant="info">{c.medium} medium</Badge>
            ) : null}
            {c && c.low ? (
              <Badge variant="outline">{c.low} low</Badge>
            ) : null}
            {c && c.info ? (
              <Badge variant="secondary">{c.info} info</Badge>
            ) : null}
            <Badge variant="secondary" className="capitalize">
              {r.language}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-2.5">
        <Metric label="Security" value={r.metrics?.security ?? 0} />
        <Metric label="Performance" value={r.metrics?.performance ?? 0} />
        <Metric
          label="Maintainability"
          value={r.metrics?.maintainability ?? 0}
        />
      </div>
    </div>
  );
}

export function ResultsPanel({
  result,
  loading,
  reviewLimitReached = false,
}: ResultsPanelProps) {
  const [filter, setFilter] = useState<"all" | IssueCategory>("all");
  const [aiTab, setAiTab] = useState<"fixed code" | "description">("fixed code");
  const issues = result ? getIssues(result) : [];
  const hasAiReview = Boolean(
    result?.reviewDescription ?? result?.reviewCode,
  );

  const findingsCount = useMemo(() => {
    if (!result?.reviewDescription) return 0;
    return (result.reviewDescription.match(/^\d+\.\s/gm) ?? []).length;
  }, [result?.reviewDescription]);

  const counts = useMemo(() => {
    if (!result || hasAiReview) return null;
    const bySeverity: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };
    for (const i of issues) bySeverity[i.severity] += 1;
    return bySeverity;
  }, [result, issues, hasAiReview]);

  if (loading) {
    return (
      <Card glass>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    if (reviewLimitReached) {
      return (
        <Card glass className="overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <ReviewLimitBanner />
            <EmptyState
              icon={<Sparkles className="size-5" />}
              title="Review limit reached"
              description="Upgrade your plan to run more reviews today."
            />
          </CardContent>
        </Card>
      );
    }
    return (
      <EmptyState
        icon={<Sparkles className="size-5" />}
        title="No review yet"
        description="Paste or upload code and click ‘Run Review’. Results will appear here."
      />
    );
  }

  if (hasAiReview) {
    return (
      <Card glass className="overflow-hidden">
        <CardHeader className="gap-3">
          {reviewLimitReached ? <ReviewLimitBanner /> : null}
          <AiGradeHeader result={result} />
        </CardHeader>

        <CardContent>
          <AiReviewOutput
            result={result}
            aiTab={aiTab}
            setAiTab={setAiTab}
          />
        </CardContent>
      </Card>
    );
  }

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.category === filter);

  return (
    <Card glass className="overflow-hidden">
      <CardHeader className="gap-3">
        {reviewLimitReached ? <ReviewLimitBanner /> : null}
        <LegacyResultsHeader
          r={result}
          c={counts}
          fc={findingsCount || undefined}
        />
      </CardHeader>

      <CardContent>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="all">
                <ListFilter className="size-3.5" />
                All ({issues.length})
              </TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="bug">Bug</TabsTrigger>
              <TabsTrigger value="refactor">Refactor</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={filter} className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                title="No issues in this category"
                description="Try a different filter or run another review."
              />
            ) : (
              filtered.map((issue, i) => (
                <IssueCard key={issue.id} issue={issue} index={i} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
