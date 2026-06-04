"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUp, TrendingUp, Users } from "lucide-react";
import { useTrending } from "@/hooks/use-bookmarks";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Designer & Developer",
};

export default function TrendingPage() {
  const { data, isLoading } = useTrending();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 className="font-extrabold text-xl text-foreground" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Trending
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Redesigns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground">Top Redesigns this week</h2>
            </div>

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            )}

            {data?.topRedesigns && data.topRedesigns.length === 0 && (
              <p className="text-sm text-muted-foreground">No trending redesigns this week...yet</p>
            )}

            {data?.topRedesigns && data.topRedesigns.length > 0 && (
              <div className="space-y-3">
                {data.topRedesigns.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/redesigns/${r.id}`}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <span className="text-lg font-extrabold text-primary/60 w-6 text-center flex-none">{i + 1}</span>
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted flex-none">
                      <Image src={absoluteUrl(r.afterUrl)} alt={r.title} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.appName} · @{r.author.username}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground flex-none">
                      <ArrowUp size={12} strokeWidth={2.5} />
                      {r.upvoteCount}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Top Designers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground">Top Designers</h2>
            </div>

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            )}

            {data?.topDesigners && data.topDesigners.length === 0 && (
              <p className="text-sm text-muted-foreground">No top designers...yet</p>
            )}

            {data?.topDesigners && data.topDesigners.length > 0 && (
              <div className="space-y-3">
                {data.topDesigners.map((d, i) => (
                  <Link
                    key={d.id}
                    href={`/users/${d.username}`}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-extrabold text-primary/60 w-5 text-center flex-none">{i + 1}</span>
                    <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-none overflow-hidden">
                      {d.avatarUrl ? (
                        <Image src={absoluteUrl(d.avatarUrl)} alt={d.name} width={36} height={36} className="object-cover" unoptimized />
                      ) : (
                        <span className="text-sm font-extrabold text-primary">{d.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground truncate">{d.name}</p>
                        {d.role && (
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex-none">
                            {ROLE_LABEL[d.role] ?? d.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        @{d.username} · {d.redesignCount} redesign{d.redesignCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
