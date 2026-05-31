"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Plus, LogIn } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useAppRequests, useCreateAppRequest, useVoteAppRequest } from "@/hooks/use-bookmarks";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";

function AuthGateModal({ action, onClose }: { action: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <LogIn size={20} className="text-primary" />
        </div>
        <h2 className="font-extrabold text-lg text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>Sign in to {action}</h2>
        <p className="text-sm text-muted-foreground mb-5">Join ZimDesigns to engage with the community.</p>
        <div className="flex gap-2">
          <Link href="/auth/login" className="flex-1"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign in</Button></Link>
          <Button variant="outline" onClick={onClose} className="flex-1">Maybe later</Button>
        </div>
      </div>
    </div>
  );
}

export default function AppRequestsPage() {
  const isAuthenticated = useIsAuthenticated();
  const [authModal, setAuthModal] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");

  const { data: requests, isLoading } = useAppRequests();
  const createRequest = useCreateAppRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;
    createRequest.mutate(
      { appName: appName.trim(), description: description.trim() || undefined },
      { onSuccess: () => { setShowForm(false); setAppName(""); setDescription(""); } },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action={authModal} onClose={() => setAuthModal(null)} />}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={15} /> Back
            </Link>
            <h1 className="font-extrabold text-xl text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              App Requests
            </h1>
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => isAuthenticated ? setShowForm(true) : setAuthModal("request an app")}
          >
            <Plus size={15} strokeWidth={2.5} /> Request App
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-5 rounded-2xl border border-border bg-card space-y-3">
            <h2 className="font-semibold text-foreground">Request a redesign</h2>
            <div>
              <label className="text-xs font-medium text-muted-foreground">App name *</label>
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. EcoCash, NetOne"
                required
                className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Why does it need a redesign? (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what's wrong or what could be improved..."
                className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={createRequest.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {createRequest.isPending ? "Submitting…" : "Submit request"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <p className="text-sm text-muted-foreground mb-5">
          Vote for the apps you want designers to redesign next.
        </p>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && requests?.length === 0 && (
          <div className="text-center py-16">
            <p className="font-semibold text-foreground mb-1">No requests yet</p>
            <p className="text-sm text-muted-foreground">Be the first to request an app redesign.</p>
          </div>
        )}

        {requests && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((req) => (
              <AppRequestRow
                key={req.id}
                req={req}
                onAuthRequired={() => setAuthModal("vote on requests")}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppRequestRow({
  req,
  onAuthRequired,
  isAuthenticated,
}: {
  req: { id: string; appName: string; description: string | null; voteCount: number; hasVoted: boolean; requester: { username: string }; createdAt: string };
  onAuthRequired: () => void;
  isAuthenticated: boolean;
}) {
  const vote = useVoteAppRequest(req.id);
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-card">
      <button
        onClick={() => isAuthenticated ? vote.mutate() : onAuthRequired()}
        disabled={vote.isPending}
        className={cn(
          "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors flex-none",
          req.hasVoted ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary",
        )}
      >
        <ArrowUp size={15} strokeWidth={2.5} />
        <span className="tabular-nums text-xs">{req.voteCount}</span>
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{req.appName}</p>
        {req.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{req.description}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          by @{req.requester.username} · {new Date(req.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
