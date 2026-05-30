"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuthStore, type AuthUser } from "@/store/auth";

interface AuthResult {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}

export function useSignup() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      username: string;
      password: string;
    }) => api.post<AuthResult>("/api/auth/register", data).then((r) => r.data),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      router.replace("/onboarding/step1");
    },
  });
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResult>("/api/auth/login", data).then((r) => r.data),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.accessToken, tokens.refreshToken);
      router.replace(user.onboardingComplete ? "/" : "/onboarding/step1");
    },
  });
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      api.post("/api/auth/logout", { refreshToken }).then(() => undefined),
    onSettled: () => {
      clearAuth();
      router.replace("/auth/login");
    },
  });
}

export function useCurrentUser() {
  return useAuthStore((s) => s.user);
}

export function useIsAuthenticated() {
  return useAuthStore((s) => !!s.accessToken);
}
