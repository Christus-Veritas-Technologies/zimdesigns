"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUp, MessageCircle, Bookmark, BookmarkCheck, ChevronDown, ArrowUpDown } from "lucide-react";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useAppEntry } from "@/hooks/use-app-entries";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useUpvoteRedesign } from "@/hooks/use-redesigns";
import type { Redesign } from "@/hooks/use-redesigns";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = { designer: "Designer", developer: "Developer", both: "Both" };

function RedesignCard({ redesign, onAuthRequired }: { redesign: Redesign; onAuthRequired: () => void }) {
  const [hover, setHover] = useState<"before" | "after">("after");
  const upvote = useUpvoteRedesign(redesign.id);
  const bookmark = useToggleBookmark(redesign.id);
  const isAuthenticated = useIsAuthenticated();
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === redesign.id) ?? false;

  return (
    <Link href={`/redesigns/${redesign.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        onMouseEnter={() => setHover("before")}
        onMouseLeave={() => setHover("after")}
      >
        <Image src={absoluteUrl(hover === "after" ? redesign.afterUrl : redesign.beforeUrl)} alt={redesign.title} fill className="object-cover transition-all duration-300" unoptimized />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] tracking-wide uppercase">Redesign</span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">{redesign.appName}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{redesign.title}</p>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/users/${redesign.author.username}`} className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
              {redesign.author.avatarUrl ? (
                <Image src={absoluteUrl(redesign.author.avatarUrl)} alt={redesign.author.name} width={24} height={24} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.6rem] font-bold text-primary">{redesign.author.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate leading-none">{redesign.author.name}</p>
              {redesign.author.role && <p className="text-[0.62rem] text-muted-foreground mt-0.5">{ROLE_LABEL[redesign.author.role] ?? redesign.author.role}</p>}
            </div>
          </Link>
          <div className="flex items-center gap-2 flex-none">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle size={12} strokeWidth={2} />{redesign.commentCount}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); isAuthenticated ? upvote.mutate() : onAuthRequired(); }}
              disabled={upvote.isPending}
              className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold transition-colors",
                redesign.hasUpvoted ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")}
            >
              <ArrowUp size={11} strokeWidth={2.5} />{redesign.upvoteCount}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); isAuthenticated ? bookmark.mutate() : onAuthRequired(); }}
              disabled={bookmark.isPending}
              className={cn("w-7 h-7 rounded-full border flex items-center justify-center transition-colors",
                isBookmarked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}
            >
              {isBookmarked ? <BookmarkCheck size={12} strokeWidth={2} /> : <Bookmark size={12} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AppEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [sort, setSort] = useState<"top" | "recent">("top");
  const { data: entry, isLoading, isError } = useAppEntry(slug);
  const isAuthenticated = useIsAuthenticated();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-5 bg-muted rounded w-24 mb-6" />
        <div className="flex gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex-none" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-6 bg-muted rounded w-40" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">App not found.</p>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">← Back to feed</Link>
      </div>
    );
  }

  const sortedRedesigns = [...entry.redesigns].sort((a, b) =>
    sort === "top" ? b.upvoteCount - a.upvoteCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} />
          Back to feed
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* App header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-none shadow-sm"
            style={{ backgroundColor: entry.iconColor }}
          >
            {entry.iconLetter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                {entry.name}
              </h1>
              {entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {entry.tags.map((t) => (
                    <span key={t} className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">{t}</span>
                  ))}
                </div>
              )}
            </div>
            {entry.description && (
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            )}
            <div className="flex items-center gap-5 mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{entry.stats.redesignCount}</span>
                <span className="text-xs text-muted-foreground">redesigns</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{entry.stats.totalVotes >= 1000 ? `${(entry.stats.totalVotes / 1000).toFixed(1)}k` : entry.stats.totalVotes}</span>
                <span className="text-xs text-muted-foreground">votes</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">{entry.stats.designerCount}</span>
                <span className="text-xs text-muted-foreground">designers</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-none">
            <Link
              href="/upload"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] text-sm font-semibold hover:bg-[var(--zd-gold-hover)] transition-colors"
            >
              + Submit a redesign
            </Link>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              🚩 Suggest a fix
            </button>
          </div>
        </div>

        {/* What's broken */}
        {entry.brokenItems.length > 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex gap-5 p-6">
              {/* Current app screenshot */}
              {entry.screenshotUrl && (
                <div className="w-[110px] flex-none">
                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-muted border border-border">
                    <Image src={absoluteUrl(entry.screenshotUrl)} alt={`${entry.name} current`} fill className="object-cover" unoptimized />
                  </div>
                  <p className="text-[0.62rem] text-muted-foreground text-center mt-1.5 uppercase tracking-wider font-medium">Current app</p>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                    What&apos;s broken
                  </h2>
                  <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-widest">
                    Curated by ZimDesigns
                  </span>
                </div>
                <ol className="space-y-2.5">
                  {entry.brokenItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] text-xs font-bold flex items-center justify-center flex-none mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Redesigns section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Redesigns · <span className="text-muted-foreground font-normal">{entry.stats.redesignCount}</span>
          </h2>
          <button
            onClick={() => setSort(sort === "top" ? "recent" : "top")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowUpDown size={12} />
            Sort: {sort === "top" ? "Trending" : "Recent"}
          </button>
        </div>

        {sortedRedesigns.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No redesigns yet. Be the first!</p>
            <Link href="/upload" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              Submit a redesign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
            {sortedRedesigns.map((r) => (
              <RedesignCard key={r.id} redesign={r} onAuthRequired={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
