import db from "@zimdesigns/db";

function sanitize(c: {
  id: string;
  body: string;
  createdAt: Date;
  author: { id: string; name: string; username: string; avatarUrl: string | null };
}) {
  return {
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    author: c.author,
  };
}

export async function listComments(redesignId: string) {
  const comments = await db.comment.findMany({
    where: { redesignId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });
  return comments.map(sanitize);
}

export async function createComment(redesignId: string, authorId: string, body: string) {
  const redesign = await db.redesign.findUniqueOrThrow({ where: { id: redesignId } });

  const comment = await db.comment.create({
    data: { body: body.trim(), authorId, redesignId },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true } },
    },
  });

  if (redesign.authorId !== authorId) {
    const commenter = await db.user.findUniqueOrThrow({ where: { id: authorId }, select: { username: true } });
    await db.notification.create({
      data: {
        userId: redesign.authorId,
        type: "comment",
        body: `@${commenter.username} commented on your redesign: "${body.slice(0, 60)}${body.length > 60 ? "…" : ""}"`,
        refId: redesignId,
      },
    });
  }

  return sanitize(comment);
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await db.comment.findUniqueOrThrow({ where: { id: commentId } });
  if (comment.authorId !== userId) throw new Error("FORBIDDEN");
  await db.comment.delete({ where: { id: commentId } });
}
