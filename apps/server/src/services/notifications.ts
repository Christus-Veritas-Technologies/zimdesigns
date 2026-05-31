import db from "@zimdesigns/db";

export async function savePushToken(userId: string, token: string) {
  await db.user.update({ where: { id: userId }, data: { pushToken: token } });
}

export async function listNotifications(userId: string) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markAllRead(userId: string) {
  await db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function unreadCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } });
}
