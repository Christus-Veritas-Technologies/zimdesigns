import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/lib/axios";
import { useAuth, type AuthUser } from "@/contexts/auth-context";

interface AuthResult {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}

export function useSignup() {
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (data: { email: string; name: string; username: string; password: string }) =>
      api.post<AuthResult>("/api/auth/register", data).then((r) => r.data),
    onSuccess: async ({ user, tokens }) => {
      await setAuth(user, tokens.accessToken, tokens.refreshToken);
      router.replace("/(onboarding)/step1");
    },
  });
}

export function useLogin() {
  const { setAuth } = useAuth();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResult>("/api/auth/login", data).then((r) => r.data),
    onSuccess: async ({ user, tokens }) => {
      await setAuth(user, tokens.accessToken, tokens.refreshToken);
      router.replace(user.onboardingComplete ? "/(drawer)" : "/(onboarding)/step1");
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuth();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post("/api/auth/logout");
      } catch {
        // best-effort — clear locally regardless
      }
    },
    onSettled: async () => {
      await clearAuth();
      router.replace("/(auth)/login");
    },
  });
}
