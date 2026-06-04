"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Wordmark } from "@/components/brand/wordmark";

// Web OAuth callback: server redirects here after Google sign-in.
// Reads token/user from query params, stores in zustand, then navigates.
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

    // We don't have the full user object from query params — fetch /me after setting tokens
    setAuth(
      { id: userId, email: "", name: "", username: "", avatarUrl: null, onboardingComplete, role: null },
      token,
      refreshToken,
    );

    router.replace(onboardingComplete ? "/" : "/onboarding/step1");
  }, [params, router, setAuth]);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 bg-background">
      <Wordmark size={22} />
      <Loader2 className="animate-spin text-[var(--zd-gold)]" size={32} />
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  );
}
