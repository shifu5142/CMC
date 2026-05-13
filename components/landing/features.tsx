"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Bug,
  Wand2,
  GitPullRequestArrow,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURES = [
  {
    icon: Shield,
    title: "Security review",
    text: "Detects OWASP Top 10, secret leaks, unsafe deserialization and weak crypto on every commit.",
  },
  {
    icon: Zap,
    title: "Performance hot-paths",
    text: "Surfaces N+1 queries, render thrash, large bundles and async cliffs before they ship.",
  },
  {
    icon: Bug,
    title: "Bug detection",
    text: "Null derefs, race conditions, unhandled rejections and off-by-one errors — explained.",
  },
  {
    icon: Wand2,
    title: "Smart refactors",
    text: "Type-safe suggestions that respect your codebase style — accept with one click.",
  },
  {
    icon: GitPullRequestArrow,
    title: "GitHub-native",
    text: "Comments inline on PRs. Block merges on critical findings. SOC2 friendly.",
  },
  {
    icon: Cpu,
    title: "Bring your own model",
    text: "Use GPT-4, Claude, or self-hosted models. We meet you wherever your data lives.",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Reviews that actually catch things"
          description="Static linters check style. CodePilot checks intent."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card glass className="h-full p-6 glass-hover">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
