import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { saveTokens, saveUser, getUser, clearAll, getAccessToken } from "@/lib/token-storage";
import { registerClearAuth } from "@/lib/auth-actions";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  role: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  updateUser: (user: AuthUser) => Promise<void>;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from secure storage on mount
  useEffect(() => {
    (async () => {
      try {
        const [storedUser, token] = await Promise.all([
          getUser<AuthUser>(),
          getAccessToken(),
        ]);
        if (storedUser && token) setUser(storedUser);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Register clearAuth with the global bridge so the axios interceptor can
  // call it when a token refresh fails (interceptor has no context access).
  useEffect(() => {
    registerClearAuth(clearAuth);
  }, [clearAuth]);

  const setAuth = useCallback(async (newUser: AuthUser, accessToken: string, refreshToken: string) => {
    await Promise.all([
      saveTokens(accessToken, refreshToken),
      saveUser(newUser),
    ]);
    setUser(newUser);
  }, []);

  const updateUser = useCallback(async (newUser: AuthUser) => {
    await saveUser(newUser);
    setUser(newUser);
  }, []);

  const clearAuth = useCallback(async () => {
    await clearAll();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, setAuth, updateUser, clearAuth }),
    [user, isLoading, setAuth, updateUser, clearAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
