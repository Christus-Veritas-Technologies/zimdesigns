"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const request = useMutation({
    mutationFn: (email: string) =>
      api.post("/api/auth/forgot-password", { email }).then((r) => r.data),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            If an account with <span className="font-medium text-foreground">{email}</span> exists, we've sent a password reset link. Check your inbox (and spam folder).
          </p>
          <Link href="/auth/login" className="text-sm text-primary font-medium hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/auth/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={15} /> Back to sign in
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Mail size={20} className="text-primary" />
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (email) request.mutate(email); }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={request.isPending}
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
          </div>

          {request.isError && (
            <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
          )}

          <Button
            type="submit"
            disabled={request.isPending || !email}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {request.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
