"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Plus, Flame, Clock, ChevronDown, Bookmark, BookmarkCheck, Users, LogIn, TrendingUp, ListChecks, ArrowUpToLine, MessageCircle } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useRedesigns, useUpvoteRedesign, useDeleteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useFollowingFeed } from "@/hooks/use-follows";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useTrending } from "@/hooks/use-bookmarks";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SERVER_URL_SIDEBAR = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrlSidebar(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL_SIDEBAR}${url}`;
}

function Sidebar() {
  const { data } = useTrending();
  return (
    <aside className="hidden xl:block w-64 flex-none">
      <div className="sticky top-20 space-y-4">
        {/* Trending redesigns */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <Link href="/trending" className="flex items-center gap-2 font-semibold text-sm text-foreground hover:text-primary transition-colors mb-3">
            <TrendingUp size={14} className="text-primary" /> Trending this week
          </Link>
          {data?.topRedesigns?.slice(0, 5).map((r, i) => (
            <Link key={r.id} href={`/redesigns/${r.id}`} className="flex items-center gap-2 py-1.5 hover:opacity-80 transition-opacity">
              <span className="text-xs font-bold text-primary/60 w-4 flex-none">{i + 1}</span>
              <div className="relative w-8 h-6 rounded overflow-hidden bg-muted flex-none">
                <Image src={absoluteUrlSidebar(r.afterUrl)} alt={r.title} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                <p className="text-[0.65rem] text-muted-foreground">{r.appName}</p>
              </div>
            </Link>
          ))}
          {!data && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-7 bg-muted rounded animate-pulse" />)}</div>}
        </div>

        {/* Top designers */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <Link href="/trending" className="flex items-center gap-2 font-semibold text-sm text-foreground hover:text-primary transition-colors mb-3">
            <Users size={14} className="text-primary" /> Top Designers
          </Link>
          {data?.topDesigners?.slice(0, 5).map((d) => (
            <Link key={d.id} href={`/users/${d.username}`} className="flex items-center gap-2 py-1.5 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
                {d.avatarUrl ? (
                  <Image src={absoluteUrlSidebar(d.avatarUrl)} alt={d.name} width={28} height={28} className="object-cover" unoptimized />
                ) : (
                  <span className="text-xs font-extrabold text-primary">{d.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{d.name}</p>
                <p className="text-[0.65rem] text-muted-foreground">{d.redesignCount} redesign{d.redesignCount !== 1 ? "s" : ""}</p>
              </div>
            </Link>
          ))}
          {!data && <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-7 bg-muted rounded animate-pulse" />)}</div>}
        </div>

        {/* App requests CTA */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
            <ListChecks size={14} className="text-primary" /> App Requests
          </div>
          <p className="text-xs text-muted-foreground mb-3">Vote for the apps you want redesigned next.</p>
          <Link href="/app-requests" className="block w-full text-center py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
            Browse requests
          </Link>
        </div>
      </div>
    </aside>
  );
}

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
        "flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold transition-colors",
        redesign.hasUpvoted ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <ArrowUp size={12} strokeWidth={2.5} />
      <span className="tabular-nums">{redesign.upvoteCount}</span>
    </button>
  );
}

function BookmarkButton({ redesignId, onAuthRequired }: { redesignId: string; onAuthRequired: () => void }) {
  const bookmark = useToggleBookmark(redesignId);
  const isAuthenticated = useIsAuthenticated();
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === redesignId) ?? false;
  return (
    <button
      onClick={(e) => { e.preventDefault(); isAuthenticated ? bookmark.mutate() : onAuthRequired(); }}
      disabled={bookmark.isPending}
      className={cn(
        "w-8 h-8 rounded-full border flex items-center justify-center transition-colors flex-none",
        isBookmarked ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {isBookmarked ? <BookmarkCheck size={13} strokeWidth={2} /> : <Bookmark size={13} strokeWidth={2} />}
    </button>
  );
}

function RedesignCard({ redesign, onAuthRequired, onTagClick }: { redesign: Redesign; onAuthRequired: () => void; onTagClick?: (tag: string) => void }) {
  const [hover, setHover] = useState<"before" | "after">("after");
  return (
    <Link href={`/redesigns/${redesign.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted" onMouseEnter={() => setHover("before")} onMouseLeave={() => setHover("after")}>
        <Image src={absoluteUrl(hover === "after" ? redesign.afterUrl : redesign.beforeUrl)} alt={redesign.title} fill className="object-cover transition-all duration-300" unoptimized />
        {/* Top-left pills */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] tracking-wide uppercase">Redesign</span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">{redesign.appName}</span>
        </div>
        {/* Before/after label */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">{hover === "after" ? "After" : "Before"}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{redesign.title}</p>
        <div className="flex items-center justify-between gap-2">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
              {redesign.author.avatarUrl ? (
                <Image src={absoluteUrl(redesign.author.avatarUrl)} alt={redesign.author.name} width={24} height={24} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.6rem] font-bold text-primary">{redesign.author.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate leading-none">{redesign.author.name}</p>
              {redesign.author.role && <p className="text-[0.62rem] text-muted-foreground truncate leading-none mt-0.5">{redesign.author.role}</p>}
            </div>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-2 flex-none">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle size={12} strokeWidth={2} />{redesign.commentCount}
            </span>
            <UpvoteButton redesign={redesign} onAuthRequired={onAuthRequired} />
            <BookmarkButton redesignId={redesign.id} onAuthRequired={onAuthRequired} />
          </div>
        </div>
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

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-5 xl:bottom-8 xl:right-8 z-40 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      aria-label="Back to top"
    >
      <ArrowUpToLine size={16} />
    </button>
  );
}

const CATEGORIES = ["All", "Banking", "Mobile", "Web", "Local", "E-commerce"];

type Tab = "foryou" | "following";
type Sort = "recent" | "top";

export default function FeedPage() {
  const [tab, setTab] = useState<Tab>("foryou");
  const [sort, setSort] = useState<Sort>("recent");
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string>("All");
  const [authModal, setAuthModal] = useState<string | null>(null);
  const isAuthenticated = useIsAuthenticated();

  const forYou = useRedesigns({ sort, tag });
  const following = useFollowingFeed();

  const active = tab === "foryou" ? forYou : following;
  const redesigns = active.data?.pages.flatMap((p) => p.items) ?? [];

  const requireAuth = (action: string) => !isAuthenticated && setAuthModal(action);
  const handleTagClick = (t: string) => { setTag(tag === t ? undefined : t); setTab("foryou"); };

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action={authModal} onClose={() => setAuthModal(null)} />}

      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
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

      {tag && (
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtering by tag:</span>
            <button
              onClick={() => setTag(undefined)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              {tag} ×
            </button>
          </div>
        </div>
      )}
      <BackToTop />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-8">
        <div className="flex-1 min-w-0">
          {/* Section heading */}
          <div className="mb-5">
            <h2 className="text-[1.35rem] font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Latest redesigns
            </h2>
            <p className="text-[0.88rem] text-muted-foreground mt-0.5">Zimbabwe's apps, improved by the community.</p>
          </div>
          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[0.82rem] font-semibold border transition-colors",
                  category === c
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>

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
                {redesigns.map((r) => <RedesignCard key={r.id} redesign={r} onAuthRequired={requireAuth} onTagClick={handleTagClick} />)}
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
        <Sidebar />
      </div>
    </div>
  );
}
