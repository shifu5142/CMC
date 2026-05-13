import { NextResponse } from "next/server";
import { mockCommits, mockPRs, mockRepos } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";
import type {
  ApiResponse,
  GitHubCommit,
  GitHubPR,
  GitHubRepo,
} from "@/types";

export const runtime = "nodejs";

interface GithubResponse {
  repos: GitHubRepo[];
  pulls: GitHubPR[];
  commits: GitHubCommit[];
}

/**
 * GET /api/github — Mock listing of repos, PRs, and recent commits.
 *
 * In production this will fan-out to the GitHub App installation token
 * and stream the result. Today it returns fixtures.
 */
export async function GET() {
  await sleep(200);
  const body: ApiResponse<GithubResponse> = {
    ok: true,
    data: {
      repos: mockRepos,
      pulls: mockPRs,
      commits: mockCommits,
    },
  };
  return NextResponse.json(body);
}
