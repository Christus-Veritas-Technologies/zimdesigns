"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export interface Notification {
  id: string;
  type: string;
  body: string;
  refId: string | null;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => api.get<Notification[]>("/api/notifications").then((r) => r.data),
    enabled: !!accessToken,
  });
}

export function useUnreadCount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread"],
    queryFn: () => api.get<{ count: number }>("/api/notifications/unread-count").then((r) => r.data),
    enabled: !!accessToken,
    refetchInterval: 30_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/api/notifications/read-all").then(() => undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
