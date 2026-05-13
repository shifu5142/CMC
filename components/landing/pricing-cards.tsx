"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { billingService } from "@/services/billingService";
import { toast } from "sonner";

function PricingCards({
  variant = "section",
}: {
  variant?: "section" | "page";
}) {
  const handleUpgrade = async (planId: (typeof PRICING_PLANS)[number]["id"]) => {
    if (planId === "free") return;
    try {
      toast.loading("Creating checkout session…", { id: "checkout" });
      const { url } = await billingService.createCheckoutSession(planId);
      toast.success("Stripe checkout ready", { id: "checkout" });
      window.location.href = url;
    } catch {
      toast.error("Could not start checkout", { id: "checkout" });
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-3",
        variant === "page" && "lg:gap-6",
      )}
    >
      {PRICING_PLANS.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card
            glass={plan.highlight}
            className={cn(
              "relative flex h-full flex-col p-6",
              plan.highlight && "border-primary/60 ring-1 ring-primary/40",
            )}
          >
            {plan.highlight ? (
              <span className="absolute -top-3 left-6 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                Most popular
              </span>
            ) : null}
            <div>
              <h3 className="text-base font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {plan.interval}
                </span>
              </div>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {plan.id === "free" ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/sign-up">{plan.cta}</Link>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default PricingCards;
