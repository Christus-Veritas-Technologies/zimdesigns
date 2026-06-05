/**
 * JWT helpers — uses `jose` instead of `hono/jwt`.
 *
 * hono/jwt delegates to the Web Crypto API which has known inconsistencies
 * on Bun's runtime (sign and verify can produce mismatched results with
 * plain-string secrets).  jose is the industry-standard JWT library, tested
 * on Node, Bun, Deno, and edge runtimes, and is the correct choice here.
 */

import { SignJWT, jwtVerify } from "jose";
import { env } from "@zimdesigns/env/server";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: "refresh";
}

/** Convert the secret string to a Uint8Array key for jose. */
function accessKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_ACCESS_SECRET);
}

function refreshKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_REFRESH_SECRET);
}

/** Parse a duration string like "15m", "1h", "30d" into seconds. */
function durationToSeconds(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60;
  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * multipliers[match[2]];
}

export async function signAccessToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ email, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${durationToSeconds(env.JWT_ACCESS_EXPIRES_IN)}s`)
    .sign(accessKey());
}

export async function signRefreshToken(userId: string, jti: string): Promise<string> {
  return new SignJWT({ jti, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${durationToSeconds(env.JWT_REFRESH_EXPIRES_IN)}s`)
    .sign(refreshKey());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, accessKey(), { algorithms: ["HS256"] });
  if (payload.type !== "access") throw new Error("Invalid token type");
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    type: "access",
  };
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, refreshKey(), { algorithms: ["HS256"] });
  if (payload.type !== "refresh") throw new Error("Invalid token type");
  return {
    sub: payload.sub as string,
    jti: payload.jti as string,
    type: "refresh",
  };
}

export function refreshTokenExpiry(): Date {
  return new Date(Date.now() + durationToSeconds(env.JWT_REFRESH_EXPIRES_IN) * 1000);
}

// Used only by the email-verification route which has its own inline auth check.
export async function verifyJwt(token: string, type: "access" | "refresh") {
  const key = type === "access" ? accessKey() : refreshKey();
  const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
  return { userId: payload.sub as string };
}
