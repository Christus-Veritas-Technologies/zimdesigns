import db from "@zimdesigns/db";

function parseTags(raw: string) {
  try { return JSON.parse(raw); } catch { return []; }
}

export async function toggleBookmark(userId: string, redesignId: string) {
  const existing = await db.bookmark.findUnique({
    where: { userId_redesignId: { userId, redesignId } },
  });

  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await db.bookmark.create({ data: { userId, redesignId } });
  return { bookmarked: true };
}

export async function getBookmarkStatus(userId: string, redesignId: string) {
  const exists = await db.bookmark.findUnique({
    where: { userId_redesignId: { userId, redesignId } },
  });
  return { bookmarked: !!exists };
}

export async function listBookmarks(userId: string) {
  const bookmarks = await db.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      redesign: {
        include: {
          author: { select: { id: true, name: true, username: true, avatarUrl: true } },
          upvotes: { where: { userId } },
        },
      },
    },
  });

  return bookmarks.map(({ redesign: r }) => ({
    id: r.id, title: r.title, appName: r.appName, description: r.description,
    beforeUrl: r.beforeUrl, afterUrl: r.afterUrl,
    tags: parseTags(r.tags),
    upvoteCount: r.upvoteCount, createdAt: r.createdAt,
    author: r.author,
    hasUpvoted: r.upvotes.length > 0,
    bookmarked: true,
  }));
}
