import db from "@zimdesigns/db";

function parseTags(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function parseBrokenItems(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export async function listAppEntries() {
  const entries = await db.appEntry.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
  });
  return entries.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    iconColor: e.iconColor,
    iconLetter: e.iconLetter,
    description: e.description,
    tags: parseTags(e.tags),
    screenshotUrl: e.screenshotUrl,
  }));
}

export async function getAppEntry(slug: string) {
  const entry = await db.appEntry.findUniqueOrThrow({ where: { slug } });

  const redesigns = await db.redesign.findMany({
    where: { appName: { equals: entry.name, mode: "insensitive" } },
    orderBy: { upvoteCount: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true, role: true } },
      _count: { select: { comments: true } },
    },
  });

  const totalVotes = redesigns.reduce((s, r) => s + r.upvoteCount, 0);
  const uniqueDesigners = new Set(redesigns.map((r) => r.authorId)).size;

  return {
    id: entry.id,
    slug: entry.slug,
    name: entry.name,
    iconColor: entry.iconColor,
    iconLetter: entry.iconLetter,
    description: entry.description,
    tags: parseTags(entry.tags),
    brokenItems: parseBrokenItems(entry.brokenItems),
    screenshotUrl: entry.screenshotUrl,
    stats: {
      redesignCount: redesigns.length,
      totalVotes,
      designerCount: uniqueDesigners,
    },
    redesigns: redesigns.map((r) => ({
      id: r.id,
      title: r.title,
      appName: r.appName,
      description: r.description,
      beforeUrl: r.beforeUrl,
      afterUrl: r.afterUrl,
      tags: parseTags(r.tags),
      upvoteCount: r.upvoteCount,
      commentCount: (r as typeof r & { _count: { comments: number } })._count.comments,
      createdAt: r.createdAt,
      author: { ...r.author, role: r.author.role ?? null },
      hasUpvoted: false,
    })),
  };
}
