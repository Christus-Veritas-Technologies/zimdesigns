"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Wordmark } from "@/components/brand/wordmark";
import { env } from "@zimdesigns/env/web";

// Web OAuth callback: server redirects here after Google sign-in.
// Reads token/user from query params, fetches the full /api/me profile,
// stores it in Zustand, then hard-navigates so the next page always
// reads a freshly-hydrated store from localStorage.
export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");
    const onboardingComplete = params.get("onboardingComplete") === "true";

    if (!token || !refreshToken || !userId) {
      router.replace("/auth/error?reason=missing_params");
      return;
    }

    (async () => {
      try {
        // Fetch the full user profile with the token from URL params.
        // We bypass the axios interceptor here because the store is empty at this point.
        const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`/api/me returned ${res.status}`);
        const me = await res.json();

        setAuth(
          {
            id: me.id,
            email: me.email ?? "",
            name: me.name ?? "",
            username: me.username ?? "",
            avatarUrl: me.avatarUrl ?? null,
            onboardingComplete: me.onboardingComplete ?? onboardingComplete,
            role: me.role ?? null,
          },
          token,
          refreshToken,
        );

        // Hard-navigate so the next page always starts from a freshly
        // rehydrated Zustand store (localStorage was written synchronously
        // by setAuth above; window.location guarantees a clean read).
        window.location.replace(
          (me.onboardingComplete ?? onboardingComplete) ? "/" : "/onboarding/step1",
        );
      } catch {
        // Fallback: persist at least the tokens so the next page can use them.
        // The store's user will be empty, but /api/me will re-fetch on step1.
        setAuth(
          {
            id: userId,
            email: "",
            name: "",
            username: "",
            avatarUrl: null,
            onboardingComplete,
            role: null,
          },
          token,
          refreshToken,
        );
        window.location.replace(onboardingComplete ? "/" : "/onboarding/step1");
      }
    })();
  // Run once on mount — params are stable for the lifetime of this page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 bg-background">
      <Wordmark size={22} />
      <Loader2 className="animate-spin text-[var(--zd-gold)]" size={32} />
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  );
}
