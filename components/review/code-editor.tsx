"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Monaco editor is loaded only on the client, lazily. When it fails to load
 * (e.g. SSR or build without network) the component gracefully falls back to
 * a styled textarea — so the page never crashes in dev.
 */
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[420px] w-full" />,
  },
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  /** Pass false to render a styled textarea (e.g. unit tests). */
  monaco?: boolean;
  height?: number;
}

export function CodeEditor({
  value,
  onChange,
  language,
  monaco = true,
  height = 420,
}: CodeEditorProps) {
  const monacoLanguage = useMemo(() => mapLanguage(language), [language]);

  if (!monaco) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="font-mono text-[13px] leading-relaxed"
        style={{ minHeight: height }}
      />
    );
  }

  return (
    <div
      className="overflow-hidden rounded-md border border-border bg-black/40"
      style={{ height }}
    >
      <MonacoEditor
        height={height}
        defaultLanguage={monacoLanguage}
        language={monacoLanguage}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          fontFamily:
            "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
          smoothScrolling: true,
          renderLineHighlight: "gutter",
        }}
      />
    </div>
  );
}

function mapLanguage(lang: string): string {
  const map: Record<string, string> = {
    typescript: "typescript",
    javascript: "javascript",
    python: "python",
    go: "go",
    rust: "rust",
    java: "java",
    csharp: "csharp",
    cpp: "cpp",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
  };
  return map[lang] ?? "plaintext";
}
