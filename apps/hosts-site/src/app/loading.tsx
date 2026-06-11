function SkeletonBar({
  width,
  height = "h-4",
  className = "",
}: {
  width: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`${height} ${width} ${className} bg-surface rounded-lg`}
    />
  );
}

export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-background animate-pulse">
      {/* Hero skeleton */}
      <div className="max-w-[1100px] mx-auto px-6 pt-28 pb-24 flex flex-col gap-5">
        {/* Eyebrow */}
        <SkeletonBar width="w-40" height="h-3" className="bg-subtle" />
        {/* Headline lines */}
        <div className="flex flex-col gap-3 mt-2">
          <SkeletonBar width="w-[480px] max-w-full" height="h-12" />
          <SkeletonBar width="w-[400px] max-w-full" height="h-12" />
          <SkeletonBar width="w-[360px] max-w-full" height="h-12" />
        </div>
        {/* Body lines */}
        <div className="flex flex-col gap-2 mt-2">
          <SkeletonBar width="w-[520px] max-w-full" height="h-4" className="bg-subtle" />
          <SkeletonBar width="w-[440px] max-w-full" height="h-4" className="bg-subtle" />
          <SkeletonBar width="w-[300px] max-w-full" height="h-4" className="bg-subtle" />
        </div>
        {/* CTA skeletons */}
        <div className="flex gap-3 mt-4">
          <div className="h-11 w-44 bg-subtle rounded-md" />
          <div className="h-11 w-36 bg-subtle rounded-md border border-border" />
        </div>
      </div>

      {/* Stat bar skeleton */}
      <div className="w-full bg-surface border-y border-border py-8">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 py-4 md:py-0">
              <div className="size-7 bg-subtle rounded" />
              <SkeletonBar width="w-28" height="h-8" />
              <SkeletonBar width="w-36" height="h-3" className="bg-subtle" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
