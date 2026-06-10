"use client";

import { useActionState } from "react";
import { adminLogin } from "./actions";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(adminLogin, undefined);

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
            <p className="text-sm text-destructive text-center">{state.error}</p>
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
