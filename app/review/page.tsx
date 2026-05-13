import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReviewWorkspace } from "@/app/review/review-workspace";
import { AIChat } from "@/components/review/ai-chat";

export const metadata: Metadata = {
  title: "AI Code Review",
  description:
    "Paste or upload code and have CodePilot review it for security, performance, bugs, and refactors.",
};

export default function ReviewPage() {
  return (
    <DashboardShell
      title="AI Code Review"
      description="Paste, upload, or pull from GitHub. Results land in the right pane."
    >
      <ReviewWorkspace />
      <AIChat />
    </DashboardShell>
  );
}
