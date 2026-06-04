"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bookmark, Share2, MessageCircle, ArrowUp } from "lucide-react";
import { useCollection } from "@/hooks/use-discover";
import { Button } from "@zimdesigns/ui/components/ui/button";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function abs(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-2xl ${className ?? ""}`} />;
}

function RedesignCard({ redesign }: {
  redesign: {
    id: string; title: string; appName: string; beforeUrl: string; afterUrl: string;
    upvoteCount: number; tags: string[];
    author: { name: string; username: string; avatarUrl: string | null; role: string | null };
  };
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link href={`/redesigns/${redesign.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={abs(hover ? redesign.beforeUrl : redesign.afterUrl)}
          alt={redesign.title}
          fill className="object-cover transition-all duration-300"
          unoptimized
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase tracking-wide">
            REDESIGN
          </span>
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase tracking-wide">
            {redesign.appName}
          </span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          {redesign.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-muted overflow-hidden flex-none">
              {redesign.author.avatarUrl ? (
                <Image src={abs(redesign.author.avatarUrl)} alt={redesign.author.name} width={20} height={20} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.5rem] font-bold text-muted-foreground flex items-center justify-center h-full">
                  {redesign.author.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{redesign.author.name}</span>
            {redesign.author.role && (
              <span className="text-[0.6rem] font-semibold text-[var(--zd-green)] uppercase tracking-wide">{redesign.author.role}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-0.5 text-xs"><ArrowUp size={12} />{redesign.upvoteCount}</span>
            <span className="flex items-center gap-0.5 text-xs"><MessageCircle size={12} />0</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: collection, isLoading } = useCollection(id);
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <SkeletonBlock className="h-5 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-12">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-10 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <SkeletonBlock className="aspect-[4/3] rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => <SkeletonBlock key={i} className="aspect-[4/3]" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-foreground mb-2">Collection not found</p>
          <Link href="/discover" className="text-sm text-primary hover:underline">Back to Discover</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Discover
        </Link>

        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <span className="inline-flex items-center self-start text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase tracking-wide mb-4">
              ✦ Curated Collection
            </span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3 leading-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-muted-foreground mb-5 leading-relaxed">{collection.description}</p>
            )}

            {/* Curator */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-none">
                {collection.curator.avatarUrl ? (
                  <Image src={abs(collection.curator.avatarUrl)} alt={collection.curator.name} width={32} height={32} className="object-cover" unoptimized />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground flex items-center justify-center h-full">
                    {collection.curator.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Curated by <Link href={`/users/${collection.curator.username}`} className="font-semibold text-foreground hover:underline">{collection.curator.name}</Link>
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">{collection.redesigns.length}</span> redesigns
              <span>·</span>
              <span className="font-semibold text-foreground">
                {collection.redesigns.reduce((sum, r) => sum + r.upvoteCount, 0)}
              </span> votes
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={saved ? "default" : "outline"}
                size="sm"
                className={`gap-1.5 rounded-xl ${saved ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark size={14} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                <Share2 size={14} /> Share
              </Button>
            </div>
          </div>

          {/* Cover image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border">
            {collection.coverImageUrl ? (
              <Image src={abs(collection.coverImageUrl)} alt={collection.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--zd-gold)]/20 to-[var(--zd-gold)]/5">
                <span className="text-4xl font-extrabold text-[var(--zd-gold)]/40" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>
                  {collection.title.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Redesigns grid */}
        <div className="mb-6">
          <h2 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Redesigns in this collection
          </h2>
          {collection.redesigns.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-16 text-center">
              <p className="font-semibold text-foreground mb-1">No redesigns yet</p>
              <p className="text-sm text-muted-foreground">This collection is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.redesigns.map((r) => (
                <RedesignCard key={r.id} redesign={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
