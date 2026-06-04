import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { api } from "@/lib/axios";
import type { Redesign } from "./use-redesigns";

interface ListResult { items: Redesign[]; nextCursor?: string }

export function useFollowStatus(username: string) {
  return useQuery<{ following: boolean }>({
    queryKey: ["follow-status", username],
    queryFn: () => api.get<{ following: boolean }>(`/api/users/${username}/follow-status`).then((r) => r.data),
    enabled: !!username,
  });
}

export function useToggleFollow(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ following: boolean }>(`/api/users/${username}/follow`).then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData(["follow-status", username], data);
      qc.invalidateQueries({ queryKey: ["profile", username] });
      if (data.following) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });
}

export function useFollowingFeed(enabled = true) {
  return useInfiniteQuery<ListResult>({
    queryKey: ["feed", "following"],
    queryFn: ({ pageParam }) =>
      api.get<ListResult>("/api/feed/following", { params: { cursor: pageParam } }).then((r) => r.data),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor,
    enabled,
  });
}
