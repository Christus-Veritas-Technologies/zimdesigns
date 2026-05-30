"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/button";
import { Wordmark } from "@/components/brand/wordmark";

const REASONS: Record<string, string> = {
  google_failed: "Google sign-in failed. Please try again.",
  no_code: "No authorisation code received from Google.",
  missing_params: "Some required parameters were missing.",
};

export default function AuthErrorPage() {
  const params = useSearchParams();
  const reason = params.get("reason") ?? "unknown";
  const message = REASONS[reason] ?? "Something went wrong during sign-in.";

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 bg-background">
      <Wordmark size={22} />
      <XCircle size={48} className="text-destructive" />
      <div className="text-center max-w-sm">
        <p className="text-lg font-semibold">Sign-in failed</p>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
      <Button asChild className="bg-[var(--zd-gold)] hover:bg-[var(--zd-gold-hover)] text-[var(--zd-gold-fg)] rounded-xl">
        <Link href="/login">Try again</Link>
      </Button>
    </div>
  );
}
