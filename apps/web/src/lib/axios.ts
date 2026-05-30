import axios from "axios";
import { env } from "@zimdesigns/env/web";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
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
