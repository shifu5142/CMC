"use client";

import { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";
import { uid } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
}

export function SettingsTabs() {
  const user = useUserStore((s) => s.user);
  const preferences = useUserStore((s) => s.preferences);
  const setPreference = useUserStore((s) => s.setPreference);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Production",
      prefix: "cpl_live_••••3a8f",
      createdAt: "2025-10-02T14:10:00.000Z",
    },
  ]);

  function createKey() {
    const newKey: ApiKey = {
      id: uid("key"),
      name: `Key ${keys.length + 1}`,
      prefix: `cpl_live_••••${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setKeys((k) => [newKey, ...k]);
    toast.success("API key created", {
      description: "Make sure to copy it now — we won't show it again.",
    });
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="api">API keys</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card glass>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update how CodePilot displays your account.
            </CardDescription>
          </CardHeader>
          <CardContent
            key={user?.id ?? "profile"}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Field label="Full name" defaultValue={user?.name ?? ""} />
            <Field label="Email" defaultValue={user?.email ?? ""} type="email" />
            <Field label="Company" defaultValue="" />
            <Field label="Role" defaultValue="" />
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={() => toast.success("Profile saved")}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card glass>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>API keys</CardTitle>
              <CardDescription>
                Programmatic access to CodePilot — keep these secret.
              </CardDescription>
            </div>
            <Button size="sm" onClick={createKey}>
              <Plus className="size-3.5" />
              New key
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{k.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {k.prefix}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary">Active</Badge>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(k.prefix);
                      toast.success("Copied (masked) key");
                    }}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setKeys((ks) => ks.filter((x) => x.id !== k.id));
                      toast.success("Key revoked");
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card glass>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what we email you about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <PrefRow
              label="Review notifications"
              hint="Get notified when a review finishes."
              checked={preferences.notifications}
              onCheckedChange={(v) => setPreference("notifications", v)}
            />
            <Separator />
            <PrefRow
              label="Product updates"
              hint="Major releases & new features."
              checked={preferences.productUpdates}
              onCheckedChange={(v) => setPreference("productUpdates", v)}
            />
            <Separator />
            <PrefRow
              label="Weekly digest"
              hint="A Monday summary of issues caught."
              checked={preferences.weeklyDigest}
              onCheckedChange={(v) => setPreference("weeklyDigest", v)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance">
        <Card glass>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Theme is dark by default. Light mode is coming soon — toggle saves
              your preference locally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">
                  Easy on the eyes during deep work.
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Input defaultValue={defaultValue} type={type} />
    </label>
  );
}

function PrefRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
