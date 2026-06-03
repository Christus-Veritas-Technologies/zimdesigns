"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";

export interface RedesignAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string | null;
}

export interface Redesign {
  id: string;
  title: string;
  appName: string;
  description: string | null;
  beforeUrl: string;
  afterUrl: string;
  tags: string[];
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
  author: RedesignAuthor;
  hasUpvoted: boolean;
}

interface ListResult {
  items: Redesign[];
  nextCursor?: string;
}

export function useRedesigns(params?: { tag?: string; sort?: "recent" | "top" }) {
  return useInfiniteQuery<ListResult>({
    queryKey: ["redesigns", params],
    queryFn: ({ pageParam }) =>
      api
        .get<ListResult>("/api/redesigns", {
          params: { ...params, cursor: pageParam as string | undefined },
        })
        .then((r) => r.data),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor,
  });
}

export function useRedesign(id: string) {
  return useQuery<Redesign>({
    queryKey: ["redesign", id],
    queryFn: () => api.get<Redesign>(`/api/redesigns/${id}`).then((r) => r.data),
  });
}

export function useCreateRedesign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api
        .post<Redesign>("/api/redesigns", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redesigns"] }),
  });
}

export function useUpvoteRedesign(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api
        .post<{ upvoteCount: number; hasUpvoted: boolean }>(`/api/redesigns/${id}/upvote`)
        .then((r) => r.data),
    onSuccess: (data) => {
      qc.setQueryData<Redesign>(["redesign", id], (old) =>
        old ? { ...old, ...data } : old,
      );
      qc.invalidateQueries({ queryKey: ["redesigns"] });
      if (data.hasUpvoted) toast.success("Upvoted!");
    },
  });
}

export function useDeleteRedesign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/redesigns/${id}`).then(() => undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["redesigns"] });
      toast.success("Redesign deleted.");
    },
  });
}
