"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Linkedin, Github, Globe, Twitter, Dribbble, UserPlus, UserMinus, LogIn, Share2, MessageCircle, Bookmark, BookmarkCheck, MoreHorizontal, Figma } from "lucide-react";
import { useProfile, useUserRedesigns } from "@/hooks/use-profiles";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/use-auth";
import { useFollowStatus, useToggleFollow } from "@/hooks/use-follows";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRouter } from "next/navigation";
import type { Redesign } from "@/hooks/use-redesigns";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Both",
};

const SOCIAL_LINKS = [
  { key: "figmaUrl" as const, Icon: Figma, label: "Figma" },
  { key: "githubUrl" as const, Icon: Github, label: "GitHub" },
  { key: "websiteUrl" as const, Icon: Globe, label: "Website" },
  { key: "linkedinUrl" as const, Icon: Linkedin, label: "LinkedIn" },
  { key: "dribbbleUrl" as const, Icon: Dribbble, label: "Dribbble" },
  { key: "twitterUrl" as const, Icon: Twitter, label: "X" },
];

function AuthGateModal({ action, onClose }: { action: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <LogIn size={20} className="text-primary" />
        </div>
        <h2 className="font-bold text-lg text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>Sign in to {action}</h2>
        <p className="text-sm text-muted-foreground mb-5">Join ZimDesigns to engage with the community.</p>
        <div className="flex gap-2">
          <Link href="/login" className="flex-1 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Sign in</Link>
          <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors">Maybe later</button>
        </div>
      </div>
    </div>
  );
}

function RedesignCard({ redesign, onAuthRequired }: { redesign: Redesign; onAuthRequired: () => void }) {
  const bookmark = useToggleBookmark(redesign.id);
  const isAuthenticated = useIsAuthenticated();
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === redesign.id) ?? false;

  return (
    <Link href={`/redesigns/${redesign.id}`} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image src={absoluteUrl(redesign.afterUrl)} alt={redesign.title} fill className="object-cover" unoptimized />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] tracking-wide uppercase">Redesign</span>
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">{redesign.appName}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{redesign.title}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
              {redesign.author.avatarUrl ? (
                <Image src={absoluteUrl(redesign.author.avatarUrl)} alt={redesign.author.name} width={20} height={20} className="object-cover" unoptimized />
              ) : (
                <span className="text-[0.55rem] font-bold text-primary">{redesign.author.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="text-xs font-medium text-foreground truncate">{redesign.author.name}</span>
            {redesign.author.role && <span className="text-[0.62rem] text-muted-foreground flex-none">{ROLE_LABEL[redesign.author.role] ?? redesign.author.role}</span>}
          </div>
          <div className="flex items-center gap-2 flex-none">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUp size={11} strokeWidth={2.5} />{redesign.upvoteCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle size={11} strokeWidth={2} />{redesign.commentCount}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); isAuthenticated ? bookmark.mutate() : onAuthRequired(); }}
              disabled={bookmark.isPending}
              className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                isBookmarked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {isBookmarked ? <BookmarkCheck size={11} strokeWidth={2} /> : <Bookmark size={11} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

type ProfileTab = "redesigns" | "saved" | "comments" | "votes";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const [authModal, setAuthModal] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("redesigns");
  const { data: profile, isLoading: profileLoading, isError } = useProfile(username);
  const { data: redesigns, isLoading: redesignsLoading } = useUserRedesigns(username);
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isOwnProfile = currentUser?.username === username;
  const { data: followStatus } = useFollowStatus(username);
  const toggleFollow = useToggleFollow(username);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-32 bg-muted" />
        <div className="max-w-4xl mx-auto px-6 -mt-10">
          <div className="w-20 h-20 rounded-full bg-muted mb-4" />
          <div className="h-6 bg-muted rounded w-40 mb-2" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">User not found.</p>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">← Back to feed</Link>
      </div>
    );
  }

  const socialLinks = SOCIAL_LINKS.map((s) => ({ ...s, url: profile[s.key] })).filter((s) => s.url);
  const initials = profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action="follow designers" onClose={() => setAuthModal(false)} />}

      {/* Banner */}
      <div
        className="h-32 md:h-40 relative"
        style={{
          backgroundImage: "radial-gradient(var(--zd-border) 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px",
          backgroundColor: "var(--zd-bg-alt)",
        }}
      />

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between -mt-10 md:-mt-12 mb-4">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-background flex-none shadow-sm">
            {profile.avatarUrl ? (
              <Image src={absoluteUrl(profile.avatarUrl)} alt={profile.name} width={96} height={96} className="object-cover" unoptimized />
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-primary">{initials}</span>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <Link href="/profile/edit" className="px-4 py-1.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                Edit profile
              </Link>
            ) : (
              <button
                onClick={() => isAuthenticated ? toggleFollow.mutate() : setAuthModal(true)}
                disabled={toggleFollow.isPending}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors",
                  followStatus?.following
                    ? "border border-border bg-card text-foreground hover:bg-muted"
                    : "bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] hover:bg-[var(--zd-gold-hover)]",
                )}
              >
                {followStatus?.following ? <><UserMinus size={13} className="inline mr-1" />Unfollow</> : <><UserPlus size={13} className="inline mr-1" />Follow</>}
              </button>
            )}
            <button onClick={handleShare} className="h-8 w-8 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Share2 size={14} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Name + badge + location */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[1.4rem] font-bold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              {profile.name}
            </h1>
            {profile.role && (
              <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full border border-[var(--zd-green)] bg-[var(--zd-green-tint)] text-[var(--zd-green)] uppercase tracking-wide">
                {ROLE_LABEL[profile.role] ?? profile.role}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            @{profile.username}{profile.location && <> · {profile.location}</>}
          </p>
          {profile.bio && (
            <p className="text-[0.92rem] text-foreground/80 mt-2 leading-relaxed max-w-xl">{profile.bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[0.95rem] font-bold text-foreground">{profile.redesignCount}</span>
            <span className="text-xs text-muted-foreground">Redesigns</span>
          </div>
          <Link href={`/users/${username}/followers`} className="flex flex-col hover:opacity-80 transition-opacity">
            <span className="text-[0.95rem] font-bold text-foreground">{profile.followerCount >= 1000 ? `${(profile.followerCount / 1000).toFixed(1)}k` : profile.followerCount}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </Link>
          <Link href={`/users/${username}/following`} className="flex flex-col hover:opacity-80 transition-opacity">
            <span className="text-[0.95rem] font-bold text-foreground">{profile.followingCount}</span>
            <span className="text-xs text-muted-foreground">Following</span>
          </Link>
          <div className="flex flex-col">
            <span className="text-[0.95rem] font-bold text-foreground">{profile.votesEarned >= 1000 ? `${(profile.votesEarned / 1000).toFixed(1)}k` : profile.votesEarned}</span>
            <span className="text-xs text-muted-foreground">Votes earned</span>
          </div>
        </div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {socialLinks.map(({ key, Icon, label, url }) => (
              <a
                key={key}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-colors text-xs font-medium text-foreground"
              >
                <Icon size={13} className="text-muted-foreground" />
                {label === "Website" ? new URL(url!).hostname.replace("www.", "") : label}
              </a>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6">
          {(["redesigns", "saved", "comments", "votes"] as ProfileTab[]).map((t) => {
            const counts: Record<ProfileTab, number | undefined> = {
              redesigns: profile.redesignCount,
              saved: undefined,
              comments: undefined,
              votes: profile.votesEarned,
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
                  tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}{counts[t] !== undefined ? ` ${counts[t]}` : ""}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {tab === "redesigns" && (
          <>
            {redesignsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-3 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            )}
            {!redesignsLoading && redesigns?.length === 0 && (
              <p className="text-sm text-muted-foreground">No redesigns yet.</p>
            )}
            {redesigns && redesigns.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {redesigns.map((r) => <RedesignCard key={r.id} redesign={r} onAuthRequired={() => setAuthModal(true)} />)}
              </div>
            )}
          </>
        )}
        {tab !== "redesigns" && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
