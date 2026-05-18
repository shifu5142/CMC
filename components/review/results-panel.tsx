"use client";

import { useMemo, useState } from "react";
import { FileCode2, ListFilter, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreIndicator } from "@/components/review/score-indicator";
import { IssueCard } from "@/components/review/issue-card";
import type { IssueCategory, ReviewResult, Severity } from "@/types";

interface ResultsPanelProps {
  result: ReviewResult | null;
  loading?: boolean;
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

function ResultsHeader({
  result,
  counts,
  findingsCount,
}: {
  result: ReviewResult;
  counts: Record<Severity, number> | null;
  findingsCount?: number;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-5">
        <ScoreIndicator score={result.metrics?.score ?? 0} />
        <div>
          <CardTitle className="text-base">
            {result.filename ?? "Review result"}
          </CardTitle>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {result.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {findingsCount ? (
              <Badge variant="outline" className="gap-1">
                <ListFilter className="size-3" />
                {findingsCount} finding{findingsCount === 1 ? "" : "s"}
              </Badge>
            ) : null}
            {counts && counts.critical ? (
              <Badge variant="destructive">{counts.critical} critical</Badge>
            ) : null}
            {counts && counts.high ? (
              <Badge variant="warning">{counts.high} high</Badge>
            ) : null}
            {counts && counts.medium ? (
              <Badge variant="info">{counts.medium} medium</Badge>
            ) : null}
            {counts && counts.low ? (
              <Badge variant="outline">{counts.low} low</Badge>
            ) : null}
            {counts && counts.info ? (
              <Badge variant="secondary">{counts.info} info</Badge>
            ) : null}
            <Badge variant="secondary" className="capitalize">
              {result.language}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-2.5">
        <Metric label="Security" value={result.metrics?.security ?? 0} />
        <Metric label="Performance" value={result.metrics?.performance ?? 0} />
        <Metric
          label="Maintainability"
          value={result.metrics?.maintainability ?? 0}
        />
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
  aiTab: "description" | "code";
  setAiTab: (tab: "description" | "code") => void;
}) {
  return (
    <Tabs
      value={aiTab}
      onValueChange={(v) => setAiTab(v as "description" | "code")}
    >
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-4">
        {result.reviewDescription ? (
          <div className="max-h-[min(420px,50vh)] overflow-y-auto rounded-lg border border-border/60 bg-card/40 p-4 scrollbar-thin">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {result.reviewDescription}
            </p>
          </div>
        ) : (
          <EmptyState
            title="No description"
            description="The review did not return a description."
          />
        )}
      </TabsContent>

      <TabsContent value="code" className="mt-4">
        {result.reviewCode ? (
          <pre className="max-h-[min(420px,50vh)] overflow-auto rounded-lg border border-border/60 bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-zinc-200 scrollbar-thin">
            <code>{result.reviewCode}</code>
          </pre>
        ) : (
          <EmptyState
            icon={<FileCode2 className="size-5" />}
            title="No code"
            description="The review did not return fixed code."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

export function ResultsPanel({ result, loading }: ResultsPanelProps) {
  const [filter, setFilter] = useState<"all" | IssueCategory>("all");
  const [aiTab, setAiTab] = useState<"description" | "code">("description");
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
        <CardHeader className="gap-2">
          <ResultsHeader
            result={result}
            counts={counts}
            findingsCount={findingsCount || 1}
          />
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
      <CardHeader className="gap-2">
        <ResultsHeader result={result} counts={counts} />
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
