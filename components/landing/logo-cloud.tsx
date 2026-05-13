"use client";

import { motion } from "framer-motion";

const LOGOS = [
  "Vercel",
  "Linear",
  "Notion",
  "Stripe",
  "Loom",
  "Supabase",
  "Cursor",
];

function LogoCloud() {
  return (
    <section className="border-y border-border/60 bg-card/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by teams shipping at scale
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6 opacity-80 sm:grid-cols-4 lg:grid-cols-7"
        >
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-center text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default LogoCloud;
