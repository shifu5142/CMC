"use client";

import {
  Sparkles,
  GitPullRequestArrow,
  UserPlus,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { ActivityEvent } from "@/types";

const ICON_BY_TYPE: Record<ActivityEvent["type"], LucideIcon> = {
  "review.completed": Sparkles,
  "review.started": Sparkles,
  "pr.opened": GitPullRequestArrow,
  "pr.merged": GitPullRequestArrow,
  "member.joined": UserPlus,
  "subscription.updated": CreditCard,
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card glass className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Activity</CardTitle>
        <CardDescription>What&apos;s happening across your team</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {events.map((event) => {
            const Icon = ICON_BY_TYPE[event.type];
            return (
              <li key={event.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {event.actor.avatar ? (
                    <AvatarImage src={event.actor.avatar} alt={event.actor.name} />
                  ) : null}
                  <AvatarFallback>
                    <Icon className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm leading-tight">
                    <span className="font-medium">{event.actor.name}</span>
                    <span className="ml-1.5 text-muted-foreground">
                      — {event.message.replace(`${event.actor.name} `, "")}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatRelativeTime(event.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

export { getInitials };
