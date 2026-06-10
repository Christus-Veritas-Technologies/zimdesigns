"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminLogin } from "./actions";
import { Lock, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(adminLogin, undefined);
  const { accessToken, _hasHydrated } = useAuthStore();

  // Require the user to have an active app session before entering admin password
  if (_hasHydrated && !accessToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <LogIn size={20} className="text-muted-foreground" />
          </div>
          <h1
            className="text-xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Sign in first
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            You need to be logged into your ZimDesigns account before accessing the admin console.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <LogIn size={15} /> Sign in to your account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-primary" />
          </div>
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Admin Console
          </h1>
          <p className="text-sm text-muted-foreground mt-1">ZimDesigns</p>
        </div>

        <form action={action} className="space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            required
            autoFocus
            className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all"
          />
          {state?.error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-opacity disabled:opacity-60"
          >
            {isPending ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
