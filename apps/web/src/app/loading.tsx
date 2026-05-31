import { Wordmark } from "@/components/brand/wordmark";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex-none" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-muted rounded w-3/4" />
            <div className="h-2.5 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-muted rounded-full w-14" />
          <div className="h-5 bg-muted rounded-full w-18" />
        </div>
      </div>
    </div>
  );
}

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Wordmark size={22} />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-32 rounded-xl bg-muted animate-pulse" />
          <div className="h-9 w-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
