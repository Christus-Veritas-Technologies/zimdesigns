import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface AdminStats {
  pendingRequests: number;
  liveApps: number;
  redesignsThisWeek: number;
  redesignsGrowth: number;
  newDesigners: number;
  designersGrowth: number;
}

export interface PendingAppRequest {
  id: string;
  appName: string;
  description: string | null;
  voteCount: number;
  status: string;
  createdAt: string;
  requester: { id: string; name: string; username: string; avatarUrl: string | null };
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => api.get<AdminStats>("/api/admin/stats").then((r) => r.data),
  });
}

export function useAdminAppRequests() {
  return useQuery<PendingAppRequest[]>({
    queryKey: ["admin-app-requests"],
    queryFn: () => api.get<PendingAppRequest[]>("/api/admin/app-requests").then((r) => r.data),
  });
}

export function useApproveAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/admin/app-requests/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-app-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useDenyAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/admin/app-requests/${id}/deny`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-app-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
