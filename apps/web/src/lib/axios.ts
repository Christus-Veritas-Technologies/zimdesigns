import axios from "axios";
import { env } from "@zimdesigns/env/web";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request.
// Primary: read from the in-memory Zustand store (updated synchronously on login/logout).
// Fallback: read directly from localStorage in case the persist middleware hasn't rehydrated yet
// (can happen if the page was refreshed and a mutation fires before the first rehydration tick).
api.interceptors.request.use((config) => {
  let token = useAuthStore.getState().accessToken;
  if (!token && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("zd-auth");
      if (raw) token = (JSON.parse(raw) as { state?: { accessToken?: string } })?.state?.accessToken ?? null;
    } catch {}
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    original._retry = true;

    if (!refreshing) {
      refreshing = (async () => {
        try {
          const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();
          if (!refreshToken) { clearAuth(); return null; }

          const res = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh`,
            { refreshToken },
          );
          setTokens(res.data.accessToken, res.data.refreshToken);
          return res.data.accessToken;
        } catch {
          useAuthStore.getState().clearAuth();
          return null;
        } finally {
          refreshing = null;
        }
      })();
    }

    const newToken = await refreshing;
    if (!newToken) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  },
);
