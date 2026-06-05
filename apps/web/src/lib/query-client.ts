"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * Determine whether a React Query failure should be retried.
 *
 * We disable retry for 401 / 403 responses because the Axios response
 * interceptor in lib/axios.ts already owns token refresh + request retry:
 *   1. 401 received → interceptor refreshes the access token
 *   2. Original request is retried with the new token automatically
 *
 * If React Query ALSO retries, it creates a second concurrent refresh
 * call that invalidates the rotated refresh token (server uses token
 * rotation), causing every subsequent request to fail permanently.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 401 || status === 403) return false;
  return failureCount < 2;
}

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: shouldRetry,
      },
      mutations: {
        // Mutations are one-shot — never auto-retry on the client.
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
