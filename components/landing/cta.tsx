"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass relative overflow-hidden rounded-2xl border-border/80 px-8 py-16 text-center sm:px-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-spotlight"
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Ship cleaner code starting tomorrow.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Free for 14 days. No credit card required. Cancel any time.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
