/**
 * Thin localStorage wrapper for auth tokens — web equivalent of the
 * native app's SecureStore helpers in apps/native/lib/token-storage.ts.
 *
 * Tokens are stored under individual keys (not Zustand persist) to avoid
 * any rehydration race between the middleware's async read and the store's
 * in-memory state.  The Zustand store holds the same values in memory;
 * these functions are the authoritative on-disk representation.
 */

const KEYS = {
  accessToken: "zd_access_token",
  refreshToken: "zd_refresh_token",
  user: "zd_user",
} as const;

const isBrowser = () => typeof window !== "undefined";

export function saveTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.accessToken, accessToken);
  localStorage.setItem(KEYS.refreshToken, refreshToken);
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEYS.refreshToken);
}

export function saveUser(user: object): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function getStoredUser<T>(): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  // Remove the old Zustand persist key so it doesn't confuse anything.
  localStorage.removeItem("zd-auth");
}
