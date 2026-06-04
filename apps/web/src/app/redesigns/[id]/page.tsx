"use client";

import { use, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Trash2, Send, Share2, Bookmark, BookmarkCheck, Check, UserPlus, UserMinus } from "lucide-react";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/use-auth";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useFollowStatus, useToggleFollow } from "@/hooks/use-follows";
import { useProfile } from "@/hooks/use-profiles";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Both",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function ImageCarousel({ beforeUrl, afterUrl, title }: { beforeUrl: string; afterUrl: string; title: string }) {
  const [current, setCurrent] = useState(1);
  const images = [beforeUrl, afterUrl];
  const labels = ["Before", "After"];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
        <Image
          src={absoluteUrl(images[current])}
          alt={`${title} — ${labels[current]}`}
          fill
          className="object-cover"
          unoptimized
        />
        <button
          onClick={() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors rotate-180"
        >
          <ArrowLeft size={16} />
        </button>
        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-white w-4" : "bg-white/50")}
            />
          ))}
        </div>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "relative w-[90px] h-[72px] rounded-xl overflow-hidden border-2 transition-all flex-none",
              i === current ? "border-primary" : "border-border hover:border-foreground/30",
            )}
          >
            <Image src={absoluteUrl(img)} alt={labels[i]} fill className="object-cover" unoptimized />
            <span className="absolute bottom-1 left-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-black/60 text-white">{labels[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CommentsSection({ redesignId }: { redesignId: string }) {
  const { data: comments, isLoading } = useComments(redesignId);
  const createComment = useCreateComment(redesignId);
  const deleteComment = useDeleteComment(redesignId);
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || createComment.isPending) return;
    createComment.mutate(body.trim(), { onSuccess: () => setBody("") });
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h2 className="font-bold text-foreground mb-5 flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
        Let&apos;s Build on This
        {comments && (
          <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground tracking-wide uppercase">
            {comments.length} {comments.length === 1 ? "note" : "notes"}
          </span>
        )}
      </h2>

      {isAuthenticated && user && (
        <form onSubmit={handleSubmit} className="flex items-start gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none mt-0.5">
            <span className="text-xs font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add to the conversation…"
              disabled={createComment.isPending}
              className="flex-1 h-10 px-3.5 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
            />
            <button
              type="submit"
              disabled={!body.trim() || createComment.isPending}
              className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity hover:bg-primary/90"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-muted flex-none" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-muted rounded w-32" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && comments?.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      )}

      <div className="space-y-4">
        {comments?.map((c) => (
          <div key={c.id} className="flex gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-none text-primary font-semibold text-sm">
              {c.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Link href={`/users/${c.author.username}`} className="text-sm font-semibold text-foreground hover:underline">
                  {c.author.name}
                </Link>
                {(c.author as typeof c.author & { role?: string | null }).role && (
                  <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {ROLE_LABEL[(c.author as typeof c.author & { role?: string }).role!] ?? (c.author as typeof c.author & { role?: string }).role}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">· {timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{c.body}</p>
            </div>
            {user?.id === c.author.id && (
              <button
                onClick={() => deleteComment.mutate(c.id)}
                disabled={deleteComment.isPending}
                className="text-muted-foreground hover:text-destructive transition-colors flex-none disabled:opacity-40"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorSidebar({ authorUsername, redesignId }: { authorUsername: string; redesignId: string }) {
  const { data: profile } = useProfile(authorUsername);
  const { data: followStatus } = useFollowStatus(authorUsername);
  const toggleFollow = useToggleFollow(authorUsername);
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const isOwnProfile = currentUser?.username === authorUsername;

  if (!profile) return null;

  const ROLE_LABEL: Record<string, string> = { designer: "Designer", developer: "Developer", both: "Both" };

  return (
    <aside className="w-72 flex-none space-y-4 hidden lg:block">
      {/* Author card */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/users/${authorUsername}`}>
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
              {profile.avatarUrl ? (
                <Image src={absoluteUrl(profile.avatarUrl)} alt={profile.name} width={44} height={44} className="object-cover" unoptimized />
              ) : (
                <span className="text-sm font-bold text-primary">{profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}</span>
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/users/${authorUsername}`} className="text-sm font-semibold text-foreground hover:underline block truncate">{profile.name}</Link>
            <p className="text-xs text-muted-foreground">
              {profile.role ? ROLE_LABEL[profile.role] ?? profile.role : null}
              {profile.location && (profile.role ? ` · ${profile.location}` : profile.location)}
              {" · "}{profile.redesignCount} redesign{profile.redesignCount !== 1 ? "s" : ""}
            </p>
          </div>
          {!isOwnProfile && (
            <button
              onClick={() => isAuthenticated && toggleFollow.mutate()}
              disabled={toggleFollow.isPending}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold flex-none transition-colors",
                followStatus?.following
                  ? "border border-border bg-card text-foreground hover:bg-muted"
                  : "bg-[var(--zd-gold)] text-[var(--zd-gold-fg)] hover:bg-[var(--zd-gold-hover)]",
              )}
            >
              {followStatus?.following ? <><UserMinus size={11} className="inline mr-1" />Unfollow</> : <><UserPlus size={11} className="inline mr-1" />Follow</>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function RedesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: redesign, isLoading, isError } = useRedesign(id);
  const upvote = useUpvoteRedesign(id);
  const remove = useDeleteRedesign();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const [copied, setCopied] = useState(false);
  const bookmark = useToggleBookmark(id);
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === id) ?? false;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-32 mb-6" />
        <div className="flex gap-8">
          <div className="flex-1 space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-2xl" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
          <div className="w-72 flex-none space-y-4">
            <div className="h-32 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !redesign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Redesign not found.</p>
        <Link href="/" className="text-primary text-sm mt-2 inline-block">← Back to feed</Link>
      </div>
    );
  }

  const isOwner = user?.id === redesign.author.id;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: redesign.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back link */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={15} />
          Back to feed
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 flex gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          <ImageCarousel beforeUrl={redesign.beforeUrl} afterUrl={redesign.afterUrl} title={redesign.title} />

          {/* Pills */}
          <div className="flex items-center gap-2 mt-4 mb-3">
            <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground tracking-wide uppercase">Redesign</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground tracking-wide uppercase">{redesign.appName}</span>
          </div>

          {/* Title */}
          <h1
            className="text-[1.7rem] font-bold text-foreground tracking-tight leading-tight mb-3"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            {redesign.title}
          </h1>

          {/* Author + actions row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Link href={`/users/${redesign.author.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
                {redesign.author.avatarUrl ? (
                  <Image src={absoluteUrl(redesign.author.avatarUrl)} alt={redesign.author.name} width={32} height={32} className="object-cover" unoptimized />
                ) : (
                  <span className="text-xs font-bold text-primary">{redesign.author.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">{redesign.author.name}</span>
                <span className="text-xs text-muted-foreground ml-2">· posted {timeAgo(redesign.createdAt)}</span>
              </div>
            </Link>
            <div className="flex-1" />
            {/* Upvote pill */}
            <button
              onClick={() => isAuthenticated && upvote.mutate()}
              disabled={upvote.isPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors",
                redesign.hasUpvoted
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
              )}
            >
              <ArrowUp size={14} strokeWidth={2.5} />
              <span className="tabular-nums">{redesign.upvoteCount}</span>
              <span className="text-muted-foreground font-normal">votes</span>
            </button>
            <button
              onClick={() => isAuthenticated ? bookmark.mutate() : undefined}
              disabled={bookmark.isPending}
              className={cn("w-9 h-9 rounded-full border flex items-center justify-center transition-colors",
                isBookmarked ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")}
            >
              {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
            </button>
            {isOwner && (
              <button
                onClick={() => remove.mutate(id, { onSuccess: () => router.replace("/") })}
                disabled={remove.isPending}
                className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors px-2 py-1 rounded-lg hover:bg-accent"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>

          {/* Description */}
          {redesign.description && (
            <div className="mb-6">
              <h2 className="font-bold text-foreground mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
                What this redesign solves
              </h2>
              <p className="text-[0.94rem] text-foreground/80 leading-relaxed">{redesign.description}</p>
            </div>
          )}

          {/* Tags */}
          {redesign.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {redesign.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">{t}</span>
              ))}
            </div>
          )}

          <CommentsSection redesignId={id} />
        </div>

        {/* Sidebar */}
        <AuthorSidebar authorUsername={redesign.author.username} redesignId={id} />
      </div>
    </div>
  );
}
