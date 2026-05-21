"use client";

import Link from "next/link";
import { CreditCard, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { EmptyState } from "@/components/ui/empty-state";
import { PRICING_PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { BillingActions } from "@/app/billing/billing-actions";
import { User } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const FREE_REVIEWS_LIMIT = 50;
const FREE_REVIEWS_USED = 12;

function BillingPage() {
  const [activeUser, setActiveUser] = useState<string | null>('not active');
  const router = useRouter();
  const freePlan = PRICING_PLANS.find((p) => p.id === "free")!;
  const proPlan = PRICING_PLANS.find((p) => p.id === "pro")!;
  const pct = (FREE_REVIEWS_USED / FREE_REVIEWS_LIMIT) * 100;

  useEffect(() => {
    async function fetchBilling() {
      try {
        const response = await fetch(`${backendUrl}/billing`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!data.success) {
          router.push("/not-found");
        }
        if (data.success&&data.user) {
          setActiveUser(data.user.currentPlan);
        }
      } catch (error) {
        console.error(error);
        router.push("/not-found");
      }
    }

    fetchBilling();
  }, [router]);

  return (
    <DashboardShell
      title="Billing"
      description="You don't have an active paid subscription yet."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Current plan</CardTitle>
              <CardDescription>
                You&apos;re on the{" "}
                <span className="font-medium text-foreground">
                  {freePlan.name}
                </span>{" "}
                tier — no paid subscription is active.
              </CardDescription>
            </div>
            <Badge variant="secondary">{activeUser==='active'?'Active':'not active'}</Badge>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatCurrency(freePlan.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {freePlan.interval}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {freePlan.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Reviews this month (free limit)
                </span>
                <span className="font-medium">
                  {FREE_REVIEWS_USED} / {FREE_REVIEWS_LIMIT}
                </span>
              </div>
              <Progress value={pct} />
            </div>

            <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground">
                Unlock {proPlan.name} — {formatCurrency(proPlan.price)}/
                {proPlan.interval}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited reviews, private repos, security scans, and priority
                support.
              </p>
              <BillingActions />
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
            <CardDescription>
              Add a card when you subscribe.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30 px-4 py-8 text-center">
              <CreditCard
                className="size-8 text-muted-foreground/50"
                aria-hidden
              />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No payment method on file
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Billing details appear after your first subscription.
              </p>
            </div>

            <Button variant="outline" className="mt-3 w-full" disabled>
              Billing portal unavailable
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card glass className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
          <CardDescription>
            Receipts will show here once you have a paid plan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="No invoices yet"
            description="Subscribe to Pro to start receiving monthly invoices and download receipts."
            action={
              <Button asChild size="sm">
                <Link href="/pricing">View pricing</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

export default BillingPage;
