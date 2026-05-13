"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { billingService } from "@/services/billingService";

export function BillingActions() {
  const [busy, setBusy] = useState<"upgrade" | "cancel" | null>(null);

  async function upgrade() {
    setBusy("upgrade");
    try {
      const { url } = await billingService.createCheckoutSession("team");
      toast.success("Redirecting to Stripe…");
      window.location.href = url;
    } catch {
      toast.error("Could not start checkout");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button onClick={upgrade} disabled={busy === "upgrade"}>
        {busy === "upgrade" ? "Loading…" : "Upgrade to Team"}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.message("Cancel scheduled", {
            description:
              "Your subscription will end at the end of the billing period.",
          })
        }
      >
        Cancel subscription
      </Button>
    </div>
  );
}
