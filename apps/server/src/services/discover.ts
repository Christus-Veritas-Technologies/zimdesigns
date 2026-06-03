import db from "@zimdesigns/db";

function parseJson(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getFeaturedCollections() {
  const collections = await db.collection.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 9,
    include: {
      curator: { select: { id: true, name: true, username: true, avatarUrl: true } },
      items: {
        orderBy: { order: "asc" },
        take: 1,
        include: {
          redesign: { select: { afterUrl: true } },
        },
      },
      _count: { select: { items: true } },
    },
  });

  return collections.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    coverImageUrl: c.coverImageUrl ?? c.items[0]?.redesign.afterUrl ?? null,
    isFeatured: c.isFeatured,
    redesignCount: c._count.items,
    curator: c.curator,
  }));
}

export async function getActiveChallenges() {
  const challenges = await db.challenge.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return challenges.map((ch) => ({
    id: ch.id,
    title: ch.title,
    slug: ch.slug,
    description: ch.description,
    gradientFrom: ch.gradientFrom,
    gradientTo: ch.gradientTo,
    appName: ch.appName,
  }));
}
