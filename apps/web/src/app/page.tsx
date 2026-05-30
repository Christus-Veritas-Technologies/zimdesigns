"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Plus, Flame, Clock, ChevronDown, Bookmark, Users, LogIn } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useRedesigns, useUpvoteRedesign, useDeleteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useFollowingFeed } from "@/hooks/use-follows";
import { useToggleBookmark } from "@/hooks/use-bookmarks";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

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

function UpvoteButton({ redesign, onAuthRequired }: { redesign: Redesign; onAuthRequired: () => void }) {
  const upvote = useUpvoteRedesign(redesign.id);
  const isAuthenticated = useIsAuthenticated();
  return (
    <button
      onClick={(e) => { e.preventDefault(); isAuthenticated ? upvote.mutate() : onAuthRequired(); }}
      disabled={upvote.isPending}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors",
        redesign.hasUpvoted ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <ArrowUp size={15} strokeWidth={2.5} />
      <span className="tabular-nums text-xs">{redesign.upvoteCount}</span>
    </button>
  );
}

function BookmarkButton({ redesignId, onAuthRequired }: { redesignId: string; onAuthRequired: () => void }) {
  const bookmark = useToggleBookmark(redesignId);
  const isAuthenticated = useIsAuthenticated();
  return (
    <button
      onClick={(e) => { e.preventDefault(); isAuthenticated ? bookmark.mutate() : onAuthRequired(); }}
      disabled={bookmark.isPending}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
    >
      <Bookmark size={14} strokeWidth={2} />
    </button>
  );
}

function RedesignCard({ redesign, onAuthRequired }: { redesign: Redesign; onAuthRequired: () => void }) {
  const [hover, setHover] = useState<"before" | "after">("after");
  return (
    <Link href={`/redesigns/${redesign.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted" onMouseEnter={() => setHover("before")} onMouseLeave={() => setHover("after")}>
        <Image src={absoluteUrl(hover === "after" ? redesign.afterUrl : redesign.beforeUrl)} alt={redesign.title} fill className="object-cover transition-all duration-300" unoptimized />
        <div className="absolute top-2 left-2">
          <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">{hover === "after" ? "After" : "Before"}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">{redesign.appName}</span>
          <div className="flex gap-1">{redesign.tags.slice(0, 2).map((t) => <span key={t} className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-white/20 text-white">{t}</span>)}</div>
        </div>
      </div>
      <div className="flex items-start gap-3 p-3">
        <UpvoteButton redesign={redesign} onAuthRequired={onAuthRequired} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug truncate">{redesign.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">by <span className="font-medium text-foreground">@{redesign.author.username}</span></p>
        </div>
        <BookmarkButton redesignId={redesign.id} onAuthRequired={onAuthRequired} />
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-muted" />
          <div className="p-3 flex gap-3"><div className="w-10 h-12 rounded-xl bg-muted" /><div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div></div>
        </div>
      ))}
    </div>
  );
}

type Tab = "foryou" | "following";
type Sort = "recent" | "top";

export default function FeedPage() {
  const [tab, setTab] = useState<Tab>("foryou");
  const [sort, setSort] = useState<Sort>("recent");
  const [authModal, setAuthModal] = useState<string | null>(null);
  const isAuthenticated = useIsAuthenticated();

  const forYou = useRedesigns({ sort });
  const following = useFollowingFeed();

  const active = tab === "foryou" ? forYou : following;
  const redesigns = active.data?.pages.flatMap((p) => p.items) ?? [];

  const requireAuth = (action: string) => !isAuthenticated && setAuthModal(action);

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action={authModal} onClose={() => setAuthModal(null)} />}

      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <button onClick={() => setTab("foryou")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", tab === "foryou" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Flame size={14} /> For You
            </button>
            <button onClick={() => { isAuthenticated ? setTab("following") : setAuthModal("see your following feed"); }} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", tab === "following" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <Users size={14} /> Following
            </button>
            {tab === "foryou" && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                <button onClick={() => setSort("recent")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", sort === "recent" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  <Clock size={14} /> Recent
                </button>
                <button onClick={() => setSort("top")} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", sort === "top" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  Top
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && <Link href="/bookmarks"><Button variant="outline" size="sm" className="gap-1.5"><Bookmark size={14} />Saved</Button></Link>}
            <Link href="/upload"><Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"><Plus size={15} strokeWidth={2.5} />Upload</Button></Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {active.isLoading && <SkeletonGrid />}

        {!active.isLoading && redesigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              {tab === "following" ? <Users size={24} className="text-muted-foreground" /> : <Plus size={24} className="text-muted-foreground" />}
            </div>
            <p className="font-semibold text-foreground mb-1">{tab === "following" ? "Follow designers to see their work here" : "No redesigns yet"}</p>
            <p className="text-sm text-muted-foreground mb-4">{tab === "following" ? "Discover designers on the For You tab." : "Be the first to share a redesign."}</p>
            {tab === "foryou" && <Link href="/upload"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Upload Redesign</Button></Link>}
            {tab === "following" && <Button onClick={() => setTab("foryou")} variant="outline">Browse For You</Button>}
          </div>
        )}

        {redesigns.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {redesigns.map((r) => <RedesignCard key={r.id} redesign={r} onAuthRequired={requireAuth} />)}
            </div>
            {active.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => active.fetchNextPage()} disabled={active.isFetchingNextPage} className="gap-2">
                  <ChevronDown size={15} />{active.isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
