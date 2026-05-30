import { env } from "@zimdesigns/env/server";
import { sign, verify } from "hono/jwt";

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

function durationToSeconds(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60;
  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * multipliers[match[2]];
}

export async function signAccessToken(userId: string, email: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + durationToSeconds(env.JWT_ACCESS_EXPIRES_IN);
  const payload: AccessTokenPayload & { exp: number; iat: number } = {
    sub: userId,
    email,
    type: "access",
    iat: Math.floor(Date.now() / 1000),
    exp,
  };
  return sign(payload, env.JWT_ACCESS_SECRET);
}

export async function signRefreshToken(userId: string, jti: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + durationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
  const payload: RefreshTokenPayload & { exp: number; iat: number } = {
    sub: userId,
    jti,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
    exp,
  };
  return sign(payload, env.JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const payload = await verify(token, env.JWT_ACCESS_SECRET);
  if ((payload as AccessTokenPayload).type !== "access") throw new Error("Invalid token type");
  return payload as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const payload = await verify(token, env.JWT_REFRESH_SECRET);
  if ((payload as RefreshTokenPayload).type !== "refresh") throw new Error("Invalid token type");
  return payload as RefreshTokenPayload;
}

export function refreshTokenExpiry(): Date {
  return new Date(Date.now() + durationToSeconds(env.JWT_REFRESH_EXPIRES_IN) * 1000);
}
