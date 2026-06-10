import db from "@zimdesigns/db";
import { env } from "@zimdesigns/env/server";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshTokenExpiry,
} from "../lib/jwt";
import { hashPassword, verifyPassword } from "../lib/password";
import { sendEmail, passwordResetEmail, verificationEmail } from "../lib/email";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
  role: string | null;
}

export interface AuthResult {
  user: SafeUser;
  tokens: AuthTokens;
}

export async function register(input: {
  email: string;
  name: string;
  username: string;
  password: string;
}): Promise<AuthResult> {
  const emailLower = input.email.toLowerCase().trim();
  const usernameLower = input.username.toLowerCase().trim();

  const [existingEmail, existingUsername] = await Promise.all([
    db.user.findUnique({ where: { email: emailLower } }),
    db.user.findUnique({ where: { username: usernameLower } }),
  ]);

  if (existingEmail) throw new Error("EMAIL_TAKEN");
  if (existingUsername) throw new Error("USERNAME_TAKEN");

  const passwordHash = await hashPassword(input.password);

  const user = await db.user.create({
    data: {
      email: emailLower,
      name: input.name.trim(),
      username: usernameLower,
      passwordHash,
    },
  });

  return buildAuthResult(user);
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  if (!user.passwordHash) throw new Error("GOOGLE_ACCOUNT");

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  return buildAuthResult(user);
}

export async function refresh(incomingToken: string): Promise<AuthTokens> {
  let payload;
  try {
    payload = await verifyRefreshToken(incomingToken);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const stored = await db.refreshToken.findUnique({ where: { token: incomingToken } });
  if (!stored || stored.userId !== payload.sub) throw new Error("INVALID_REFRESH_TOKEN");
  if (stored.expiresAt < new Date()) {
    await db.refreshToken.delete({ where: { id: stored.id } });
    throw new Error("REFRESH_TOKEN_EXPIRED");
  }

  // Rotate: delete old, issue new pair
  await db.refreshToken.delete({ where: { id: stored.id } });

  const user = await db.user.findUniqueOrThrow({ where: { id: payload.sub } });
  return issueTokenPair(user.id, user.email);
}

export async function logout(refreshToken: string): Promise<void> {
  await db.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<AuthResult> {
  const emailLower = profile.email.toLowerCase().trim();

  let user = await db.user.findUnique({ where: { googleId: profile.googleId } });

  if (!user) {
    const byEmail = await db.user.findUnique({ where: { email: emailLower } });
    if (byEmail) {
      user = await db.user.update({
        where: { id: byEmail.id },
        data: {
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl ?? byEmail.avatarUrl,
          emailVerified: true,
        },
      });
    } else {
      const username = await uniqueUsername(
        emailLower.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase().slice(0, 20) || "user",
      );
      user = await db.user.create({
        data: {
          email: emailLower,
          name: profile.name,
          username,
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl,
          emailVerified: true,
        },
      });
    }
  }

  return buildAuthResult(user);
}

// ── internal helpers ────────────────────────────────────────────────────────

async function buildAuthResult(user: {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
  role?: string | null;
}): Promise<AuthResult> {
  const tokens = await issueTokenPair(user.id, user.email);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      onboardingComplete: user.onboardingComplete,
      emailVerified: user.emailVerified,
      role: user.role ?? null,
    },
    tokens,
  };
}

async function issueTokenPair(userId: string, email: string): Promise<AuthTokens> {
  const jti = crypto.randomUUID();
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(userId, email),
    signRefreshToken(userId, jti),
  ]);

  await db.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt: refreshTokenExpiry() },
  });

  return { accessToken, refreshToken };
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  let i = 0;
  while (true) {
    const taken = await db.user.findUnique({ where: { username: candidate } });
    if (!taken) return candidate;
    candidate = `${base}${++i}`;
  }
}

// ── Password reset ───────────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.passwordHash) return; // silently ignore unknown emails or Google-only accounts

  // Invalidate any existing tokens
  await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await db.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });

  const resetUrl = `${env.WEB_URL}/auth/reset-password?token=${token}`;
  await sendEmail({ ...passwordResetEmail(user.name, resetUrl), to: user.email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const record = await db.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.used || record.expiresAt < new Date()) {
    await db.passwordResetToken.deleteMany({ where: { token } });
    throw new Error("INVALID_TOKEN");
  }

  const newHash = await hashPassword(newPassword);
  await Promise.all([
    db.user.update({ where: { id: record.userId }, data: { passwordHash: newHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { used: true } }),
    db.refreshToken.deleteMany({ where: { userId: record.userId } }),
  ]);
}

// ── Email verification ───────────────────────────────────────────────────────

export async function sendVerificationEmail(userId: string): Promise<void> {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.emailVerified) return;

  await db.emailVerificationToken.deleteMany({ where: { userId } });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await db.emailVerificationToken.create({ data: { token, userId, expiresAt } });

  // Derive the server origin from GOOGLE_CALLBACK_URL without any string-slicing
  // fragility — new URL().origin always returns the bare protocol+host.
  const serverOrigin = new URL(env.GOOGLE_CALLBACK_URL).origin;
  const serverVerifyUrl = `${serverOrigin}/api/auth/verify-email?token=${token}`;
  await sendEmail({ ...verificationEmail(user.name, serverVerifyUrl), to: user.email });
}

export async function verifyEmail(token: string): Promise<void> {
  const record = await db.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) throw new Error("INVALID_TOKEN");

  await Promise.all([
    db.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
    db.emailVerificationToken.delete({ where: { id: record.id } }),
  ]);
}

// Google OAuth URL builder
export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code: string): Promise<{
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) throw new Error("GOOGLE_TOKEN_EXCHANGE_FAILED");

  const tokenData = await tokenRes.json() as { id_token: string; access_token: string };

  const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!infoRes.ok) throw new Error("GOOGLE_USERINFO_FAILED");

  const info = await infoRes.json() as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  };

  return {
    googleId: info.sub,
    email: info.email,
    name: info.name,
    avatarUrl: info.picture,
  };
}
