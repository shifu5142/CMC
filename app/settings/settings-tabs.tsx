"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/layout/theme-provider";
import { useUserStore } from "@/store/useUserStore";
import { cn, uid } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
}

export function SettingsTabs() {
  const preferences = useUserStore((s) => s.preferences);
  const setPreference = useUserStore((s) => s.setPreference);
  const { theme, setTheme } = useTheme();
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [company, setcompany] = useState<string>("");
  const [role, setrole] = useState<"user" | "admin">("user");
  const [profileSaved, setProfileSaved] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Production",
      prefix: "cpl_live_••••3a8f",
      createdAt: "2025-10-02T14:10:00.000Z",
    },
  ]);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(
        `${backendUrl}/settings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (!data.user) return;
      setname(data.user.name ?? "");
      setemail(data.user.email ?? "");
      setcompany(data.user.company ?? "");
      setrole(data.user.role === "admin" ? "admin" : "user");
    }
    fetchUser();
  }, [backendUrl]);

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
 
  async function saveProfile() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            email,
            company,
            role,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setProfileSaved(true);
        window.setTimeout(() => setProfileSaved(false), 1500);
      } else {
        toast.error(data.message ?? "Could not save profile");
        router.push("/not-found");
      }
    } catch {
      toast.error("Could not save profile");
      router.push("/not-found");
    }
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
              Update how CMC displays your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {profileSaved ? (
              <div
                role="alert"
                className={cn(
                  "sm:col-span-2 rounded-lg border border-emerald-500/45 bg-emerald-500/10 px-3 py-2.5 text-sm font-medium text-emerald-100 animate-fade-in",
                )}
              >
                Profile saved
              </div>
            ) : null}

            <Field
              label="Full name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Field
              label="Company"
              value={company}
              onChange={(e) => setcompany(e.target.value)}
            />
            <label className="space-y-1.5 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Role
              </span>
              <Select
                value={role}
                onValueChange={(value) =>
                  setrole(value === "admin" ? "admin" : "user")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={saveProfile}>
                Save changes
              </Button>
            </div>

            <Separator className="sm:col-span-2" />

            <div className="sm:col-span-2 flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">
                  Delete account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently remove your account and all associated data.
                </p>
              </div>
              <Button variant="destructive" asChild>
                <Link href="/settings/delete-account">Delete account</Link>
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
                Programmatic access to CMC — keep these secret.
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
              Turn off dark mode for a brighter interface across the app.
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
  type = "text",
  ...inputProps
}: {
  label: string;
  type?: string;
} & Omit<React.ComponentProps<typeof Input>, "type">) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Input type={type} {...inputProps} />
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
