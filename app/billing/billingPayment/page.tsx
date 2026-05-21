"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRICING_PLANS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { PlanId } from "@/types";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </label>
  );
}

function BillingPaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");
  const [submitting, setSubmitting] = useState(false);
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  const plan = PRICING_PLANS.find((p) => p.id === selectedPlan)!;
  const isPaidPlan = selectedPlan !== "free";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isPaidPlan) {
      toast.message("Free plan selected", {
        description: "No payment is required. You can use CMC on the free tier.",
      });
      return;
    }

    if (
      !cardholder.trim() ||
      cardNumber.replace(/\s/g, "").length < 15 ||
      !/^\d{2}\/\d{2}$/.test(expiry.trim()) ||
      cvc.length < 3 ||
      !billingEmail.includes("@")
    ) {
      toast.error("Please fill in all payment fields correctly.");
      return;
    }

    setSubmitting(true);
    try {
      toast.success("Payment details captured", {
        description: `Selected ${plan.name} — connect Stripe on the backend to charge.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell
      title="Subscribe"
      description="Choose a plan and enter your payment details."
    >
      <section className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Choose a plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select the tier that fits your workflow. You can change plans later.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PRICING_PLANS.map((p) => {
              const selected = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlan(p.id)}
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border p-5 text-left transition-all",
                    "bg-card/40 hover:border-primary/40 hover:bg-card/60",
                    selected
                      ? "border-primary ring-2 ring-primary/30 shadow-md shadow-primary/10"
                      : "border-border/60",
                    p.highlight && !selected && "border-primary/30",
                  )}
                >
                  {selected ? (
                    <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                  ) : null}
                  {p.highlight ? (
                    <span className="mb-2 inline-flex w-fit rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Popular
                    </span>
                  ) : null}
                  <span className="text-base font-semibold">{p.name}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tracking-tight">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {p.interval}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-border/50 pt-4">
                    {p.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-3 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-primary" aria-hidden />
              <CardTitle className="text-base">Payment method</CardTitle>
            </div>
            <CardDescription>
              {isPaidPlan
                ? `You will be charged ${formatCurrency(plan.price)} per ${plan.interval} for ${plan.name}.`
                : "The free plan does not require a card."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div
                className={cn(
                  "grid gap-4 sm:grid-cols-2",
                  !isPaidPlan && "pointer-events-none opacity-50",
                )}
              >
                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel htmlFor="cardholder">Cardholder name</FieldLabel>
                  <Input
                    id="cardholder"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    disabled={!isPaidPlan}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel htmlFor="card-number">Card number</FieldLabel>
                  <Input
                    id="card-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    disabled={!isPaidPlan}
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="expiry">Expiry</FieldLabel>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    autoComplete="cc-exp"
                    disabled={!isPaidPlan}
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="cvc">CVC</FieldLabel>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    disabled={!isPaidPlan}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <FieldLabel htmlFor="billing-email">Billing email</FieldLabel>
                  <Input
                    id="billing-email"
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={!isPaidPlan}
                  />
                </div>
              </div>

              {!isPaidPlan ? (
                <p className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                  Select Pro or Team to enable payment fields.
                </p>
              ) : (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 shrink-0" aria-hidden />
                  Payments are processed securely. Card data is not stored in
                  this demo UI.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Processing…"
                    : isPaidPlan
                      ? `Subscribe to ${plan.name}`
                      : "Continue with Free"}
                </Button>
                <Button type="button" variant="ghost" asChild>
                  <Link href="/billing">Back to billing</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}

export default BillingPaymentPage;
