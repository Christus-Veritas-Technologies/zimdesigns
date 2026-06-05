"use client";

import Link from "next/link";
import { Upload, Compass, Flag } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { FlagBar } from "@/components/brand/flag-bar";
import { useCompleteOnboarding } from "@/hooks/use-onboarding";

export default function Step3Page() {
  const complete = useCompleteOnboarding();

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-[460px] bg-card border border-border rounded-2xl shadow-md px-10 py-12 text-center flex flex-col items-center">
        {/* Check */}
        <div className="w-[72px] h-[72px] rounded-full bg-[var(--zd-green)] flex items-center justify-center shadow-[0_0_0_12px_var(--zd-green-tint)]">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="mt-6 text-[1.9rem] font-bold tracking-tight leading-[1.15]"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
        >
          You&apos;re In. Now Let&apos;s Build Something Better.
        </h1>
        <p className="mt-3 text-[1rem] text-muted-foreground mb-8">
          Your profile is ready. Here&apos;s what happens next.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={() => complete.mutate()}
            disabled={complete.isPending}
            className="h-12 text-base font-semibold bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl gap-2"
          >
            <Upload size={18} />
            Upload Your First Redesign
          </Button>

          <p className="text-xs text-muted-foreground -mt-1">
            Show us how you&apos;d improve a Zimbabwean app.
          </p>

          {complete.isError && (
            <p className="text-sm text-destructive text-center">
              {(complete.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong. Please try again."}
            </p>
          )}

          <Button asChild variant="secondary"
            className="h-12 text-base font-semibold bg-[var(--zd-green)] hover:bg-[var(--zd-green-hover)] text-[var(--zd-green-fg)] rounded-xl gap-2">
            <Link href="/">
              <Compass size={18} />
              Explore Redesigns
            </Link>
          </Button>

          <Button variant="ghost" asChild
            className="w-full text-muted-foreground gap-2">
            <Link href="/request">
              <Flag size={15} /> Tell us what app needs fixing
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <FlagBar width={72} height={5} />
        </div>
      </div>
    </div>
  );
}
