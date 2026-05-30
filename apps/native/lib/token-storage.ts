import * as SecureStore from "expo-secure-store";

const KEYS = {
  accessToken: "zd_access_token",
  refreshToken: "zd_refresh_token",
  userId: "zd_user_id",
  user: "zd_user",
} as const;

export async function saveTokens(accessToken: string, refreshToken: string) {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.accessToken, accessToken),
    SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.accessToken);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.refreshToken);
}

export async function saveUser(user: object) {
  await SecureStore.setItemAsync(KEYS.user, JSON.stringify(user));
}

export async function getUser<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function clearAll() {
  await Promise.all(Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k)));
}
