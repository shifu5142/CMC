"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BillingActions() {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button asChild>
        <Link href="/billing/billingPayment">Subscribe to Pro</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/pricing">Compare plans</Link>
      </Button>
    </div>
  );
}
