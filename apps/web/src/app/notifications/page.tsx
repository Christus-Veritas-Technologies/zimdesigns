"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useNotifications, useMarkAllRead } from "@/hooks/use-notifications";
import { cn } from "@zimdesigns/ui/lib/utils";

const TYPE_ICON: Record<string, string> = {
  comment: "💬",
  upvote: "↑",
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAll = useMarkAllRead();

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            <Bell size={22} />
            Notifications
            {unread > 0 && (
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {unread}
              </span>
            )}
          </h1>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <CheckCheck size={14} />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && notifications?.length === 0 && (
          <div className="text-center py-16">
            <Bell size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">All caught up</p>
            <p className="text-sm text-muted-foreground">Notifications for upvotes and comments will appear here.</p>
          </div>
        )}

        <div className="space-y-2">
          {notifications?.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border transition-colors",
                n.read ? "border-border bg-card" : "border-primary/20 bg-primary/5",
              )}
            >
              <span className="text-lg flex-none mt-0.5">{TYPE_ICON[n.type] ?? "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {n.refId && (
                <Link
                  href={`/redesigns/${n.refId}`}
                  className="text-xs text-primary font-medium hover:underline flex-none self-center"
                >
                  View →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
