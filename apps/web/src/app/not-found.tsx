import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { FloatingImages } from "@/components/floating-images";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-6 text-center">
      <FloatingImages variant="not-found" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-10">
          <Wordmark size={22} />
        </div>

        <div
          className="text-[6rem] font-extrabold leading-none tracking-tight text-foreground/5 select-none mb-2"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          aria-hidden
        >
          404
        </div>

        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 -mt-6">
          <Search size={24} className="text-primary" strokeWidth={1.8} />
        </div>

        <h1
          className="text-2xl font-extrabold text-foreground tracking-tight mb-2"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Maybe a redesign swallowed it.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to feed
          </Link>
          <Link
            href="/search"
            className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-accent transition-colors"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
