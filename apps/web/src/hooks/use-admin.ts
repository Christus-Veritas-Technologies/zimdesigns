"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// All admin calls go through the Next.js proxy at /api/admin/*
// which checks the httpOnly admin cookie and adds the server-side API key.
async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

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

export interface AdminApp {
  id: string;
  slug: string;
  name: string;
  iconColor: string;
  iconLetter: string;
  description: string | null;
  tags: string;
  isPublished: boolean;
  createdAt: string;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => adminFetch<AdminStats>("stats"),
  });
}

export function useAdminAppRequests() {
  return useQuery<PendingAppRequest[]>({
    queryKey: ["admin-app-requests"],
    queryFn: () => adminFetch<PendingAppRequest[]>("app-requests"),
  });
}

export function useApproveAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`app-requests/${id}/approve`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-app-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useDenyAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`app-requests/${id}/deny`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-app-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useAdminApps() {
  return useQuery<AdminApp[]>({
    queryKey: ["admin-apps"],
    queryFn: () => adminFetch<AdminApp[]>("apps"),
  });
}

export function useCreateAdminApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string; iconColor?: string; tags?: string[] }) =>
      adminFetch<AdminApp>("apps", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-apps"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
