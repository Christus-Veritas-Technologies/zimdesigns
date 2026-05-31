import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/axios";
import type { Redesign } from "./use-redesigns";

export function useBookmarks(enabled = true) {
  return useQuery<Redesign[]>({
    queryKey: ["bookmarks"],
    queryFn: () => api.get<Redesign[]>("/api/bookmarks").then((r) => r.data),
    enabled,
  });
}

export function useToggleBookmark(redesignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<{ bookmarked: boolean }>(`/api/redesigns/${redesignId}/bookmark`).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      if (data.bookmarked) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });
}

export function useAppRequests() {
  return useQuery({
    queryKey: ["app-requests"],
    queryFn: () =>
      api.get<{ id: string; appName: string; description: string | null; voteCount: number; hasVoted: boolean; requester: { username: string }; createdAt: string }[]>("/api/app-requests").then((r) => r.data),
  });
}

export function useCreateAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { appName: string; description?: string }) =>
      api.post("/api/app-requests", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app-requests"] }),
  });
}

export function useVoteAppRequest(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ voteCount: number; hasVoted: boolean }>(`/api/app-requests/${id}/vote`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app-requests"] }),
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: () =>
      api.get<{
        topRedesigns: { id: string; title: string; appName: string; afterUrl: string; upvoteCount: number; author: { username: string } }[];
        topDesigners: { id: string; name: string; username: string; avatarUrl: string | null; role: string | null; redesignCount: number }[];
      }>("/api/trending").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}
