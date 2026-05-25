import type { Metadata } from "next";
import { GitHubPageContent } from "@/app/github/github-page-content";

export const metadata: Metadata = {
  title: "GitHub",
};

function GitHubPage() {
  return <GitHubPageContent />;
}

export default GitHubPage;
