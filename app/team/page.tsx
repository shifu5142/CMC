import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeamRoster } from "@/app/team/team-roster";
import { InviteMemberDialog } from "@/app/team/invite-member-dialog";

export const metadata: Metadata = {
  title: "Team",
};

function TeamPage() {
  return (
    <DashboardShell
      title="Team"
      description="Invite teammates and manage roles."
      actions={<InviteMemberDialog trigger={<InviteButton />} />}
    >
      <TeamRoster />
    </DashboardShell>
  );
}

export default TeamPage;

function InviteButton() {
  return (
    <span className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
      <UserPlus className="size-4" />
      Invite member
    </span>
  );
}
