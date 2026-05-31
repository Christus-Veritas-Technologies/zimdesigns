"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { useFollowers, useFollowStatus, useToggleFollow } from "@/hooks/use-follows";
import { useIsAuthenticated, useCurrentUser } from "@/hooks/use-auth";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

function FollowButton({ username }: { username: string }) {
  const isAuthenticated = useIsAuthenticated();
  const { data: status } = useFollowStatus(username);
  const toggle = useToggleFollow(username);
  if (!isAuthenticated) return null;
  return (
    <button
      onClick={() => toggle.mutate()}
      disabled={toggle.isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-colors ${status?.following ? "border-border text-muted-foreground hover:border-primary hover:text-primary" : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"}`}
    >
      {status?.following ? <><UserMinus size={13} />Unfollow</> : <><UserPlus size={13} />Follow</>}
    </button>
  );
}

export default function FollowersPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const currentUser = useCurrentUser();
  const { data: followers, isLoading } = useFollowers(username);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/users/${username}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 className="font-extrabold text-xl text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Followers of @{username}
          </h1>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && followers?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No followers yet.</p>
        )}

        {followers && followers.length > 0 && (
          <div className="space-y-2">
            {followers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card">
                <Link href={`/users/${u.username}`} className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden flex-none">
                  {u.avatarUrl ? (
                    <Image src={absoluteUrl(u.avatarUrl)} alt={u.name} width={40} height={40} className="object-cover" unoptimized />
                  ) : (
                    <span className="text-sm font-extrabold text-primary">{u.name.charAt(0).toUpperCase()}</span>
                  )}
                </Link>
                <Link href={`/users/${u.username}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">@{u.username}</p>
                  {u.bio && <p className="text-xs text-muted-foreground mt-0.5 truncate">{u.bio}</p>}
                </Link>
                {currentUser?.username !== u.username && <FollowButton username={u.username} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
