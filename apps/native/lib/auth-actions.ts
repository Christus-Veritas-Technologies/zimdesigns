/**
 * Global bridge so the axios interceptor (which has no access to React context)
 * can call the AuthContext's clearAuth when a token refresh fails.
 *
 * Usage:
 *   AuthProvider registers its clearAuth via registerClearAuth() on mount.
 *   The axios interceptor calls globalClearAuth() on unrecoverable 401s.
 */

let _clearAuth: (() => Promise<void>) | null = null;

export function registerClearAuth(fn: () => Promise<void>): void {
  _clearAuth = fn;
}

export async function globalClearAuth(): Promise<void> {
  if (_clearAuth) {
    await _clearAuth();
  } else {
    // Fallback if context isn't mounted yet — at least wipe SecureStore.
    const { clearAll } = await import("./token-storage");
    await clearAll();
  }
}
