import type { Metadata } from "next";
import { CheckCircle2, Download, ExternalLink } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PRICING_PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { BillingActions } from "@/app/billing/billing-actions";

export const metadata: Metadata = {
  title: "Billing",
};

const INVOICES = [
  {
    id: "in_001",
    date: "2026-05-01",
    description: "Pro · May 2026",
    amount: 19,
    status: "Paid",
  },
  {
    id: "in_002",
    date: "2026-04-01",
    description: "Pro · April 2026",
    amount: 19,
    status: "Paid",
  },
  {
    id: "in_003",
    date: "2026-03-01",
    description: "Pro · March 2026",
    amount: 19,
    status: "Paid",
  },
];

function BillingPage() {
  const currentPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
  const usedReviews = 184;
  const totalReviews = 500;
  const pct = (usedReviews / totalReviews) * 100;

  return (
    <DashboardShell
      title="Billing"
      description="Manage your subscription and download invoices."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">Current plan</CardTitle>
              <CardDescription>
                You&apos;re on the{" "}
                <span className="font-medium text-foreground">
                  {currentPlan.name}
                </span>{" "}
                plan.
              </CardDescription>
            </div>
            <Badge variant="success">
              <CheckCircle2 className="size-3" /> Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">
                {formatCurrency(currentPlan.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {currentPlan.interval}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Reviews this period
                </span>
                <span className="font-medium">
                  {usedReviews} / {totalReviews}
                </span>
              </div>
              <Progress value={pct} />
            </div>

            <BillingActions />
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
            <CardDescription>Managed by Stripe.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-card/40 p-3">
              <p className="text-sm font-medium">Visa •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/28</p>
            </div>
            <Button variant="outline" className="mt-3 w-full">
              <ExternalLink className="size-3.5" />
              Open billing portal
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card glass className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
          <CardDescription>Download receipts for accounting.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-border/40 last:border-0">
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                    {inv.date}
                  </td>
                  <td className="px-6 py-3">{inv.description}</td>
                  <td className="px-6 py-3">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-3">
                    <Badge variant="success">{inv.status}</Badge>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button size="sm" variant="ghost">
                      <Download className="size-3.5" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

export default BillingPage;
