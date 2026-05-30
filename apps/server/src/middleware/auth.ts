import type { Context, Next } from "hono";
import { verifyAccessToken } from "../lib/jwt";

export interface AuthVariables {
  userId: string;
  userEmail: string;
}

export async function requireAuth(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ message: "Missing or malformed Authorization header" }, 401);
  }

  const token = header.slice(7);
  try {
    const payload = await verifyAccessToken(token);
    c.set("userId", payload.sub);
    c.set("userEmail", payload.email);
    return next();
  } catch {
    return c.json({ message: "Invalid or expired access token" }, 401);
  }
}

export async function optionalAuth(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const header = c.req.header("Authorization");
  if (header?.startsWith("Bearer ")) {
    const token = header.slice(7);
    try {
      const payload = await verifyAccessToken(token);
      c.set("userId", payload.sub);
      c.set("userEmail", payload.email);
    } catch {
      // no-op — unauthenticated is fine for optional routes
    }
  }
  return next();
}
