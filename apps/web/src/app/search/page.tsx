"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowUp, MessageCircle, Bookmark, BookmarkCheck, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRedesigns, type RedesignFilters } from "@/hooks/use-redesigns";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { useUpvoteRedesign } from "@/hooks/use-redesigns";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useAppEntries } from "@/hooks/use-app-entries";
import type { Redesign } from "@/hooks/use-redesigns";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const CATEGORIES = ["Banking", "Mobile", "Web", "Local", "E-commerce", "Social"];
const ROLES = [
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "both", label: "Both" },
];

function RedesignCard({ redesign }: { redesign: Redesign }) {
  const upvote = useUpvoteRedesign(redesign.id);
  const bookmark = useToggleBookmark(redesign.id);
  const isAuthenticated = useIsAuthenticated();
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === redesign.id) ?? false;

  return (
    <Link href={`/redesigns/${redesign.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image src={absoluteUrl(redesign.afterUrl)} alt={redesign.title} fill className="object-cover transition-transform group-hover:scale-[1.02]" unoptimized />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase">Redesign</span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white">{redesign.appName}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{redesign.title}</p>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/users/${redesign.author.username}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
              {redesign.author.avatarUrl ? (
                <Image src={absoluteUrl(redesign.author.avatarUrl)} alt={redesign.author.name} width={20} height={20} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.55rem] font-bold text-primary">{redesign.author.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate">{redesign.author.name}</span>
          </Link>
          <div className="flex items-center gap-1.5 flex-none">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle size={11} strokeWidth={2} />{redesign.commentCount}</span>
            <button
              onClick={(e) => { e.preventDefault(); isAuthenticated && upvote.mutate(); }}
              disabled={upvote.isPending}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold transition-colors",
                redesign.hasUpvoted ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}
            >
              <ArrowUp size={10} strokeWidth={2.5} />{redesign.upvoteCount}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); isAuthenticated && bookmark.mutate(); }}
              className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                isBookmarked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}
            >
              {isBookmarked ? <BookmarkCheck size={10} strokeWidth={2} /> : <Bookmark size={10} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "top">("recent");
  const [category, setCategory] = useState<string | undefined>();
  const [appFilter, setAppFilter] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: apps } = useAppEntries();
  const activeCount = [category, appFilter, role].filter(Boolean).length;

  const filters: RedesignFilters = {
    sort,
    category,
    appName: appFilter,
    role,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useRedesigns(filters);
  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  const filtered = search.trim().length >= 2
    ? allItems.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.appName.toLowerCase().includes(search.toLowerCase()),
      )
    : allItems;

  const clearAll = () => { setCategory(undefined); setAppFilter(undefined); setRole(undefined); };

  const sidebar = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Filters</h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
        )}
      </div>

      <FilterSection title="Sort by">
        <div className="flex flex-col gap-1">
          {[{ value: "recent", label: "Latest" }, { value: "top", label: "Trending" }].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSort(value as "recent" | "top")}
              className={cn("flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left",
                sort === value ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted")}
            >
              {label}
              {sort === value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? undefined : c)}
              className={cn("flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left",
                category === c ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted")}
            >
              {c}
              {category === c && <Check size={13} className="text-primary" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {apps && apps.length > 0 && (
        <FilterSection title="App">
          <div className="flex flex-col gap-1">
            {apps.map((a) => (
              <button
                key={a.id}
                onClick={() => setAppFilter(appFilter === a.name ? undefined : a.name)}
                className={cn("flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left",
                  appFilter === a.name ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted")}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-[0.6rem] font-bold text-white flex-none" style={{ backgroundColor: a.iconColor }}>{a.iconLetter}</div>
                {a.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Designer role">
        <div className="flex flex-col gap-1">
          {ROLES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRole(role === value ? undefined : value)}
              className={cn("flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors text-left",
                role === value ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted")}
            >
              {label}
              {role === value && <Check size={13} className="text-primary" />}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              Browse Redesigns
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Explore community redesigns of Zimbabwean apps.</p>
          </div>
          <Link href="/upload" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] text-sm font-semibold hover:bg-[var(--zd-gold-hover)] transition-colors whitespace-nowrap">
            + Submit a redesign
          </Link>
        </div>

        {/* Search + mobile filter bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or app…"
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileSidebarOpen((o) => !o)}
            className={cn("lg:hidden flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-semibold transition-colors",
              activeCount > 0 ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted")}
          >
            <SlidersHorizontal size={14} />
            Filters{activeCount > 0 && ` · ${activeCount}`}
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setSort(sort === "recent" ? "top" : "recent")}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <ChevronDown size={14} />
              Sort: {sort === "recent" ? "Latest" : "Trending"}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{activeCount} active</span>
            {category && (
              <button onClick={() => setCategory(undefined)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary text-xs font-semibold text-primary">
                {category} <X size={10} strokeWidth={3} />
              </button>
            )}
            {appFilter && (
              <button onClick={() => setAppFilter(undefined)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary text-xs font-semibold text-primary">
                {appFilter} <X size={10} strokeWidth={3} />
              </button>
            )}
            {role && (
              <button onClick={() => setRole(undefined)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary text-xs font-semibold text-primary">
                {ROLES.find((r) => r.value === role)?.label} <X size={10} strokeWidth={3} />
              </button>
            )}
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-background overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-none">{sidebar}</aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map((i) => <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Search size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-semibold text-foreground mb-1">No redesigns found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">{filtered.length} redesign{filtered.length !== 1 ? "s" : ""}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((r) => <RedesignCard key={r.id} redesign={r} />)}
                </div>
                {hasNextPage && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {isFetchingNextPage ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
