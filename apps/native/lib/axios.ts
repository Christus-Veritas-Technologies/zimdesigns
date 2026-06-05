import axios from "axios";
import { env } from "@zimdesigns/env/native";
import { getAccessToken, getRefreshToken, saveTokens } from "./token-storage";
import { globalClearAuth } from "./auth-actions";

export const api = axios.create({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
          const refreshToken = await getRefreshToken();
          if (!refreshToken) { await globalClearAuth(); return null; }

          const res = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${env.EXPO_PUBLIC_SERVER_URL}/api/auth/refresh`,
            { refreshToken },
          );
          await saveTokens(res.data.accessToken, res.data.refreshToken);
          return res.data.accessToken;
        } catch {
          // Clear both SecureStore and the AuthContext React state so the UI
          // immediately reflects the logged-out state (isAuthenticated = false).
          await globalClearAuth();
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
