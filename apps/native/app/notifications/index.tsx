import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Bell, CheckCheck } from "lucide-react-native";
import { useNotifications, useMarkAllRead, type Notification } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/auth-context";

const TYPE_ICON: Record<string, string> = { comment: "💬", upvote: "↑" };

function NotificationItem({ item }: { item: Notification }) {
  return (
    <TouchableOpacity
      onPress={() => item.refId && router.push(`/redesigns/${item.refId}` as never)}
      activeOpacity={item.refId ? 0.7 : 1}
      className={`flex-row items-start gap-3 px-4 py-3.5 border-b border-border ${item.read ? "bg-card" : "bg-primary/5"}`}
    >
      <View className="w-8 h-8 rounded-full bg-muted items-center justify-center flex-none mt-0.5">
        <Text className="text-base">{TYPE_ICON[item.type] ?? "🔔"}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm text-foreground leading-snug">{item.body}</Text>
        <Text className="text-xs text-muted-foreground mt-1">
          {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      {!item.read && (
        <View className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-none" />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { isAuthenticated } = useAuth();
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
  const markAll = useMarkAllRead();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center mb-4">
          <Bell size={24} color="#8A8278" />
        </View>
        <Text className="font-semibold text-foreground text-base mb-1">Sign in to see notifications</Text>
        <Text className="text-muted-foreground text-sm text-center mb-4">Get notified when someone upvotes or comments on your work.</Text>
        <TouchableOpacity onPress={() => router.push("/auth/login" as never)} activeOpacity={0.8} className="px-5 py-2.5 rounded-xl bg-primary">
          <Text className="text-white font-semibold text-sm">Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  // Auto-mark all as read when page loads
  useEffect(() => {
    if (notifications?.some((n) => !n.read)) markAll.mutate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-3 border-b border-border bg-background">
        <View className="flex-row items-center gap-2">
          <Bell size={20} color="#2A2410" />
          <Text className="text-[1.4rem] font-extrabold text-foreground tracking-tight" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            Notifications
          </Text>
          {unread > 0 && (
            <View className="px-2 py-0.5 rounded-full bg-primary">
              <Text className="text-xs font-semibold text-primary-foreground">{unread}</Text>
            </View>
          )}
        </View>
        {unread > 0 && (
          <TouchableOpacity
            onPress={() => markAll.mutate()}
            disabled={markAll.isPending}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5"
          >
            <CheckCheck size={14} color="#8A8278" />
            <Text className="text-xs text-muted-foreground font-medium">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8A900" />
        </View>
      )}

      {!isLoading && notifications?.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Bell size={32} color="#8A8278" />
          <Text className="font-semibold text-foreground mt-3 mb-1">All caught up</Text>
          <Text className="text-sm text-muted-foreground text-center">Notifications for upvotes and comments appear here.</Text>
        </View>
      )}

      {notifications && notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#E8A900" />
          }
        />
      )}
    </View>
  );
}
