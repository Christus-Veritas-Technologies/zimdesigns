"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Mail } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";
  const error = params.get("error");

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          Email verified!
        </h1>
        <p className="text-sm text-muted-foreground mb-6">Your email address has been confirmed. You're all set.</p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
          Go to feed
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <XCircle size={28} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          Link expired
        </h1>
        <p className="text-sm text-muted-foreground mb-6">This verification link has expired or is invalid.</p>
        <Link href="/" className="text-primary text-sm font-medium hover:underline">
          Request a new link from your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Mail size={28} className="text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
        Check your email
      </h1>
      <p className="text-sm text-muted-foreground">We sent a verification link to your email address. Click it to activate your account.</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Suspense fallback={<div className="h-48 w-80 animate-pulse rounded-2xl bg-muted" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
