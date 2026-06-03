import db from "@zimdesigns/db";
import { uploadToR2 } from "../lib/r2";
import { sendPushNotification } from "../lib/push";

export interface RedesignInput {
  title: string;
  appName: string;
  description?: string;
  tags: string[];
  beforeFile: File;
  afterFile: File;
  screenshotFiles?: File[];
  figmaUrl?: string;
  githubUrl?: string;
  prototypeUrl?: string;
}

export interface RedesignFilters {
  tag?: string;
  category?: string;
  appName?: string;
  role?: string;
  sort?: "recent" | "top";
  cursor?: string;
  limit?: number;
}

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sanitize(
  r: { id: string; title: string; appName: string; description: string | null; beforeUrl: string; afterUrl: string; screenshots?: string; figmaUrl?: string | null; githubUrl?: string | null; prototypeUrl?: string | null; tags: string; upvoteCount: number; createdAt: Date; authorId: string },
  author: { id: string; name: string; username: string; avatarUrl: string | null; role?: string | null },
  hasUpvoted = false,
  commentCount = 0,
) {
  return {
    id: r.id,
    title: r.title,
    appName: r.appName,
    description: r.description,
    beforeUrl: r.beforeUrl,
    afterUrl: r.afterUrl,
    screenshots: parseTags(r.screenshots ?? "[]"),
    figmaUrl: r.figmaUrl ?? null,
    githubUrl: r.githubUrl ?? null,
    prototypeUrl: r.prototypeUrl ?? null,
    tags: parseTags(r.tags),
    upvoteCount: r.upvoteCount,
    commentCount,
    createdAt: r.createdAt,
    author: { id: author.id, name: author.name, username: author.username, avatarUrl: author.avatarUrl, role: author.role ?? null },
    hasUpvoted,
  };
}

export async function listRedesigns(filters: RedesignFilters, viewerId?: string) {
  const limit = Math.min(filters.limit ?? 20, 50);

  const where: Record<string, unknown> = {};
  if (filters.tag) where.tags = { contains: filters.tag };
  if (filters.category) where.tags = { contains: filters.category };
  if (filters.appName) where.appName = { equals: filters.appName, mode: "insensitive" };
  if (filters.role) where.author = { role: filters.role };

  const items = await db.redesign.findMany({
    take: limit + 1,
    ...(filters.cursor && { skip: 1, cursor: { id: filters.cursor } }),
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: filters.sort === "top" ? { upvoteCount: "desc" } : { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true, role: true } },
      _count: { select: { comments: true } },
      ...(viewerId && { upvotes: { where: { userId: viewerId } } }),
    },
  });

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? page[page.length - 1]?.id : undefined;

  return {
    items: page.map((r) =>
      sanitize(
        r, r.author,
        viewerId ? (r as typeof r & { upvotes: { id: string }[] }).upvotes.length > 0 : false,
        (r as typeof r & { _count: { comments: number } })._count.comments,
      ),
    ),
    nextCursor,
  };
}

export async function getRedesign(id: string, viewerId?: string) {
  const r = await db.redesign.findUniqueOrThrow({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true, role: true } },
      _count: { select: { comments: true } },
      ...(viewerId && { upvotes: { where: { userId: viewerId } } }),
    },
  });
  return sanitize(
    r, r.author,
    viewerId ? (r as typeof r & { upvotes: { id: string }[] }).upvotes.length > 0 : false,
    (r as typeof r & { _count: { comments: number } })._count.comments,
  );
}

export async function createRedesign(authorId: string, input: RedesignInput) {
  const uploads: Promise<string>[] = [
    uploadToR2(input.beforeFile, "redesigns/before"),
    uploadToR2(input.afterFile, "redesigns/after"),
    ...(input.screenshotFiles ?? []).map((f) => uploadToR2(f, "redesigns/screenshots")),
  ];
  const [beforeUrl, afterUrl, ...screenshotUrls] = await Promise.all(uploads);

  const r = await db.redesign.create({
    data: {
      title: input.title.trim(),
      appName: input.appName.trim(),
      description: input.description?.trim() ?? null,
      tags: JSON.stringify(input.tags),
      beforeUrl,
      afterUrl,
      screenshots: JSON.stringify(screenshotUrls),
      figmaUrl: input.figmaUrl?.trim() || null,
      githubUrl: input.githubUrl?.trim() || null,
      prototypeUrl: input.prototypeUrl?.trim() || null,
      authorId,
    },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });

  return sanitize(r, r.author, false);
}

export async function toggleUpvote(redesignId: string, userId: string) {
  const existing = await db.upvote.findUnique({
    where: { userId_redesignId: { userId, redesignId } },
  });

  if (existing) {
    await db.upvote.delete({ where: { id: existing.id } });
    const r = await db.redesign.update({
      where: { id: redesignId },
      data: { upvoteCount: { decrement: 1 } },
    });
    return { upvoteCount: r.upvoteCount, hasUpvoted: false };
  }

  await db.upvote.create({ data: { userId, redesignId } });
  const r = await db.redesign.update({
    where: { id: redesignId },
    data: { upvoteCount: { increment: 1 } },
    include: { author: { select: { id: true, pushToken: true } } },
  });

  if (r.author.id !== userId) {
    const voter = await db.user.findUniqueOrThrow({ where: { id: userId }, select: { username: true } });
    await sendPushNotification(r.author.pushToken, {
      title: "New upvote",
      body: `@${voter.username} upvoted your redesign "${r.title.slice(0, 40)}${r.title.length > 40 ? "…" : ""}"`,
      data: { type: "upvote", redesignId },
    });
  }

  return { upvoteCount: r.upvoteCount, hasUpvoted: true };
}

export async function deleteRedesign(id: string, userId: string) {
  const r = await db.redesign.findUniqueOrThrow({ where: { id } });
  if (r.authorId !== userId) throw new Error("FORBIDDEN");
  await db.redesign.delete({ where: { id } });
}
