"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { cn } from "@zimdesigns/ui/lib/utils";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${SERVER_URL}${url}`;
}

export default function RedesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: redesign, isLoading, isError } = useRedesign(id);
  const upvote = useUpvoteRedesign(id);
  const remove = useDeleteRedesign();
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const [view, setView] = useState<"after" | "before">("after");

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-32 mb-6" />
        <div className="aspect-[16/9] bg-muted rounded-2xl mb-6" />
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

        {/* Image viewer */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-muted mb-6">
          <div className="aspect-[4/3] relative">
            <Image
              src={absoluteUrl(view === "after" ? redesign.afterUrl : redesign.beforeUrl)}
              alt={redesign.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="absolute top-3 left-3 flex gap-2">
            {(["after", "before"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "bg-black/50 text-white backdrop-blur-sm hover:bg-black/70",
                )}
              >
                {v === "after" ? "After" : "Before"}
              </button>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-start gap-4 mb-6">
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
              <span className="font-medium text-foreground">@{redesign.author.username}</span>
            </p>
          </div>
        </div>

        {redesign.description && (
          <p className="text-[0.94rem] text-foreground/80 leading-relaxed mb-5">
            {redesign.description}
          </p>
        )}

        {redesign.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {redesign.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
