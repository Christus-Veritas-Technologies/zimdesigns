import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string; username: string; avatarUrl: string | null };
}

export function useComments(redesignId: string) {
  return useQuery<Comment[]>({
    queryKey: ["comments", redesignId],
    queryFn: () => api.get<Comment[]>(`/api/redesigns/${redesignId}/comments`).then((r) => r.data),
  });
}

export function useCreateComment(redesignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      api.post<Comment>(`/api/redesigns/${redesignId}/comments`, { body }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", redesignId] }),
  });
}

export function useDeleteComment(redesignId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.delete(`/api/comments/${commentId}`).then(() => undefined),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", redesignId] }),
  });
}
