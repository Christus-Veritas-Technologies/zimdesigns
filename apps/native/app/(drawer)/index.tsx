import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { ArrowUp, Flame, Clock, Plus } from "lucide-react-native";
import { useRedesigns, useUpvoteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

function UpvoteButton({ redesign }: { redesign: Redesign }) {
  const { isAuthenticated } = useAuth();
  const upvote = useUpvoteRedesign(redesign.id);

  return (
    <TouchableOpacity
      onPress={() => { if (isAuthenticated) upvote.mutate(); }}
      disabled={upvote.isPending}
      activeOpacity={0.7}
      className={`items-center px-2.5 py-2 rounded-xl border gap-0.5 ${
        redesign.hasUpvoted
          ? "border-primary bg-primary/10"
          : "border-border bg-card"
      }`}
    >
      <ArrowUp size={14} color={redesign.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
      <Text className={`text-xs font-semibold tabular-nums ${redesign.hasUpvoted ? "text-primary" : "text-muted-foreground"}`}>
        {redesign.upvoteCount}
      </Text>
    </TouchableOpacity>
  );
}

function RedesignCard({ item }: { item: Redesign }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="flex-row bg-card border border-border rounded-2xl overflow-hidden mb-3"
    >
      <Image
        source={{ uri: absoluteUrl(item.afterUrl) }}
        className="w-24 h-24"
        resizeMode="cover"
      />
      <View className="flex-1 px-3 py-2.5 gap-1">
        <Text className="font-semibold text-foreground text-sm leading-snug" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {item.appName} · @{item.author.username}
        </Text>
        {item.tags.length > 0 && (
          <View className="flex-row gap-1 flex-wrap mt-0.5">
            {item.tags.slice(0, 2).map((t) => (
              <Text key={t} className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {t}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View className="justify-center pr-3">
        <UpvoteButton redesign={item} />
      </View>
    </TouchableOpacity>
  );
}

type Sort = "recent" | "top";

export default function FeedScreen() {
  const [sort, setSort] = useState<Sort>("recent");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useRedesigns({ sort });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-background">
      {/* Sort bar */}
      <View className="flex-row items-center px-4 py-2.5 gap-2 border-b border-border bg-background">
        <TouchableOpacity
          onPress={() => setSort("recent")}
          activeOpacity={0.7}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg ${sort === "recent" ? "bg-accent" : ""}`}
        >
          <Clock size={13} color={sort === "recent" ? "#2A2410" : "#8A8278"} />
          <Text className={`text-sm font-medium ${sort === "recent" ? "text-foreground" : "text-muted-foreground"}`}>
            Recent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSort("top")}
          activeOpacity={0.7}
          className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg ${sort === "top" ? "bg-accent" : ""}`}
        >
          <Flame size={13} color={sort === "top" ? "#2A2410" : "#8A8278"} />
          <Text className={`text-sm font-medium ${sort === "top" ? "text-foreground" : "text-muted-foreground"}`}>
            Top
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8A900" />
        </View>
      )}

      {!isLoading && items.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-14 h-14 rounded-2xl bg-muted items-center justify-center mb-3">
            <Plus size={22} color="#8A8278" />
          </View>
          <Text className="font-semibold text-foreground mb-1">No redesigns yet</Text>
          <Text className="text-sm text-muted-foreground text-center">Be the first to share a redesign.</Text>
          <TouchableOpacity
            onPress={() => router.push("/upload" as never)}
            activeOpacity={0.85}
            className="h-11 px-6 rounded-xl bg-primary items-center justify-center mt-4"
          >
            <Text className="font-semibold text-primary-foreground">Upload Redesign</Text>
          </TouchableOpacity>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RedesignCard item={item} />}
          contentContainerClassName="px-4 pt-4 pb-8"
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#E8A900"
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color="#E8A900" style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push("/upload" as never)}
        activeOpacity={0.85}
        className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
        style={{ elevation: 6, shadowColor: "#E8A900", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
      >
        <Plus size={24} color="#2A2410" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}
