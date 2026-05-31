"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <Wordmark size={22} />
      </div>

      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle size={28} className="text-destructive" strokeWidth={1.8} />
      </div>

      <h1
        className="text-2xl font-extrabold text-foreground tracking-tight mb-2"
        style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      >
        Something went wrong
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
        An unexpected error occurred. Our team has been notified. You can try again or go back to the home page.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-accent transition-colors"
        >
          Go home
        </a>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs font-mono text-muted-foreground/50">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
