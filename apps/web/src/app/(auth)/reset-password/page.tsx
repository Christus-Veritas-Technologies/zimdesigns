"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@zimdesigns/ui/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const reset = useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      api.post("/api/auth/reset-password", data).then((r) => r.data),
    onSuccess: () => {
      setDone(true);
      setTimeout(() => router.replace("/auth/login"), 3000);
    },
  });

  if (!token) {
    return (
      <div className="text-center">
        <XCircle size={40} className="text-destructive mx-auto mb-3" />
        <h2 className="font-bold text-foreground mb-2">Invalid link</h2>
        <p className="text-sm text-muted-foreground mb-4">This reset link is missing or malformed.</p>
        <Link href="/auth/forgot-password" className="text-primary text-sm font-medium hover:underline">Request a new one</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle size={40} className="text-primary mx-auto mb-3" />
        <h2 className="font-bold text-foreground mb-2">Password updated!</h2>
        <p className="text-sm text-muted-foreground">Redirecting you to sign in…</p>
      </div>
    );
  }

  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = password.length >= 8 && password === confirm && !reset.isPending;

  return (
    <>
      <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
        Set new password
      </h1>
      <p className="text-sm text-muted-foreground mb-6">Choose a password that's at least 8 characters.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (canSubmit) reset.mutate({ token, password }); }}
        className="space-y-4"
      >
        <div>
          <label className="text-xs font-medium text-muted-foreground">New password</label>
          <div className="relative mt-1">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-3 py-2.5 pr-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            className={`mt-1 w-full px-3 py-2.5 rounded-xl border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${mismatch ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30"}`}
          />
          {mismatch && <p className="text-xs text-destructive mt-1">Passwords don't match</p>}
        </div>

        {reset.isError && (
          <div className="px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-sm">
            {(reset.error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "This link has expired. Please request a new one."}
          </div>
        )}

        <Button type="submit" disabled={!canSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {reset.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted" />}>
          <ResetForm />
        </Suspense>
        <p className="text-center mt-6">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
