import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { router } from "expo-router";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const { status: requested } = await Notifications.requestPermissionsAsync();
    status = requested;
  }
  if (status !== "granted") return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  return token.data;
}

export function usePushNotifications() {
  const { isAuthenticated } = useAuth();
  const registered = useRef(false);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!isAuthenticated || registered.current) return;
    registered.current = true;

    getExpoPushToken()
      .then((token) => {
        if (token) {
          api.post("/api/me/push-token", { token }).catch(() => {});
        }
      })
      .catch(() => {});

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string> | undefined;
      if (!data) return;
      if (data.type === "comment" && data.redesignId) {
        router.push(`/redesigns/${data.redesignId}` as never);
      } else if (data.type === "upvote" && data.redesignId) {
        router.push(`/redesigns/${data.redesignId}` as never);
      } else if (data.type === "follow") {
        router.push("/notifications" as never);
      }
    });

    return () => {
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);
}
