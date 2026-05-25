"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  GitBranch,
  GitCommitHorizontal,
  GitPullRequestArrow,
  Lock,
  Star,
} from "lucide-react";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { toast } from "sonner";
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
import { EmptyState } from "@/components/ui/empty-state";
import { auth } from "@/app/services/auth/firebaseConfig";
import { mockCommits, mockPRs } from "@/lib/mock-data";
import { formatNumber, formatRelativeTime, cn } from "@/lib/utils";

const STATUS_BADGE = {
  open: "info" as const,
  merged: "success" as const,
  closed: "destructive" as const,
  draft: "secondary" as const,
};

type GithubApiRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  updated_at: string;
};

function languageColor(language: string | null) {
  if (language === "TypeScript") return "bg-sky-400";
  if (language === "Rust") return "bg-orange-400";
  return "bg-violet-400";
}

export function GitHubPageContent() {
  const [repos, setRepos] = useState<GithubApiRepo[]>([]);
  const [importing, setImporting] = useState(false);
  useEffect(() => {
    const repos = sessionStorage.getItem("repos");
    if (repos) {
      setRepos(JSON.parse(repos));
    }
  }, []);
  async function handleImportRepositories() {
    setImporting(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("repo");

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const githubAccessToken = credential?.accessToken;

      if (!githubAccessToken) {
        toast.error("Could not get GitHub access token.");
        return;
      }

      const response = await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated",
        {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!response.ok) {
        toast.error("Failed to load repositories from GitHub.");
        return;
      }

      const data = (await response.json()) as GithubApiRepo[];
      setRepos(Array.isArray(data) ? data : []);
      sessionStorage.setItem("repos", JSON.stringify(data));
      toast.success(
        `Imported ${Array.isArray(data) ? data.length : 0} repositories`,
      );
    } catch (error) {
      console.error(error);
      toast.error("GitHub import cancelled or failed.");
    } finally {
      setImporting(false);
    }
  }

  const importButton = (
    <Button
      variant="outline"
      onClick={handleImportRepositories}
      disabled={importing}
    >
      <GitBranch className="size-4" />
      {importing ? "Importing…" : "Import repositories"}
    </Button>
  );

  return (
    <DashboardShell
      title="GitHub"
      description="Repositories, PRs, and commits at a glance."
      actions={importButton}
    >
      <Tabs defaultValue="repos">
        <TabsList>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
        </TabsList>

        <TabsContent value="repos" className="mt-4">
          {repos.length === 0 ? (
            <EmptyState
              icon={<GitBranch className="size-5" />}
              title="No repositories yet"
              description="Connect GitHub and import your repositories to review them here."
              action={
                <Button
                  variant="outline"
                  onClick={handleImportRepositories}
                  disabled={importing}
                >
                  <GitBranch className="size-4" />
                  {importing ? "Importing…" : "Import repositories"}
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <Card key={repo.id} glass className="glass-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono">
                      <GitBranch className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{repo.full_name}</span>
                      {repo.private ? (
                        <Lock className="size-3 shrink-0 text-muted-foreground" />
                      ) : null}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {repo.description ?? "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {repo.language ? (
                        <span className="inline-flex items-center gap-1">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              languageColor(repo.language),
                            )}
                          />
                          {repo.language}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3" />
                        {formatNumber(repo.stargazers_count)}
                      </span>
                    </div>
                    <span>{formatRelativeTime(repo.updated_at)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
