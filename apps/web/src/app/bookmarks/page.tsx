"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUp, Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

export default function BookmarksPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { data: bookmarks, isLoading } = useBookmarks();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark size={24} className="text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">Sign in to see your bookmarks</p>
          <p className="text-sm text-muted-foreground mb-4">Save redesigns to revisit them later.</p>
          <Link href="/auth/login" className="text-primary text-sm font-medium hover:underline">Sign in →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <h1 className="font-extrabold text-xl text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Saved
          </h1>
        </div>

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

        {!isLoading && (!bookmarks || bookmarks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Bookmark size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No saved redesigns yet</p>
            <p className="text-sm text-muted-foreground mb-4">Bookmark redesigns to find them here.</p>
            <Link href="/" className="text-primary text-sm font-medium hover:underline">Browse redesigns →</Link>
          </div>
        )}

        {bookmarks && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((r) => (
              <Link
                key={r.id}
                href={`/redesigns/${r.id}`}
                className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image src={absoluteUrl(r.afterUrl)} alt={r.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/90">{r.appName}</span>
                    <div className="flex gap-1">
                      {r.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-white/20 text-white">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3">
                  <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground">
                    <ArrowUp size={15} strokeWidth={2.5} />
                    <span className="tabular-nums text-xs">{r.upvoteCount}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-snug truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by <span className="font-medium text-foreground">@{r.author.username}</span></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
