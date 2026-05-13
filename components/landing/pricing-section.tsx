import { SectionHeading } from "@/components/ui/section-heading";
import PricingCards from "@/components/landing/pricing-cards";

function PricingSection() {  return (
    <section className="py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Pay only for what you ship. Cancel any time."
        />
        <div className="mt-14">
          <PricingCards />
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
