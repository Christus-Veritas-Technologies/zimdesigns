"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuthStore, type AuthUser } from "@/store/auth";

type SafeUser = AuthUser & {
  bio: string | null;
  role: "designer" | "developer" | "both" | null;
  interests: string[];
};

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery<SafeUser>({
    queryKey: ["me"],
    queryFn: () => api.get<SafeUser>("/api/me").then((r) => r.data),
    enabled: !!accessToken,
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      username?: string;
      bio?: string;
      role?: "designer" | "developer" | "both";
      avatarUrl?: string;
    }) => api.patch<SafeUser>("/api/me", data).then((r) => r.data),
    onSuccess: (user) => setUser(user),
  });
}

export function useUpdateInterests() {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: (interests: string[]) =>
      api.patch<SafeUser>("/api/me/interests", { interests }).then((r) => r.data),
    onSuccess: (user) => setUser(user),
  });
}

export function useCompleteOnboarding() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      api.post<SafeUser>("/api/me/onboarding/complete").then((r) => r.data),
    onSuccess: (user) => {
      setUser(user);
      router.replace("/");
    },
  });
}
