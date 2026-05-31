"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCheck, UserPlus } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useNotifications, useMarkAllRead } from "@/hooks/use-notifications";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRouter } from "next/navigation";

const TYPE_META: Record<string, { icon: string; label: string }> = {
  comment: { icon: "💬", label: "commented on" },
  upvote: { icon: "↑", label: "upvoted" },
  follow: { icon: "👤", label: "started following you" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { data: notifications, isLoading } = useNotifications();
  const markAll = useMarkAllRead();

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bell size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-2">Sign in to see notifications</p>
          <Link href="/auth/login" className="text-primary text-sm font-medium hover:underline">Sign in →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="font-extrabold text-xl text-foreground flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Notifications
              {unread > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">{unread}</span>
              )}
            </h1>
          </div>
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
              <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && notifications?.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">All caught up</p>
            <p className="text-sm text-muted-foreground">Notifications for upvotes, comments, and follows appear here.</p>
          </div>
        )}

        <div className="space-y-2">
          {notifications?.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border transition-colors",
                  n.read ? "border-border bg-card" : "border-primary/20 bg-primary/5",
                )}
              >
                <span className="text-lg flex-none mt-0.5 w-7 text-center">{meta?.icon ?? "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-none mt-1.5" />}
                {n.refId && n.type !== "follow" && (
                  <Link
                    href={`/redesigns/${n.refId}`}
                    className="text-xs text-primary font-medium hover:underline flex-none self-center"
                  >
                    View →
                  </Link>
                )}
                {n.refId && n.type === "follow" && (
                  <Link
                    href={`/users/${n.refId}`}
                    className="text-xs text-primary font-medium hover:underline flex-none self-center flex items-center gap-1"
                  >
                    <UserPlus size={11} /> Profile
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
