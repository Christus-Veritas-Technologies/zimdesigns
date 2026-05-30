import { Hono } from "hono";
import { env } from "@zimdesigns/env/server";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  register,
  login,
  refresh,
  logout,
  findOrCreateGoogleUser,
  buildGoogleAuthUrl,
  exchangeGoogleCode,
} from "../services/auth";

const router = new Hono();

// ── Password auth ────────────────────────────────────────────────────────────

router.post(
  "/register",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      name: z.string().min(1).max(100),
      username: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/i),
      password: z.string().min(8).max(128),
    }),
  ),
  async (c) => {
    const body = c.req.valid("json");
    try {
      const result = await register(body);
      return c.json(result, 201);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "EMAIL_TAKEN") return c.json({ message: "That email is already registered" }, 409);
      if (msg === "USERNAME_TAKEN") return c.json({ message: "That username is taken" }, 409);
      console.error("register:", err);
      return c.json({ message: "Internal server error" }, 500);
    }
  },
);

router.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");
    try {
      const result = await login(email, password);
      return c.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "INVALID_CREDENTIALS" || msg === "GOOGLE_ACCOUNT") {
        return c.json({ message: "Invalid email or password" }, 401);
      }
      console.error("login:", err);
      return c.json({ message: "Internal server error" }, 500);
    }
  },
);

router.post(
  "/refresh",
  zValidator("json", z.object({ refreshToken: z.string() })),
  async (c) => {
    const { refreshToken } = c.req.valid("json");
    try {
      const tokens = await refresh(refreshToken);
      return c.json(tokens);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "INVALID_REFRESH_TOKEN" || msg === "REFRESH_TOKEN_EXPIRED") {
        return c.json({ message: "Invalid or expired refresh token" }, 401);
      }
      return c.json({ message: "Internal server error" }, 500);
    }
  },
);

router.post(
  "/logout",
  zValidator("json", z.object({ refreshToken: z.string() })),
  async (c) => {
    const { refreshToken } = c.req.valid("json");
    await logout(refreshToken);
    return c.body(null, 204);
  },
);

// ── Google OAuth ─────────────────────────────────────────────────────────────
// The state param carries an optional "platform" flag so the callback knows
// whether to redirect to the web app or trigger a native deep link.

router.get("/google", (c) => {
  const platform = c.req.query("platform") ?? "web";
  const state = JSON.stringify({ platform, nonce: crypto.randomUUID() });
  const stateEncoded = Buffer.from(state).toString("base64url");
  return c.redirect(buildGoogleAuthUrl(stateEncoded));
});

router.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  const stateRaw = c.req.query("state") ?? "";

  if (!code) return c.redirect(`${env.WEB_URL}/auth/error?reason=no_code`);

  let platform = "web";
  try {
    const decoded = JSON.parse(Buffer.from(stateRaw, "base64url").toString());
    platform = decoded.platform ?? "web";
  } catch {
    // keep default
  }

  try {
    const profile = await exchangeGoogleCode(code);
    const result = await findOrCreateGoogleUser(profile);

    const { tokens, user } = result;
    const params = new URLSearchParams({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      onboardingComplete: String(user.onboardingComplete),
    });

    if (platform === "native") {
      // Web page handles deep-link redirect back to the app
      return c.redirect(`${env.WEB_URL}/auth/native-callback?${params}`);
    }
    return c.redirect(`${env.WEB_URL}/auth/callback?${params}`);
  } catch (err) {
    console.error("google/callback:", err);
    return c.redirect(`${env.WEB_URL}/auth/error?reason=google_failed`);
  }
});

export default router;
