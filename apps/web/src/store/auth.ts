"use client";

import { create } from "zustand";
import {
  saveTokens,
  saveUser,
  clearStorage,
} from "@/lib/token-storage";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
  role: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /**
   * True once AuthInit (rendered in the root Providers) has read from
   * localStorage and populated the store.  Components that render
   * auth-dependent UI should wait for this before showing authenticated
   * or unauthenticated state to avoid a flash.
   */
  _hasHydrated: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setHasHydrated: () => void;
}

/**
 * In-memory auth store — no Zustand persist middleware.
 *
 * Tokens are written to localStorage via token-storage helpers on every
 * mutation so they survive page reloads.  On mount the AuthInit component
 * (in Providers) reads them back and calls setAuth to populate this store.
 *
 * This mirrors the native app's pattern exactly:
 *   native: SecureStore (disk) → AuthContext (memory)
 *   web:    localStorage (disk) → useAuthStore (memory)
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  _hasHydrated: false,

  setAuth: (user, accessToken, refreshToken) => {
    // Persist to disk first so the data survives a page reload.
    saveTokens(accessToken, refreshToken);
    saveUser(user);
    set({ user, accessToken, refreshToken });
  },

  setTokens: (accessToken, refreshToken) => {
    saveTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => {
    saveUser(user);
    set({ user });
  },

  clearAuth: () => {
    clearStorage();
    set({ user: null, accessToken: null, refreshToken: null });
  },

  setHasHydrated: () => set({ _hasHydrated: true }),
}));
