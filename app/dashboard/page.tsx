import Link from "next/link";
import { Activity, Bug, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentReviews } from "@/components/dashboard/recent-reviews";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { Button } from "@/components/ui/button";
import {
  mockActivity,
  mockCategoryBreakdown,
  mockRecentReviews,
  mockTrend,
} from "@/lib/mock-data";
import { AIChat } from "@/components/review/ai-chat";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const stats = [
    {
      label: "Reviews this month",
      value: 248,
      delta: 12,
      icon: Sparkles,
      hint: "vs. last month",
    },
    {
      label: "Issues caught",
      value: 1342,
      delta: 8,
      icon: Bug,
      hint: "vs. last month",
    },
    {
      label: "Critical findings",
      value: 18,
      delta: -22,
      icon: ShieldCheck,
      hint: "vs. last month",
    },
    {
      label: "Avg. review time",
      value: "3.2s",
      delta: -5,
      icon: Activity,
      hint: "vs. last month",
    },
  ];

  return (
    <DashboardShell
      title="Welcome back"
      description="Here's what CodePilot has been up to."
      actions={
        <Button asChild>
          <Link href="/review">
            <Sparkles className="size-4" />
            New review
          </Link>
        </Button>
      }
    >
      <StatsCards items={stats} />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UsageChart data={mockTrend} />
        <ActivityFeed events={mockActivity} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentReviews reviews={mockRecentReviews} />
        </div>
        <CategoryBreakdown data={mockCategoryBreakdown} />
      </div>

      <AIChat />
    </DashboardShell>
  );
}
