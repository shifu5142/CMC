import { api } from "@/lib/api";
import type { ApiResponse, GitHubRepo } from "@/types";

export const githubService = {
  async listRepos(): Promise<GitHubRepo[]> {
    const res = await api.get<ApiResponse<GitHubRepo[]>>("/api/github");
    if (!res.ok) throw new Error(res.error);
    return res.data;
  },
};
