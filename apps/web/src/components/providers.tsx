"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@zimdesigns/ui/components/sonner";
import { getQueryClient } from "@/lib/query-client";
import { ThemeProvider } from "./theme-provider";
import { useAuthStore, type AuthUser } from "@/store/auth";
import { getAccessToken, getRefreshToken, getStoredUser } from "@/lib/token-storage";

/**
 * Reads persisted auth data from localStorage once on mount and hydrates
 * the in-memory Zustand store.
 *
 * Lives in the root layout's Providers so it runs exactly once per browser
 * session — Next.js layouts are not remounted on client-side navigation, so
 * this fires on hard-refresh / first load and never again.
 *
 * Mirrors the native AuthProvider's SecureStore rehydration useEffect.
 */
function AuthInit() {
  const { setAuth, setHasHydrated } = useAuthStore();

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const user = getStoredUser<AuthUser>();

    if (accessToken && refreshToken && user) {
      // Populate the in-memory store without re-writing to localStorage
      // (it's already there — just mirror it into Zustand).
      setAuth(user, accessToken, refreshToken);
    }

    // Signal to auth-dependent UI (e.g. Header) that the store is ready.
    setHasHydrated();
  }, [setAuth, setHasHydrated]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthInit />
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
