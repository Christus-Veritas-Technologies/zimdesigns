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
  screenshots: string[];
  figmaUrl: string | null;
  githubUrl: string | null;
  prototypeUrl: string | null;
  tags: string[];
  upvoteCount: number;
  commentCount: number;
  createdAt: string;
  author: RedesignAuthor;
  hasUpvoted: boolean;
}

export interface RedesignFilters {
  tag?: string;
  category?: string;
  appName?: string;
  role?: string;
  sort?: "recent" | "top";
}

interface ListResult {
  items: Redesign[];
  nextCursor?: string;
}

export function useRedesigns(params?: RedesignFilters) {
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

    onMutate: async () => {
      // Cancel any in-flight refetches that would overwrite our optimistic update
      await qc.cancelQueries({ queryKey: ["redesign", id] });
      await qc.cancelQueries({ queryKey: ["redesigns"] });

      const prevSingle = qc.getQueryData<Redesign>(["redesign", id]);
      const prevList = qc.getQueriesData<{ pages: { items: Redesign[] }[] }>({ queryKey: ["redesigns"] });

      // Optimistically update the single redesign view
      qc.setQueryData<Redesign>(["redesign", id], (old) =>
        old
          ? {
              ...old,
              hasUpvoted: !old.hasUpvoted,
              upvoteCount: old.hasUpvoted ? old.upvoteCount - 1 : old.upvoteCount + 1,
            }
          : old,
      );

      // Optimistically update every page in the infinite list
      qc.setQueriesData<{ pages: { items: Redesign[]; nextCursor?: string }[] }>(
        { queryKey: ["redesigns"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((r) =>
                r.id === id
                  ? { ...r, hasUpvoted: !r.hasUpvoted, upvoteCount: r.hasUpvoted ? r.upvoteCount - 1 : r.upvoteCount + 1 }
                  : r,
              ),
            })),
          };
        },
      );

      return { prevSingle, prevList };
    },

    onError: (_err, _v, ctx) => {
      // Roll back on error
      if (ctx?.prevSingle !== undefined) {
        qc.setQueryData(["redesign", id], ctx.prevSingle);
      }
      ctx?.prevList?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error("Failed to vote — please try again.");
    },

    onSuccess: (data) => {
      // Reconcile with server truth
      qc.setQueryData<Redesign>(["redesign", id], (old) =>
        old ? { ...old, ...data } : old,
      );
      qc.setQueriesData<{ pages: { items: Redesign[]; nextCursor?: string }[] }>(
        { queryKey: ["redesigns"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((r) => (r.id === id ? { ...r, ...data } : r)),
            })),
          };
        },
      );
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
