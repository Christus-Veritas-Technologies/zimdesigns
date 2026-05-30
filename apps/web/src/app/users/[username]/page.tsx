"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUp, Linkedin, Github, Globe, Twitter, Dribbble, UserPlus, UserMinus, LogIn } from "lucide-react";
import { useProfile, useUserRedesigns } from "@/hooks/use-profiles";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/use-auth";
import { useFollowStatus, useToggleFollow } from "@/hooks/use-follows";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Designer & Developer",
};

const SOCIAL_LINKS = [
  { key: "linkedinUrl", Icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
  { key: "githubUrl", Icon: Github, label: "GitHub", color: "#24292f" },
  { key: "dribbbleUrl", Icon: Dribbble, label: "Dribbble", color: "#EA4C89" },
  { key: "twitterUrl", Icon: Twitter, label: "X", color: "#000000" },
  { key: "websiteUrl", Icon: Globe, label: "Website", color: "#8A8278" },
] as const;

function AuthGateModal({ action, onClose }: { action: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <LogIn size={20} className="text-primary" />
        </div>
        <h2 className="font-extrabold text-lg text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}>Sign in to {action}</h2>
        <p className="text-sm text-muted-foreground mb-5">Join ZimDesigns to engage with the community.</p>
        <div className="flex gap-2">
          <Link href="/auth/login" className="flex-1"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign in</Button></Link>
          <Button variant="outline" onClick={onClose} className="flex-1">Maybe later</Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const [authModal, setAuthModal] = useState(false);
  const { data: profile, isLoading: profileLoading, isError } = useProfile(username);
  const { data: redesigns, isLoading: redesignsLoading } = useUserRedesigns(username);
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isOwnProfile = currentUser?.username === username;
  const { data: followStatus } = useFollowStatus(username);
  const toggleFollow = useToggleFollow(username);

  if (profileLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="flex gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-muted flex-none" />
          <div className="flex-1 space-y-2 pt-2">
            <div className="h-5 bg-muted rounded w-40" />
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-full" />
          </div>
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

  return (
    <div className="min-h-screen bg-background">
      {authModal && <AuthGateModal action="follow designers" onClose={() => setAuthModal(false)} />}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          {isOwnProfile && (
            <Link href="/profile/edit" className="text-sm font-medium text-primary hover:underline">
              Edit profile
            </Link>
          )}
          {!isOwnProfile && (
            <Button
              size="sm"
              variant={followStatus?.following ? "outline" : "default"}
              onClick={() => isAuthenticated ? toggleFollow.mutate() : setAuthModal(true)}
              disabled={toggleFollow.isPending}
              className="gap-1.5"
            >
              {followStatus?.following ? <><UserMinus size={14} />Unfollow</> : <><UserPlus size={14} />Follow</>}
            </Button>
          )}
        </div>

        {/* Profile header */}
        <div className="flex gap-4 mb-8 p-5 rounded-2xl border border-border bg-card">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-none overflow-hidden">
            {profile.avatarUrl ? (
              <Image src={absoluteUrl(profile.avatarUrl)} alt={profile.name} width={80} height={80} className="object-cover" unoptimized />
            ) : (
              <span className="text-3xl font-extrabold text-primary">{profile.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
              {profile.name}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            {profile.role && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {ROLE_LABEL[profile.role] ?? profile.role}
              </span>
            )}
            {profile.bio && (
              <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{profile.bio}</p>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {socialLinks.map(({ key, Icon, label, color, url }) => (
                  <a
                    key={key}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Icon size={13} style={{ color }} />
                    {label}
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">{profile.redesignCount} redesign{profile.redesignCount !== 1 ? "s" : ""}</span>
              <Link href={`/users/${username}/followers`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {profile.followerCount} follower{profile.followerCount !== 1 ? "s" : ""}
              </Link>
              <Link href={`/users/${username}/following`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Following
              </Link>
              <span className="text-xs text-muted-foreground">Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Redesigns grid */}
        <h2 className="font-semibold text-foreground mb-4">Redesigns</h2>

        {redesignsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!redesignsLoading && redesigns?.length === 0 && (
          <p className="text-sm text-muted-foreground">No redesigns yet.</p>
        )}

        {redesigns && redesigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {redesigns.map((r) => (
              <Link
                key={r.id}
                href={`/redesigns/${r.id}`}
                className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image src={absoluteUrl(r.afterUrl)} alt={r.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs font-semibold text-white/90">{r.appName}</span>
                </div>
                <div className="flex items-center gap-3 p-3">
                  <div className="flex flex-col items-center px-2 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground gap-0.5">
                    <ArrowUp size={12} strokeWidth={2.5} />
                    {r.upvoteCount}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
