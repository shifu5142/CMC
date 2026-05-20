"use client";

import type { ReactNode } from "react";
import {
  AlignLeft,
  ClipboardList,
  FileText,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function formatInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {bold[1]}
        </strong>
      );
    }
    const code = part.match(/^`([^`]+)`$/);
    if (code) {
      return (
        <code
          key={i}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground/95"
        >
          {code[1]}
        </code>
      );
    }
    return part;
  });
}

function sectionAccentIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (
    l.includes("security") ||
    l.includes("vulnerab") ||
    l.includes("injection")
  ) {
    return Shield;
  }
  if (l.includes("perform") || l.includes("speed") || l.includes("optim")) {
    return Zap;
  }
  if (
    l.includes("maintain") ||
    l.includes("readab") ||
    l.includes("refactor") ||
    l.includes("structure")
  ) {
    return Wrench;
  }
  if (
    l.includes("summary") ||
    l.includes("overview") ||
    l.includes("title") ||
    l.includes("conclusion")
  ) {
    return ClipboardList;
  }
  return AlignLeft;
}

type Block =
  | { type: "rule" }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "titleCard"; text: string }
  | { type: "kv"; key: string; value: string }
  | { type: "olist"; items: string[] }
  | { type: "ulist"; items: string[] }
  | { type: "p"; text: string };

function parseToBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }

    if (/^[-*_]{3,}\s*$/.test(trimmed)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    const md = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (md) {
      blocks.push({
        type: "h",
        level: md[1].length as 1 | 2 | 3,
        text: md[2],
      });
      i++;
      continue;
    }

    if (/^Title:\s*/i.test(trimmed)) {
      blocks.push({
        type: "titleCard",
        text: trimmed.replace(/^Title:\s*/i, ""),
      });
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) break;
        const m = t.match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: "olist", items });
      continue;
    }

    if (/^[-*]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) break;
        const m = t.match(/^[-*]\s+(.*)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: "ulist", items });
      continue;
    }

    const kv = trimmed.match(/^([^:\n]{1,55}):\s+(.+)$/);
    if (kv && kv[1].length >= 2 && !kv[1].includes(".")) {
      blocks.push({ type: "kv", key: kv[1].trim(), value: kv[2].trim() });
      i++;
      continue;
    }

    const sectionKey = trimmed.match(/^([^:\n]{2,50}):\s*$/);
    if (sectionKey) {
      const key = sectionKey[1].trim();
      i++;
      const bodyLines: string[] = [];
      while (i < lines.length) {
        const t = lines[i];
        const tr = t.trim();
        if (!tr) break;
        if (
          /^#{1,3}\s/.test(tr) ||
          /^Title:/i.test(tr) ||
          /^\d+\.\s/.test(tr) ||
          /^[-*]\s/.test(tr) ||
          /^[-*_]{3,}\s*$/.test(tr) ||
          /^[^:\n]{2,50}:\s*$/.test(tr)
        ) {
          break;
        }
        bodyLines.push(tr);
        i++;
      }
      const body = bodyLines.join(" ");
      if (body) {
        blocks.push({ type: "kv", key, value: body });
      } else {
        blocks.push({ type: "h", level: 3, text: key });
      }
      continue;
    }

    const para: string[] = [trimmed];
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (
        /^#{1,3}\s/.test(t) ||
        /^Title:/i.test(t) ||
        /^\d+\.\s/.test(t) ||
        /^[-*]\s/.test(t) ||
        /^[-*_]{3,}\s*$/.test(t) ||
        /^[^:\n]{2,50}:\s*$/.test(t) ||
        /^[^:\n]{1,55}:\s+.+$/.test(t)
      ) {
        break;
      }
      para.push(t);
      i++;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return blocks;
}

function clusterIntoPanels(blocks: Block[]): Block[][] {
  const clusters: Block[][] = [];
  let current: Block[] = [];

  const flush = () => {
    if (current.length) clusters.push(current);
    current = [];
  };

  for (const b of blocks) {
    if (b.type === "rule") {
      flush();
      clusters.push([b]);
      continue;
    }
    if (b.type === "h" && b.level <= 2) {
      flush();
      current.push(b);
      continue;
    }
    if (b.type === "titleCard") {
      flush();
      clusters.push([b]);
      continue;
    }
    current.push(b);
  }
  flush();
  return clusters;
}

function renderBlock(b: Block, idx: string): ReactNode {
  switch (b.type) {
    case "rule":
      return <Separator key={idx} className="my-2 bg-border/60" />;
    case "h": {
      const cls =
        b.level === 1
          ? "text-lg font-semibold tracking-tight text-foreground"
          : b.level === 2
            ? "text-base font-semibold text-foreground"
            : "text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground";
      return (
        <h3 key={idx} className={cn(cls, "scroll-mt-3")}>
          {formatInline(b.text)}
        </h3>
      );
    }
    case "titleCard":
      return (
        <div
          key={idx}
          className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-primary/[0.06] to-transparent p-4 sm:p-5 shadow-sm"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            Executive summary
          </p>
          <p className="mt-2 text-[15px] font-semibold leading-snug text-foreground">
            {formatInline(b.text)}
          </p>
        </div>
      );
    case "kv": {
      const Icon = sectionAccentIcon(b.key);
      return (
        <div
          key={idx}
          className="rounded-lg border border-border/50 bg-muted/25 p-3.5 sm:p-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/80 text-primary shadow-sm ring-1 ring-border/40">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {formatInline(b.key)}
              </p>
              <p className="text-[14px] leading-relaxed text-foreground/95">
                {formatInline(b.value)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    case "olist":
      return (
        <ol key={idx} className="space-y-2.5">
          {b.items.map((item, n) => (
            <li
              key={n}
              className="flex gap-3 rounded-xl border border-border/45 bg-card/50 p-3.5 shadow-sm"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-xs font-bold tabular-nums text-primary"
                aria-hidden
              >
                {n + 1}
              </span>
              <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-foreground/95">
                {formatInline(item)}
              </p>
            </li>
          ))}
        </ol>
      );
    case "ulist":
      return (
        <ul key={idx} className="space-y-2 rounded-xl border border-border/40 bg-card/35 p-3 sm:p-4">
          {b.items.map((item, n) => (
            <li
              key={n}
              className="flex gap-3 text-[14px] leading-relaxed text-foreground/95"
            >
              <span
                className="mt-2 size-2 shrink-0 rounded-full bg-primary/80 ring-2 ring-primary/25"
                aria-hidden
              />
              <span className="min-w-0">{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "p":
      return (
        <p
          key={idx}
          className="text-[14px] leading-[1.7] text-foreground/90"
        >
          {formatInline(b.text)}
        </p>
      );
    default:
      return null;
  }
}

export function ReviewDescriptionPanel({ text }: { text: string }) {
  const blocks = parseToBlocks(text);
  const clusters = clusterIntoPanels(blocks);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/55 bg-gradient-to-b from-card/95 via-card/70 to-muted/15 shadow-md ring-1 ring-black/5 dark:ring-white/5">
      <div className="flex items-center justify-between gap-3 border-b border-border/45 bg-muted/30 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <FileText className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Review notes
            </p>
            <p className="text-[11px] text-muted-foreground">
              Structured summary of findings and recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[min(480px,58vh)] overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 scrollbar-thin">
        <div className="space-y-4">
          {clusters.map((cluster, ci) => {
            const onlyRule =
              cluster.length === 1 && cluster[0].type === "rule";
            if (onlyRule) {
              return (
                <Separator key={`c-${ci}`} className="bg-border/50" />
              );
            }

            if (
              cluster.length === 1 &&
              cluster[0].type === "titleCard"
            ) {
              return (
                <div key={`c-${ci}`} className="space-y-3">
                  {renderBlock(cluster[0], `${ci}-0`)}
                </div>
              );
            }

            const hasSurface =
              cluster.some(
                (x) =>
                  x.type !== "h" &&
                  x.type !== "rule",
              ) || cluster.some((x) => x.type === "h" && x.level <= 2);

            const inner = cluster.map((block, bi) =>
              renderBlock(block, `${ci}-${bi}`),
            );

            if (!hasSurface) {
              return (
                <div key={`c-${ci}`} className="space-y-3">
                  {inner}
                </div>
              );
            }

            const head = cluster.find(
              (x): x is Extract<Block, { type: "h" }> =>
                x.type === "h" && x.level <= 2,
            );

            if (head) {
              const Icon = sectionAccentIcon(head.text);
              const rest = cluster.filter((x) => x !== head);
              return (
                <section
                  key={`c-${ci}`}
                  className="overflow-hidden rounded-xl border border-border/50 bg-card/40 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 border-b border-border/40 bg-muted/25 px-4 py-3">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                    <h2 className="text-sm font-semibold text-foreground">
                      {formatInline(head.text)}
                    </h2>
                  </div>
                  <div className="space-y-3 p-4 sm:p-4">
                    {rest.map((block, bi) =>
                      renderBlock(block, `${ci}-r-${bi}`),
                    )}
                  </div>
                </section>
              );
            }

            return (
              <div
                key={`c-${ci}`}
                className="space-y-3 rounded-xl border border-border/45 bg-card/30 p-4 sm:p-5"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
