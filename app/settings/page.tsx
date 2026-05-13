import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsTabs } from "@/app/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <DashboardShell
      title="Settings"
      description="Manage your account, API keys, notifications, and appearance."
    >
      <SettingsTabs />
    </DashboardShell>
  );
}
