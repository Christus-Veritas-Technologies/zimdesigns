import axios from "axios";
import { env } from "@zimdesigns/env/web";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attach the in-memory access token to every outgoing request.
// AuthInit (in Providers) reads from localStorage on mount and populates
// the store before any user-triggered request can fire, so no localStorage
// fallback is needed here — the store is the single source of truth.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — token refresh ──────────────────────────────────────
// On 401, attempt a token refresh once, then retry the original request.
// The `refreshing` singleton ensures only one refresh call fires even when
// multiple concurrent requests receive 401 simultaneously.
let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Only intercept 401s that haven't already been retried.
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (!refreshing) {
      refreshing = (async () => {
        try {
          const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

          // No refresh token — session is gone; clear everything and bail.
          if (!refreshToken) {
            clearAuth();
            return null;
          }

          const res = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh`,
            { refreshToken },
          );

          // Persist new tokens to both localStorage and the in-memory store.
          setTokens(res.data.accessToken, res.data.refreshToken);
          return res.data.accessToken;
        } catch {
          // Refresh failed (e.g. token rotated by another tab, or truly expired).
          // Clear auth so the UI switches to signed-out state.
          useAuthStore.getState().clearAuth();
          return null;
        } finally {
          refreshing = null;
        }
      })();
    }

    const newToken = await refreshing;
    if (!newToken) return Promise.reject(error);

    // Retry the original request with the fresh token.
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  },
);
