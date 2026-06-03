"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Trophy, BookOpen } from "lucide-react";
import { useCollections, useChallenges, type Collection, type Challenge } from "@/hooks/use-discover";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const PLACEHOLDER_CHALLENGES: Challenge[] = [
  { id: "1", title: "Redesign the EcoCash checkout", slug: "ecocash-checkout", description: "Simplify the payment flow", gradientFrom: "#E8A900", gradientTo: "#FF6B35", appName: "EcoCash" },
  { id: "2", title: "ZESA app — first-time setup", slug: "zesa-onboarding", description: "Improve new user onboarding", gradientFrom: "#3B82F6", gradientTo: "#8B5CF6", appName: "ZESA" },
  { id: "3", title: "NetOne data bundle UI", slug: "netone-bundles", description: "Make bundle selection clearer", gradientFrom: "#10B981", gradientTo: "#3B82F6", appName: "NetOne" },
  { id: "4", title: "CBZ Mobile — dashboard", slug: "cbz-dashboard", description: "Modern banking dashboard", gradientFrom: "#F59E0B", gradientTo: "#EF4444", appName: "CBZ" },
];

function SpotlightCard({ collection }: { collection: Collection }) {
  return (
    <div className="relative rounded-3xl overflow-hidden aspect-[16/7] bg-muted group">
      {collection.coverImageUrl && (
        <Image src={absoluteUrl(collection.coverImageUrl)} alt={collection.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" unoptimized />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] uppercase tracking-wide">
            ✦ Spotlight Collection
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          {collection.title}
        </h2>
        {collection.description && (
          <p className="text-sm text-white/70 mb-4 max-w-lg">{collection.description}</p>
        )}
        <div className="flex items-center gap-4">
          <Link
            href={`/collections/${collection.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            View collection <ArrowRight size={14} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden">
              {collection.curator.avatarUrl ? (
                <Image src={absoluteUrl(collection.curator.avatarUrl)} alt={collection.curator.name} width={24} height={24} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.55rem] font-bold text-white flex items-center justify-center h-full">{collection.curator.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-xs text-white/70">Curated by <span className="text-white font-medium">{collection.curator.name}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      href={`/browse?challenge=${challenge.slug}`}
      className="relative rounded-2xl overflow-hidden aspect-square group flex flex-col justify-end p-5"
      style={{ background: `linear-gradient(135deg, ${challenge.gradientFrom}, ${challenge.gradientTo})` }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      {challenge.appName && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[0.6rem] font-bold px-2 py-1 rounded-full bg-white/20 text-white uppercase tracking-wide backdrop-blur-sm">{challenge.appName}</span>
        </div>
      )}
      <div className="relative z-10">
        <Trophy size={20} className="text-white/60 mb-2" />
        <p className="font-bold text-white text-sm leading-snug" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          {challenge.title}
        </p>
        {challenge.description && (
          <p className="text-[0.7rem] text-white/70 mt-1">{challenge.description}</p>
        )}
      </div>
    </Link>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {collection.coverImageUrl ? (
          <Image src={absoluteUrl(collection.coverImageUrl)} alt={collection.title} fill className="object-cover transition-transform group-hover:scale-[1.02]" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={28} className="text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[0.6rem] font-semibold text-white/80">{collection.redesignCount} redesigns</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="font-bold text-foreground text-sm leading-snug" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>{collection.title}</p>
        {collection.description && <p className="text-xs text-muted-foreground line-clamp-2">{collection.description}</p>}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-4 h-4 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center">
            {collection.curator.avatarUrl ? (
              <Image src={absoluteUrl(collection.curator.avatarUrl)} alt={collection.curator.name} width={16} height={16} className="object-cover" unoptimized />
            ) : (
              <span className="text-[0.45rem] font-bold text-primary">{collection.curator.name.charAt(0)}</span>
            )}
          </div>
          <span className="text-[0.65rem] text-muted-foreground">{collection.curator.name}</span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-2xl ${className ?? ""}`} />;
}

export default function DiscoverPage() {
  const { data: collections, isLoading: collectionsLoading } = useCollections();
  const { data: challenges, isLoading: challengesLoading } = useChallenges();

  const featuredCollection = collections?.find((c) => c.isFeatured) ?? collections?.[0];
  const otherCollections = collections?.filter((c) => c.id !== featuredCollection?.id) ?? [];
  const displayChallenges = (challenges && challenges.length > 0) ? challenges : PLACEHOLDER_CHALLENGES;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-[var(--zd-gold)]" />
              <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                Discover
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Curated collections, design challenges, and featured redesigns.</p>
          </div>
        </div>

        {/* Spotlight */}
        <section className="mb-12">
          {collectionsLoading ? (
            <SkeletonBlock className="aspect-[16/7] rounded-3xl" />
          ) : featuredCollection ? (
            <SpotlightCard collection={featuredCollection} />
          ) : (
            <div className="rounded-3xl bg-gradient-to-br from-[var(--zd-gold)]/20 to-[var(--zd-gold)]/5 border border-[var(--zd-gold)]/20 aspect-[16/7] flex flex-col items-center justify-center gap-3 text-center px-8">
              <Sparkles size={32} className="text-[var(--zd-gold)]" />
              <p className="font-bold text-foreground text-lg" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Collections coming soon</p>
              <p className="text-sm text-muted-foreground max-w-sm">The ZimDesigns team is curating the best redesigns. Check back soon!</p>
              <Link href="/search" className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] text-sm font-semibold hover:bg-[var(--zd-gold-hover)] transition-colors">
                Browse all redesigns <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>

        {/* Design challenges */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                Design Challenges
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Pick a challenge and show your take.</p>
            </div>
            <Link href="/search" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {challengesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => <SkeletonBlock key={i} className="aspect-square" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayChallenges.slice(0, 4).map((c) => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          )}
        </section>

        {/* Curated collections */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                Curated Collections
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Themed sets of redesigns picked by the community.</p>
            </div>
          </div>
          {collectionsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map((i) => <SkeletonBlock key={i} className="aspect-[4/3]" />)}
            </div>
          ) : otherCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherCollections.map((c) => <CollectionCard key={c.id} collection={c} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card py-12 text-center">
              <BookOpen size={28} className="mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-semibold text-foreground text-sm mb-1">No collections yet</p>
              <p className="text-xs text-muted-foreground">Collections will appear here once curated by the team.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
