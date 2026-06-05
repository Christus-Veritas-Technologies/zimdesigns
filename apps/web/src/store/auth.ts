"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  role: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  /** True once the persist middleware has read from localStorage. */
  _hasHydrated: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setHasHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

      setHasHydrated: () => set({ _hasHydrated: true }),
    }),
    {
      name: "zd-auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist auth data — _hasHydrated is always derived client-side.
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after localStorage has been read and merged into the store.
        state?.setHasHydrated();
      },
    },
  ),
);
