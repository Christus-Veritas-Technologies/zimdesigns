import db from "@zimdesigns/db";

export async function toggleFollow(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error("SELF_FOLLOW");

  const existing = await db.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
    return { following: false };
  }

  await db.follow.create({ data: { followerId, followingId } });

  const follower = await db.user.findUniqueOrThrow({ where: { id: followerId }, select: { username: true } });
  await db.notification.create({
    data: {
      userId: followingId,
      type: "follow",
      body: `@${follower.username} started following you.`,
      refId: followerId,
    },
  });

  return { following: true };
}

export async function getFollowStatus(followerId: string, followingId: string) {
  const exists = await db.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return { following: !!exists };
}

export async function getFollowers(username: string) {
  const user = await db.user.findUniqueOrThrow({ where: { username }, select: { id: true } });
  const follows = await db.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: { id: true, name: true, username: true, avatarUrl: true, bio: true } } },
    orderBy: { createdAt: "desc" },
  });
  return follows.map((f) => f.follower);
}

export async function getFollowing(username: string) {
  const user = await db.user.findUniqueOrThrow({ where: { username }, select: { id: true } });
  const follows = await db.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: { id: true, name: true, username: true, avatarUrl: true, bio: true } } },
    orderBy: { createdAt: "desc" },
  });
  return follows.map((f) => f.following);
}

export async function getFollowingFeed(userId: string, cursor?: string, limit = 20) {
  const cap = Math.min(limit, 50);
  const following = await db.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  if (followingIds.length === 0) return { items: [], nextCursor: undefined };

  const items = await db.redesign.findMany({
    take: cap + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
      upvotes: { where: { userId } },
    },
  });

  const hasMore = items.length > cap;
  const page = hasMore ? items.slice(0, cap) : items;
  return {
    items: page.map((r) => ({
      id: r.id, title: r.title, appName: r.appName, description: r.description,
      beforeUrl: r.beforeUrl, afterUrl: r.afterUrl,
      tags: (() => { try { return JSON.parse(r.tags); } catch { return []; } })(),
      upvoteCount: r.upvoteCount, createdAt: r.createdAt,
      author: r.author,
      hasUpvoted: r.upvotes.length > 0,
    })),
    nextCursor: hasMore ? page[page.length - 1]?.id : undefined,
  };
}
