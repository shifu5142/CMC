"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockTeam } from "@/lib/mock-data";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

export function TeamRoster() {
  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {mockTeam.length} members · 1 owner · 1 admin
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60">
          {mockTeam.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 px-6 py-3"
            >
              <Avatar>
                {m.avatar ? <AvatarImage src={m.avatar} alt={m.name} /> : null}
                <AvatarFallback>{getInitials(m.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{m.name}</span>
                  {m.status === "pending" ? (
                    <Badge variant="warning">Invite pending</Badge>
                  ) : (
                    <Badge variant="secondary">{m.role}</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {m.email} · joined {formatRelativeTime(m.joinedAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast.message(`Manage ${m.name}`, {
                    description: "Role management UI is coming soon.",
                  })
                }
              >
                Manage
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
