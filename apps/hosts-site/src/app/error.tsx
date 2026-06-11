"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

import CvtHostsLogo from "@/components/cvt-hosts-logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center gap-6">
      <CvtHostsLogo />

      <div
        className="size-16 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(224,92,58,0.08)" }}
      >
        <HugeiconsIcon
          icon={AlertCircleIcon}
          size={32}
          strokeWidth={1.5}
          primaryColor="var(--danger)"
        />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h1 className="font-heading font-bold text-2xl text-foreground">
          Something went wrong.
        </h1>
        <p className="font-body text-[15px] text-muted leading-relaxed">
          An unexpected error occurred. Try refreshing the page, or go back
          home.
        </p>
        {error.digest && (
          <p className="font-body text-xs text-muted mt-1 opacity-60">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="bg-accent text-inverse hover:bg-accent-muted font-heading font-bold text-sm px-6 py-2.5 rounded-md transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-body text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
