"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowUp, FileSearch } from "lucide-react";
import { useSearch } from "@/hooks/use-profiles";
import { useUpvoteRedesign } from "@/hooks/use-redesigns";
import { useIsAuthenticated } from "@/hooks/use-auth";
import { cn } from "@zimdesigns/ui/lib/utils";
import type { Redesign } from "@/hooks/use-redesigns";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

function SearchCard({ redesign }: { redesign: Redesign }) {
  const upvote = useUpvoteRedesign(redesign.id);
  const isAuthenticated = useIsAuthenticated();

  return (
    <Link
      href={`/redesigns/${redesign.id}`}
      className="flex gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-sm transition-shadow"
    >
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-none">
        <Image src={absoluteUrl(redesign.afterUrl)} alt={redesign.title} fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground leading-snug">{redesign.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {redesign.appName} · @{redesign.author.username}
        </p>
        {redesign.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {redesign.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (isAuthenticated) upvote.mutate();
        }}
        disabled={upvote.isPending}
        className={cn(
          "flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl border text-xs font-semibold self-center flex-none transition-colors",
          redesign.hasUpvoted ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary",
          upvote.isPending && "opacity-50 cursor-not-allowed",
        )}
      >
        <ArrowUp size={13} strokeWidth={2.5} />
        {redesign.upvoteCount}
      </button>
    </Link>
  );
}

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");

  // 300ms debounce
  useEffect(() => {
    const t = setTimeout(() => setQ(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data: results, isLoading } = useSearch(q);
  const showResults = q.trim().length >= 2;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-extrabold text-foreground tracking-tight mb-5"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Search Redesigns
        </h1>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by app, title, or tag…"
            autoFocus
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          {input && (
            <button
              onClick={() => { setInput(""); setQ(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {showResults && isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {showResults && !isLoading && results?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileSearch size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No results for &ldquo;{q}&rdquo;</p>
            <p className="text-sm text-muted-foreground mb-4">Try a different app name, title, or tag.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">{results.length} result{results.length !== 1 ? "s" : ""}</p>
            {results.map((r) => (
              <SearchCard key={r.id} redesign={r} />
            ))}
          </div>
        )}

        {!showResults && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Type at least 2 characters to search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
