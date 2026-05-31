interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: "default" | null;
}

export async function sendPushNotification(token: string | null | undefined, message: Omit<PushMessage, "to">): Promise<void> {
  if (!token?.startsWith("ExponentPushToken[")) return;

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ to: token, sound: "default", ...message }),
    });
  } catch {
    // Push notifications are best-effort; never throw
  }
}
