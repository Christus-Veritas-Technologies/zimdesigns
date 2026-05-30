import db from "@zimdesigns/db";
import { uploadToR2 } from "../lib/r2";

export interface RedesignInput {
  title: string;
  appName: string;
  description?: string;
  tags: string[];
  beforeFile: File;
  afterFile: File;
}

export interface RedesignFilters {
  tag?: string;
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
  r: { id: string; title: string; appName: string; description: string | null; beforeUrl: string; afterUrl: string; tags: string; upvoteCount: number; createdAt: Date; authorId: string },
  author: { id: string; name: string; username: string; avatarUrl: string | null },
  hasUpvoted = false,
) {
  return {
    id: r.id,
    title: r.title,
    appName: r.appName,
    description: r.description,
    beforeUrl: r.beforeUrl,
    afterUrl: r.afterUrl,
    tags: parseTags(r.tags),
    upvoteCount: r.upvoteCount,
    createdAt: r.createdAt,
    author: { id: author.id, name: author.name, username: author.username, avatarUrl: author.avatarUrl },
    hasUpvoted,
  };
}

export async function listRedesigns(filters: RedesignFilters, viewerId?: string) {
  const limit = Math.min(filters.limit ?? 20, 50);

  const items = await db.redesign.findMany({
    take: limit + 1,
    ...(filters.cursor && { skip: 1, cursor: { id: filters.cursor } }),
    where: filters.tag ? { tags: { contains: filters.tag } } : undefined,
    orderBy: filters.sort === "top" ? { upvoteCount: "desc" } : { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
      ...(viewerId && { upvotes: { where: { userId: viewerId } } }),
    },
  });

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? page[page.length - 1]?.id : undefined;

  return {
    items: page.map((r) =>
      sanitize(r, r.author, viewerId ? (r as typeof r & { upvotes: { id: string }[] }).upvotes.length > 0 : false),
    ),
    nextCursor,
  };
}

export async function getRedesign(id: string, viewerId?: string) {
  const r = await db.redesign.findUniqueOrThrow({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
      ...(viewerId && { upvotes: { where: { userId: viewerId } } }),
    },
  });
  return sanitize(
    r,
    r.author,
    viewerId ? (r as typeof r & { upvotes: { id: string }[] }).upvotes.length > 0 : false,
  );
}

export async function createRedesign(authorId: string, input: RedesignInput) {
  const [beforeUrl, afterUrl] = await Promise.all([
    uploadToR2(input.beforeFile, "redesigns/before"),
    uploadToR2(input.afterFile, "redesigns/after"),
  ]);

  const r = await db.redesign.create({
    data: {
      title: input.title.trim(),
      appName: input.appName.trim(),
      description: input.description?.trim() ?? null,
      tags: JSON.stringify(input.tags),
      beforeUrl,
      afterUrl,
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
  });
  return { upvoteCount: r.upvoteCount, hasUpvoted: true };
}

export async function deleteRedesign(id: string, userId: string) {
  const r = await db.redesign.findUniqueOrThrow({ where: { id } });
  if (r.authorId !== userId) throw new Error("FORBIDDEN");
  await db.redesign.delete({ where: { id } });
}
