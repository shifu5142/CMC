import type { PlanId } from "@/types";

/**
 * Stripe checkout — frontend stub.
 *
 * In production this will POST to `/api/checkout` to create a Stripe Checkout
 * Session and redirect via @stripe/stripe-js. For now we just simulate the
 * flow with a no-op so the upgrade buttons feel real.
 */
export const billingService = {
  async createCheckoutSession(planId: PlanId): Promise<{ url: string }> {
    await new Promise((r) => setTimeout(r, 600));
    return { url: `/billing?plan=${planId}&checkout=mock` };
  },

  async createPortalSession(): Promise<{ url: string }> {
    await new Promise((r) => setTimeout(r, 400));
    return { url: "/billing?portal=mock" };
  },
};
