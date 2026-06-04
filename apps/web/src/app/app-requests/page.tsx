"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUp, Flag, Globe, TrendingUp, Clock, LogIn } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useAppRequests, useCreateAppRequest, useVoteAppRequest } from "@/hooks/use-bookmarks";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function abs(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const CATEGORIES = ["Banking", "Telecoms", "Transit", "Government", "E-commerce", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  open: { label: "Under Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  live: { label: "Now Live", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  denied: { label: "Denied", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

function AuthGateModal({ action, onClose }: { action: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <LogIn size={20} className="text-primary" />
        </div>
        <h2 className="font-extrabold text-lg text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
          Sign in to {action}
        </h2>
        <p className="text-sm text-muted-foreground mb-5">Join ZimDesigns to engage with the community.</p>
        <div className="flex gap-2">
          <Link href="/auth/login" className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign in</Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="flex-1">Maybe later</Button>
        </div>
      </div>
    </div>
  );
}

function AppAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const colors = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (avatarUrl) {
    return (
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-none">
        <Image src={abs(avatarUrl)} alt={name} width={40} height={40} className="object-cover" unoptimized />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl flex-none flex items-center justify-center font-bold text-white text-sm" style={{ background: color }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function RequestRow({
  req,
  onAuthRequired,
  isAuthenticated,
}: {
  req: {
    id: string; appName: string; description: string | null; voteCount: number; hasVoted: boolean;
    status: string; requester: { username: string; avatarUrl?: string | null }; createdAt: string;
  };
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}) {
  const vote = useVoteAppRequest(req.id);
  const status = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.open;
  const age = (() => {
    const diff = Date.now() - new Date(req.createdAt).getTime();
    const days = Math.floor(diff / 86400000);
    return days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;
  })();

  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      {/* Vote pill */}
      <button
        onClick={() => isAuthenticated ? vote.mutate() : onAuthRequired()}
        disabled={vote.isPending}
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl border text-xs font-bold transition-colors flex-none min-w-[42px]",
          req.hasVoted
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary",
        )}
      >
        <ArrowUp size={13} strokeWidth={2.5} />
        <span className="tabular-nums">{req.voteCount}</span>
      </button>

      {/* Avatar */}
      <AppAvatar name={req.appName} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-semibold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
            {req.appName}
          </span>
          <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${status.className}`}>
            {status.label}
          </span>
        </div>
        {req.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{req.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          by @{req.requester.username} · {age}
        </p>
      </div>
    </div>
  );
}

export default function AppRequestsPage() {
  const isAuthenticated = useIsAuthenticated();
  const [authModal, setAuthModal] = useState<string | null>(null);
  const [sort, setSort] = useState<"votes" | "recent">("votes");

  // Form state
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [appUrl, setAppUrl] = useState("");

  const { data: rawRequests, isLoading } = useAppRequests();
  const requests = rawRequests
    ? [...rawRequests].sort((a, b) =>
        sort === "votes"
          ? b.voteCount - a.voteCount
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : undefined;
  const createRequest = useCreateAppRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { setAuthModal("submit a request"); return; }
    if (!appName.trim()) return;
    createRequest.mutate(
      { appName: appName.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setAppName(""); setCategory(""); setDescription(""); setAppUrl("");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action={authModal} onClose={() => setAuthModal(null)} />}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            What app needs fixing?
          </h1>
          <p className="text-muted-foreground">Vote for the apps you want Zimbabwean designers to redesign next.</p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left: requests list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
                Community requests{" "}
                <span className="text-muted-foreground font-normal">· {requests?.length ?? 0}</span>
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSort("votes")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === "votes" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <TrendingUp size={11} /> Top
                </button>
                <button
                  onClick={() => setSort("recent")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === "recent" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Clock size={11} /> Recent
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card px-4">
              {isLoading && (
                <div className="space-y-4 py-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              )}

              {!isLoading && (!requests || requests.length === 0) && (
                <div className="text-center py-16">
                  <p className="font-semibold text-foreground mb-1">No requests yet</p>
                  <p className="text-sm text-muted-foreground">Be the first to request an app.</p>
                </div>
              )}

              {requests && requests.length > 0 && requests.map((req) => (
                <RequestRow
                  key={req.id}
                  req={req}
                  onAuthRequired={() => setAuthModal("vote on requests")}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          </div>

          {/* Right: sticky suggest form */}
          <div className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
                Suggest an app
              </h3>
              <p className="text-xs text-muted-foreground mb-5">Know an app that needs a redesign? Tell the community.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* App name */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">App name *</label>
                  <input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g. EcoCash, NetOne, ZESA"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Category chips */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(category === cat ? "" : cat)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                          category === cat
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">Why does it need fixing?</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe what's broken or what could be improved..."
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* App URL */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">App link (optional)</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={appUrl}
                      onChange={(e) => setAppUrl(e.target.value)}
                      placeholder="https://play.google.com/..."
                      type="url"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={createRequest.isPending || !appName.trim()}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                >
                  <Flag size={14} />
                  {createRequest.isPending ? "Submitting…" : "Submit request"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
