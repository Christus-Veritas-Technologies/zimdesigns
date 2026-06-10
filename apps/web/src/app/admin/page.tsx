"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, CheckCircle, XCircle, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { useAdminStats, useAdminAppRequests, useApproveAppRequest, useDenyAppRequest } from "@/hooks/use-admin";
import type { PendingAppRequest } from "@/hooks/use-admin";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function abs(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const AVATAR_COLORS = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];
function AppAvatar({ name }: { name: string }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="w-9 h-9 rounded-xl flex-none flex items-center justify-center font-bold text-white text-sm" style={{ background: color }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function StatCard({ label, value, subtitle, trend }: { label: string; value: string | number; subtitle?: string; trend?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-foreground mb-1 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
        {value}
      </p>
      {(subtitle || trend !== undefined) && (
        <div className="flex items-center gap-1.5">
          {trend !== undefined ? (
            trend > 0 ? (
              <TrendingUp size={12} className="text-green-500" />
            ) : trend < 0 ? (
              <TrendingDown size={12} className="text-red-500" />
            ) : null
          ) : null}
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      )}
    </div>
  );
}

function RequestRow({ req }: { req: PendingAppRequest }) {
  const approve = useApproveAppRequest();
  const deny = useDenyAppRequest();
  const diff = Date.now() - new Date(req.createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  const age = days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;

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
        {req.description && <p className="text-sm text-muted-foreground line-clamp-1 mb-0.5">{req.description}</p>}
        <p className="text-xs text-muted-foreground">
          by @{req.requester.username} · {age}
        </p>
      </div>

      <div className="flex items-center gap-1.5 flex-none">
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

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: requests, isLoading: reqLoading } = useAdminAppRequests();

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="px-8 py-8 max-w-5xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
            Overview
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock size={12} /> {today}
          </p>
        </div>
        <Link href="/upload">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            <Plus size={15} strokeWidth={2.5} /> Add an app
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))
        ) : stats ? (
          <>
            <StatCard
              label="Requests pending"
              value={stats.pendingRequests}
              subtitle="Needs action"
            />
            <StatCard
              label="Live apps"
              value={stats.liveApps}
              subtitle="+2 this week"
            />
            <StatCard
              label="Redesigns this week"
              value={stats.redesignsThisWeek}
              trend={stats.redesignsGrowth}
              subtitle={`${stats.redesignsGrowth > 0 ? "+" : ""}${stats.redesignsGrowth}% vs last week`}
            />
            <StatCard
              label="New designers"
              value={stats.newDesigners}
              trend={stats.designersGrowth}
              subtitle={`${stats.designersGrowth > 0 ? "+" : ""}${stats.designersGrowth}% vs last week`}
            />
          </>
        ) : null}
      </div>

      {/* Pending app requests */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
              App requests{" "}
              <span className="text-muted-foreground font-normal">· Pending review</span>
              {requests && (
                <span className="ml-2 text-xs font-bold bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  {requests.length}
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card px-5">
          {reqLoading && (
            <div className="space-y-4 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          )}
          {!reqLoading && (!requests || requests.length === 0) && (
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
    </div>
  );
}
