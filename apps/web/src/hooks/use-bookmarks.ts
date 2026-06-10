"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import type { Redesign } from "./use-redesigns";
import { useAuthStore } from "@/store/auth";

export function useBookmarks() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery<Redesign[]>({
    queryKey: ["bookmarks"],
    queryFn: () => api.get<Redesign[]>("/api/bookmarks").then((r) => r.data),
    enabled: !!accessToken,
  });
}

export function useToggleBookmark(redesignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post<{ bookmarked: boolean }>(`/api/redesigns/${redesignId}/bookmark`).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(data.bookmarked ? "Saved to bookmarks!" : "Removed from bookmarks.");
    },
  });
}

export function useAppRequests() {
  return useQuery({
    queryKey: ["app-requests"],
    queryFn: () =>
      api.get<{ id: string; appName: string; description: string | null; voteCount: number; hasVoted: boolean; status: string; requester: { username: string; avatarUrl?: string | null }; createdAt: string }[]>("/api/app-requests").then((r) => r.data),
  });
}

export function useCreateAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { appName: string; description?: string }) =>
      api.post("/api/app-requests", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app-requests"] });
      toast.success("Request submitted! Others can now vote for it.");
    },
    onError: () => toast.error("Failed to submit request."),
  });
}

type AppRequest = { id: string; appName: string; description: string | null; voteCount: number; hasVoted: boolean; status: string; requester: { username: string; avatarUrl?: string | null }; createdAt: string };

export function useVoteAppRequest(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ voteCount: number; hasVoted: boolean }>(`/api/app-requests/${id}/vote`).then((r) => r.data),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["app-requests"] });
      const prev = qc.getQueryData<AppRequest[]>(["app-requests"]);
      qc.setQueryData<AppRequest[]>(["app-requests"], (old) =>
        old?.map((r) =>
          r.id === id
            ? { ...r, hasVoted: !r.hasVoted, voteCount: r.hasVoted ? r.voteCount - 1 : r.voteCount + 1 }
            : r,
        ),
      );
      return { prev };
    },

    onError: (_err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["app-requests"], ctx.prev);
    },

    onSuccess: (data) => {
      qc.setQueryData<AppRequest[]>(["app-requests"], (old) =>
        old?.map((r) => (r.id === id ? { ...r, ...data } : r)),
      );
    },
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
