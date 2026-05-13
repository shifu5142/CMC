"use client";

import { useState } from "react";
import { Play, Sparkles, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/review/code-editor";
import { LanguageSelect } from "@/components/review/language-select";
import { UploadArea } from "@/components/review/upload-area";
import { ResultsPanel } from "@/components/review/results-panel";
import { useReviewStore } from "@/store/useReviewStore";
import { useUIStore } from "@/store/useUIStore";
import { reviewService } from "@/services/reviewService";

export function ReviewWorkspace() {
  const code = useReviewStore((s) => s.code);
  const setCode = useReviewStore((s) => s.setCode);
  const language = useReviewStore((s) => s.language);
  const setLanguage = useReviewStore((s) => s.setLanguage);
  const filename = useReviewStore((s) => s.filename);
  const setFilename = useReviewStore((s) => s.setFilename);
  const status = useReviewStore((s) => s.status);
  const setStatus = useReviewStore((s) => s.setStatus);
  const current = useReviewStore((s) => s.current);
  const setCurrent = useReviewStore((s) => s.setCurrent);
  const pushHistory = useReviewStore((s) => s.pushHistory);

  const setChatOpen = useUIStore((s) => s.setChatOpen);

  const [rateLimitHits, setRateLimitHits] = useState(0);
  const tooLong = code.length > 18_000;

  async function runReview() {
    if (!code.trim()) {
      toast.error("Paste some code first.");
      return;
    }
    if (tooLong) {
      toast.error("Code is too long. Trim to under 20,000 chars.");
      return;
    }
    setStatus("loading");
    setCurrent(null);
    try {
      const result = await reviewService.run({ code, language, filename });
      setCurrent(result);
      pushHistory(result);
      setStatus("success");
      toast.success("Review complete");
    } catch (err) {
      setStatus("error", err instanceof Error ? err.message : "Failed");
      setRateLimitHits((n) => n + 1);
      toast.error("Could not run review");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card glass className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" />
            Source code
          </CardTitle>
          <div className="flex items-center gap-2">
            <LanguageSelect value={language} onChange={setLanguage} />
            <Button onClick={runReview} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <span className="size-3 animate-pulse rounded-full bg-primary-foreground" />
                  Reviewing…
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Run Review
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2">
              <label
                htmlFor="filename"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                File
              </label>
              <Input
                id="filename"
                value={filename ?? ""}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="users.ts"
                className="h-8 max-w-xs"
              />
            </div>
            <Badge
              variant={tooLong ? "destructive" : "outline"}
              className="font-mono text-[10px]"
            >
              {code.length.toLocaleString()} chars
            </Badge>
            {rateLimitHits >= 3 ? (
              <Badge variant="warning" className="gap-1.5">
                <ShieldAlert className="size-3" />
                Rate limit nearing
              </Badge>
            ) : null}
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            height={420}
          />

          <UploadArea
            onLoad={(text, name) => {
              setCode(text);
              setFilename(name);
            }}
          />

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="text-muted-foreground"
            >
              <Sparkles className="size-3.5" />
              Ask the AI about this code
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResultsPanel result={current} loading={status === "loading"} />
    </div>
  );
}
