import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { getAccessToken } from "@/lib/token-storage";

export interface Notification {
  id: string;
  type: string;
  body: string;
  refId: string | null;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => api.get<Notification[]>("/api/notifications").then((r) => r.data),
  });
}

export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread"],
    queryFn: () => api.get<{ count: number }>("/api/notifications/unread-count").then((r) => r.data),
    refetchInterval: 30_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/api/notifications/read-all").then(() => undefined),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
