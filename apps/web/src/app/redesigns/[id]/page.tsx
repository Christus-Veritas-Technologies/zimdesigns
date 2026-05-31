"use client";

import { use, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Trash2, Send, MessageCircle, Share2, Bookmark, BookmarkCheck, Check } from "lucide-react";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/use-auth";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useRouter } from "next/navigation";
import ComparisonSlider from "@/components/comparison-slider";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${SERVER_URL}${url}`;
}

function CommentsSection({ redesignId }: { redesignId: string }) {
  const { data: comments, isLoading } = useComments(redesignId);
  const createComment = useCreateComment(redesignId);
  const deleteComment = useDeleteComment(redesignId);
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const [body, setBody] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || createComment.isPending) return;
    createComment.mutate(body.trim(), { onSuccess: () => setBody("") });
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageCircle size={16} />
        Comments {comments ? `(${comments.length})` : ""}
      </h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <textarea
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={1}
            maxLength={1000}
            className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
            }}
          />
          <button
            type="submit"
            disabled={!body.trim() || createComment.isPending}
            className="px-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity hover:bg-primary/90"
          >
            <Send size={15} />
          </button>
        </form>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted flex-none" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-24" />
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
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-none text-primary font-semibold text-xs">
              {c.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <Link href={`/users/${c.author.username}`} className="text-sm font-semibold text-foreground hover:underline">
                  @{c.author.username}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{c.body}</p>
            </div>
            {user?.id === c.author.id && (
              <button
                onClick={() => deleteComment.mutate(c.id)}
                className="text-muted-foreground hover:text-destructive transition-colors mt-0.5 flex-none"
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

export default function RedesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: redesign, isLoading, isError } = useRedesign(id);
  const upvote = useUpvoteRedesign(id);
  const remove = useDeleteRedesign();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-32 mb-6" />
        <div className="aspect-[4/3] bg-muted rounded-2xl mb-6" />
        <div className="h-8 bg-muted rounded w-3/4 mb-3" />
        <div className="h-4 bg-muted rounded w-1/3" />
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
  const [copied, setCopied] = useState(false);
  const bookmark = useToggleBookmark(id);
  const { data: bookmarks } = useBookmarks();
  const isBookmarked = bookmarks?.some((b) => b.id === id) ?? false;
  // view state removed — replaced by ComparisonSlider

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
            >
              {copied ? <><Check size={13} className="text-green-500" />Copied</> : <><Share2 size={13} />Share</>}
            </button>
            {isAuthenticated && (
              <button
                onClick={() => bookmark.mutate()}
                disabled={bookmark.isPending}
                className={`p-2 rounded-lg hover:bg-accent transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                title={isBookmarked ? "Remove bookmark" : "Save redesign"}
              >
                {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => remove.mutate(id, { onSuccess: () => router.replace("/") })}
                disabled={remove.isPending}
                className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Before/after comparison slider */}
        <div className="mb-6">
          <ComparisonSlider
            beforeUrl={absoluteUrl(redesign.beforeUrl)}
            afterUrl={absoluteUrl(redesign.afterUrl)}
            alt={redesign.title}
          />
          <p className="text-xs text-muted-foreground text-center mt-2">Drag to compare before & after</p>
        </div>

        {/* Meta */}
        <div className="flex items-start gap-4 mb-5">
          <button
            onClick={() => isAuthenticated && upvote.mutate()}
            disabled={upvote.isPending}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border font-semibold transition-colors flex-none",
              redesign.hasUpvoted
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            <ArrowUp size={17} strokeWidth={2.5} />
            <span className="text-sm tabular-nums">{redesign.upvoteCount}</span>
          </button>

          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-extrabold text-foreground tracking-tight leading-tight mb-1"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
            >
              {redesign.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{redesign.appName}</span>
              {" · "}by{" "}
              <Link href={`/users/${redesign.author.username}`} className="font-medium text-foreground hover:underline">
                @{redesign.author.username}
              </Link>
            </p>
          </div>
        </div>

        {redesign.description && (
          <p className="text-[0.94rem] text-foreground/80 leading-relaxed mb-5">
            {redesign.description}
          </p>
        )}

        {redesign.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {redesign.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}

        <CommentsSection redesignId={id} />
      </div>
    </div>
  );
}
