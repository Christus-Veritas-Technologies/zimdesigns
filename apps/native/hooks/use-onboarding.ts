import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { api } from "@/lib/axios";
import { useAuth, type AuthUser } from "@/contexts/auth-context";

type SafeUser = AuthUser & {
  bio: string | null;
  role: "designer" | "developer" | "both" | null;
  interests: string[];
};

export function useMe() {
  const { isAuthenticated } = useAuth();
  return useQuery<SafeUser>({
    queryKey: ["me"],
    queryFn: () => api.get<SafeUser>("/api/me").then((r) => r.data),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      username?: string;
      bio?: string;
      role?: "designer" | "developer" | "both";
    }) => api.patch<SafeUser>("/api/me", data).then((r) => r.data),
    onSuccess: async (user) => {
      await updateUser(user);
      router.push("/(onboarding)/step2");
    },
  });
}

export function useUpdateInterests() {
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: (interests: string[]) =>
      api.patch<SafeUser>("/api/me/interests", { interests }).then((r) => r.data),
    onSuccess: async (user) => {
      await updateUser(user);
      router.push("/(onboarding)/step3");
    },
  });
}

export function useCompleteOnboarding() {
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: () => api.post<SafeUser>("/api/me/onboarding/complete").then((r) => r.data),
    onSuccess: async (user) => {
      await updateUser(user);
      router.replace("/(drawer)");
    },
  });
}
