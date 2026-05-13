import type { Metadata } from "next";
import Image from "next/image";
import {
  GitBranch,
  GitCommitHorizontal,
  GitPullRequestArrow,
  Lock,
  Star,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockCommits, mockPRs, mockRepos } from "@/lib/mock-data";
import { formatNumber, formatRelativeTime, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GitHub",
};

const STATUS_BADGE = {
  open: "info" as const,
  merged: "success" as const,
  closed: "destructive" as const,
  draft: "secondary" as const,
};

function GitHubPage() {
  return (
    <DashboardShell
      title="GitHub"
      description="Repositories, PRs, and commits at a glance."
      actions={
        <Button variant="outline">
          <GitBranch className="size-4" />
          Install GitHub App
        </Button>
      }
    >
      <Tabs defaultValue="repos">
        <TabsList>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
        </TabsList>

        <TabsContent value="repos" className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {mockRepos.map((repo) => (
            <Card key={repo.id} glass className="glass-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-mono">
                  <GitBranch className="size-3.5 text-muted-foreground" />
                  {repo.fullName}
                  {repo.private ? (
                    <Lock className="size-3 text-muted-foreground" />
                  ) : null}
                </CardTitle>
                <CardDescription>{repo.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        repo.language === "TypeScript"
                          ? "bg-sky-400"
                          : repo.language === "Rust"
                            ? "bg-orange-400"
                            : "bg-violet-400",
                      )}
                    />
                    {repo.language}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3" />
                    {formatNumber(repo.stars)}
                  </span>
                </div>
                <span>{formatRelativeTime(repo.updatedAt)}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          <Card glass>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {mockPRs.map((pr) => (
                  <li key={pr.id} className="flex items-center gap-3 px-5 py-3">
                    <Image
                      src={pr.authorAvatar}
                      alt={pr.author}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          #{pr.number} {pr.title}
                        </span>
                        <Badge variant={STATUS_BADGE[pr.status]}>
                          {pr.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        by {pr.author} · {pr.filesChanged} files ·
                        <span className="text-emerald-400"> +{pr.additions}</span>{" "}
                        / <span className="text-red-400">-{pr.deletions}</span>
                      </p>
                    </div>
                    {pr.reviewScore ? (
                      <div className="hidden text-right sm:block">
                        <div className="text-sm font-semibold">
                          {pr.reviewScore}
                        </div>
                        <div className="text-[10px] uppercase text-muted-foreground">
                          score
                        </div>
                      </div>
                    ) : null}
                    <GitPullRequestArrow className="size-4 text-muted-foreground" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commits" className="mt-4">
          <Card glass>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {mockCommits.map((c) => (
                  <li
                    key={c.sha}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <GitCommitHorizontal className="size-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {c.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">{c.sha}</span> · {c.author} ·{" "}
                        {c.filesChanged} files
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(c.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

export default GitHubPage;
