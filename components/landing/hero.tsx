"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-spotlight"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-40"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <Sparkles className="size-3 text-violet-400" />
          GPT-4 powered · Open source friendly
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          AI code review that catches bugs{" "}
          <span className="text-gradient">before your team does.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          CMC reviews every PR for security flaws, performance
          regressions, and refactor opportunities — in seconds, with the
          context of a senior engineer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/sign-up">
              Start free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Github className="size-4" />
              View dashboard
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 w-full max-w-5xl"
        >
          <div className="glass rounded-2xl p-2 shadow-2xl">
            <div className="overflow-hidden rounded-xl border border-border bg-black/40">
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  src/server/users.ts
                </span>
              </div>
              <pre className="overflow-x-auto p-6 text-left font-mono text-[13px] leading-relaxed text-zinc-300 scrollbar-thin">
                <code>
                  <span className="text-violet-400">export async function</span>{" "}
                  <span className="text-sky-300">getUser</span>(email:{" "}
                  <span className="text-emerald-300">string</span>) {"{"}
                  {"\n"}  <span className="text-violet-400">const</span> sql ={" "}
                  <span className="text-amber-300">{"`SELECT * FROM users WHERE email = '${email}'`"}</span>
                  ;{"\n"}  <span className="text-rose-400">// ⚠ CMC: potential SQL injection (CWE-89)</span>
                  {"\n"}  <span className="text-violet-400">return</span> db.query(sql);
                  {"\n"}{"}"}
                </code>
              </pre>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-12 -bottom-20 h-40 bg-gradient-to-t from-background to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
