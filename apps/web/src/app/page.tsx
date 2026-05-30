"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Plus, Flame, Clock, ChevronDown } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useRedesigns, useUpvoteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useState } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${SERVER_URL}${url}`;
}

function UpvoteButton({ redesign }: { redesign: Redesign }) {
  const upvote = useUpvoteRedesign(redesign.id);
  const isAuthenticated = useIsAuthenticated();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (isAuthenticated) upvote.mutate();
      }}
      disabled={upvote.isPending}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors",
        redesign.hasUpvoted
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <ArrowUp size={15} strokeWidth={2.5} />
      <span className="tabular-nums text-xs">{redesign.upvoteCount}</span>
    </button>
  );
}

function RedesignCard({ redesign }: { redesign: Redesign }) {
  const [hover, setHover] = useState<"before" | "after">("after");

  return (
    <Link
      href={`/redesigns/${redesign.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        onMouseEnter={() => setHover("before")}
        onMouseLeave={() => setHover("after")}
      >
        <Image
          src={absoluteUrl(hover === "after" ? redesign.afterUrl : redesign.beforeUrl)}
          alt={redesign.title}
          fill
          className="object-cover transition-all duration-300"
          unoptimized
        />
        <div className="absolute top-2 left-2">
          <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
            {hover === "after" ? "After" : "Before"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">{redesign.appName}</span>
          <div className="flex gap-1">
            {redesign.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3">
        <UpvoteButton redesign={redesign} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug truncate">{redesign.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            by <span className="font-medium text-foreground">@{redesign.author.username}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

type Sort = "recent" | "top";

export default function FeedPage() {
  const [sort, setSort] = useState<Sort>("recent");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useRedesigns({ sort });

  const redesigns = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSort("recent")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                sort === "recent" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Clock size={14} />
              Recent
            </button>
            <button
              onClick={() => setSort("top")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                sort === "top" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Flame size={14} />
              Top
            </button>
          </div>

          <Link href="/upload">
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={15} strokeWidth={2.5} />
              Upload Redesign
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-3 flex gap-3">
                  <div className="w-10 h-12 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && redesigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No redesigns yet</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to share a redesign.</p>
            <Link href="/upload">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Upload Redesign
              </Button>
            </Link>
          </div>
        )}

        {redesigns.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {redesigns.map((r) => (
                <RedesignCard key={r.id} redesign={r} />
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="gap-2"
                >
                  <ChevronDown size={15} />
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
