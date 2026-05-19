import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsCards, type StatItem } from "@/components/dashboard/stats-cards";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCategoryBreakdown, mockTrend } from "@/lib/mock-data";
import { FixRatePie } from "@/app/analytics/fix-rate-pie";

export const metadata: Metadata = {
  title: "Analytics",
};

function AnalyticsPage() {
  const stats: StatItem[] = [
    {
      label: "Reviews (90d)",
      value: 1842,
      delta: 18,
      icon: "Sparkles",
      hint: "vs. prev. 90d",
    },
    {
      label: "Issues caught",
      value: 9034,
      delta: 11,
      icon: "Bug",
      hint: "vs. prev. 90d",
    },
    {
      label: "Critical resolved",
      value: 138,
      delta: 42,
      icon: "ShieldCheck",
      hint: "vs. prev. 90d",
    },
    {
      label: "Avg. fix time",
      value: "21m",
      delta: -14,
      icon: "Activity",
      hint: "vs. prev. 90d",
    },
  ];

  return (
    <DashboardShell
      title="Analytics"
      description="How CMC is making your codebase healthier over time."
    >
      <StatsCards items={stats} />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UsageChart data={mockTrend} title="Trend (last 14 days)" />
        <Card glass>
          <CardHeader>
            <CardTitle className="text-base">Fix rate</CardTitle>
            <CardDescription>
              % of issues fixed within 7 days of being flagged.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <FixRatePie />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryBreakdown data={mockCategoryBreakdown} />
        </div>
        <Card glass>
          <CardHeader>
            <CardTitle className="text-base">Top contributors</CardTitle>
            <CardDescription>Most reviewed authors this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              {[
                { name: "Morgan Lee", reviews: 84 },
                { name: "Alex Rivera", reviews: 71 },
                { name: "Rina Patel", reviews: 52 },
                { name: "Sam Okafor", reviews: 33 },
              ].map((c, i) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2"
                >
                  <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    {c.name}
                  </span>
                  <span className="text-muted-foreground">{c.reviews}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

export default AnalyticsPage;
