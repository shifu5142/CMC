import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SectionHeading } from "@/components/ui/section-heading";
import PricingCards from "@/components/landing/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for solo devs, teams, and enterprises.",
};

const FAQ = [
  {
    q: "Is there a free plan?",
    a: "Yes — 50 reviews / month on public repos forever, no credit card required.",
  },
  {
    q: "Can I cancel any time?",
    a: "Of course. We prorate the rest of the cycle and downgrade you to the Free plan.",
  },
  {
    q: "Where is my code stored?",
    a: "Code is processed in-memory and never persisted unless you enable history. Encryption at rest, SOC2 Type II.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Free Pro for the duration of your studies — email students@codepilot.ai with your .edu address.",
  },
];

function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <section className="bg-spotlight py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Pricing"
              title="Pick the plan that fits your team"
              description="Start free. Upgrade when you want unlimited reviews and private repos."
            />
            <div className="mt-14">
              <PricingCards variant="page" />
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Frequently asked questions" />
            <div className="mt-10 space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-card/50 p-5 open:bg-card"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium">
                    <span className="float-right text-muted-foreground transition group-open:rotate-45">
                      +
                    </span>
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PricingPage;
