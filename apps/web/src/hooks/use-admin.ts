"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";

// All admin calls go through the Next.js proxy at /api/admin/*
// which checks the httpOnly admin cookie and adds the server-side API key.
// The user's access token is forwarded so Hono can resolve the real caller.
async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`/api/admin/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
      toast.success("Request approved");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to approve request"),
  });
}

export function useDenyAppRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`app-requests/${id}/deny`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-app-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Request denied");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to deny request"),
  });
}

export function useAdminApps() {
  return useQuery<AdminApp[]>({
    queryKey: ["admin-apps"],
    queryFn: () => adminFetch<AdminApp[]>("apps"),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: string | null;
  banned: boolean;
  emailVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  _count: { redesigns: number; followers: number };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminReport {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; name: string; username: string; avatarUrl: string | null };
}

export function useAdminUsers(params?: { page?: number; search?: string }) {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin-users", params],
    queryFn: () => adminFetch<AdminUsersResponse>(`users?${new URLSearchParams({
      ...(params?.page ? { page: String(params.page) } : {}),
      ...(params?.search ? { search: params.search } : {}),
    })}`),
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`users/${id}/ban`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("User banned");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to ban user"),
  });
}

export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`users/${id}/unban`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User unbanned");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to unban user"),
  });
}

// ── Reports ───────────────────────────────────────────────────────────────────

export function useAdminReports(status?: string) {
  return useQuery<AdminReport[]>({
    queryKey: ["admin-reports", status],
    queryFn: () => adminFetch<AdminReport[]>(`reports${status ? `?status=${status}` : ""}`),
  });
}

export function useResolveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`reports/${id}/resolve`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report resolved");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to resolve report"),
  });
}

export function useDismissReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`reports/${id}/dismiss`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report dismissed");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to dismiss report"),
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
      toast.success("App created");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create app"),
  });
}
