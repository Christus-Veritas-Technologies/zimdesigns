import db from "@zimdesigns/db";
import { uploadToR2 } from "../lib/r2";

export interface ProfileUpdate {
  name?: string;
  username?: string;
  bio?: string;
  role?: "designer" | "developer" | "both";
  avatarFile?: File;
  linkedinUrl?: string;
  githubUrl?: string;
  dribbbleUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export async function getMe(userId: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  return sanitize(user);
}

export async function updateProfile(userId: string, data: ProfileUpdate) {
  if (data.username) {
    const taken = await db.user.findFirst({
      where: { username: data.username, NOT: { id: userId } },
    });
    if (taken) throw new Error("USERNAME_TAKEN");
  }

  let avatarUrl: string | undefined;
  if (data.avatarFile) {
    avatarUrl = await uploadToR2(data.avatarFile, "avatars");
  }

  const user = await db.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.username !== undefined && { username: data.username.toLowerCase().trim() }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.role !== undefined && { role: data.role }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl || null }),
      ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl || null }),
      ...(data.dribbbleUrl !== undefined && { dribbbleUrl: data.dribbbleUrl || null }),
      ...(data.twitterUrl !== undefined && { twitterUrl: data.twitterUrl || null }),
      ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl || null }),
    },
  });

  return sanitize(user);
}

export async function updateInterests(userId: string, interests: string[]) {
  const user = await db.user.update({
    where: { id: userId },
    data: { interests: JSON.stringify(interests) },
  });
  return sanitize(user);
}

export async function completeOnboarding(userId: string) {
  const user = await db.user.update({
    where: { id: userId },
    data: { onboardingComplete: true },
  });
  return sanitize(user);
}

function sanitize(user: {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string | null;
  interests: string;
  onboardingComplete: boolean;
  linkedinUrl: string | null;
  githubUrl: string | null;
  dribbbleUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role as "designer" | "developer" | "both" | null,
    interests: safeParseInterests(user.interests),
    onboardingComplete: user.onboardingComplete,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    dribbbleUrl: user.dribbbleUrl,
    twitterUrl: user.twitterUrl,
    websiteUrl: user.websiteUrl,
    createdAt: user.createdAt,
  };
}

function safeParseInterests(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
