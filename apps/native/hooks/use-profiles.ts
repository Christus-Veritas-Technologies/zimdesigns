import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Redesign } from "./use-redesigns";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string | null;
  createdAt: string;
  redesignCount: number;
}

export function useProfile(username: string) {
  return useQuery<UserProfile>({
    queryKey: ["profile", username],
    queryFn: () => api.get<UserProfile>(`/api/users/${username}`).then((r) => r.data),
    enabled: !!username,
  });
}

export function useUserRedesigns(username: string) {
  return useQuery<Redesign[]>({
    queryKey: ["user-redesigns", username],
    queryFn: () => api.get<Redesign[]>(`/api/users/${username}/redesigns`).then((r) => r.data),
    enabled: !!username,
  });
}

export function useSearch(q: string) {
  return useQuery<Redesign[]>({
    queryKey: ["search", q],
    queryFn: () => api.get<Redesign[]>("/api/search", { params: { q } }).then((r) => r.data),
    enabled: q.trim().length >= 2,
  });
}
