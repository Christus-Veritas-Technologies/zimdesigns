"use client";

import { CheckCircle, XCircle, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@zimdesigns/ui/components/button";
import { useAdminAppRequests, useApproveAppRequest, useDenyAppRequest } from "@/hooks/use-admin";
import type { PendingAppRequest } from "@/hooks/use-admin";

const AVATAR_COLORS = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];
function AppAvatar({ name }: { name: string }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      className="w-9 h-9 rounded-xl flex-none flex items-center justify-center font-bold text-white text-sm"
      style={{ background: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function RequestRow({ req }: { req: PendingAppRequest }) {
  const approve = useApproveAppRequest();
  const deny = useDenyAppRequest();
  const router = useRouter();
  const diff = Date.now() - new Date(req.createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  const age = days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;

  function promoteToApp() {
    const slug = req.appName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const params = new URLSearchParams({ name: req.appName, slug });
    if (req.description) params.set("description", req.description);
    router.push(`/admin/apps?${params}`);
  }

  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      <AppAvatar name={req.appName} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-semibold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
            {req.appName}
          </span>
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 uppercase tracking-wide">
            {req.voteCount} want this
          </span>
        </div>
        {req.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-0.5">{req.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          requested by @{req.requester.username} · {age}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-none flex-wrap justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={promoteToApp}
          className="gap-1 rounded-xl text-xs h-7 border-[var(--zd-gold)]/40 text-[var(--zd-gold)] hover:bg-[var(--zd-gold)]/5"
          title="Open app creation form pre-filled from this request"
        >
          <Rocket size={12} /> Promote to app
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={approve.isPending || deny.isPending}
          onClick={() => approve.mutate(req.id)}
          className="gap-1 text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20 rounded-xl text-xs h-7"
        >
          <CheckCircle size={13} /> Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={approve.isPending || deny.isPending}
          onClick={() => deny.mutate(req.id)}
          className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20 rounded-xl text-xs h-7"
        >
          <XCircle size={13} /> Deny
        </Button>
      </div>
    </div>
  );
}

export default function AdminRequestsPage() {
  const { data: requests, isLoading } = useAdminAppRequests();

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-extrabold text-foreground"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
        >
          App requests
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review and approve community app redesign requests.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card px-5">
        {isLoading && (
          <div className="space-y-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && (!requests || requests.length === 0) && (
          <div className="text-center py-16">
            <p className="font-semibold text-foreground mb-1">No pending requests</p>
            <p className="text-sm text-muted-foreground">All app requests have been reviewed.</p>
          </div>
        )}
        {requests && requests.length > 0 && requests.map((req) => (
          <RequestRow key={req.id} req={req} />
        ))}
      </div>
    </div>
  );
}
