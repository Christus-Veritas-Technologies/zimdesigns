import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ArrowUp, Flame, Users, Clock, Plus, Bookmark } from "lucide-react-native";
import { useRedesigns, useUpvoteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useFollowingFeed } from "@/hooks/use-follows";
import { useToggleBookmark } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

type Tab = "foryou" | "following";
type Sort = "recent" | "top";

function RedesignCard({ item, isAuthenticated }: { item: Redesign; isAuthenticated: boolean }) {
  const upvote = useUpvoteRedesign(item.id);
  const bookmark = useToggleBookmark(item.id);
  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="flex-1 mx-1.5 mb-3 rounded-2xl border border-border bg-card overflow-hidden"
    >
      <View style={{ aspectRatio: 4 / 3 }} className="relative">
        <Image source={{ uri: absoluteUrl(item.afterUrl) }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 h-14 justify-end px-2 pb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-[0.65rem] text-white/90 font-semibold">{item.appName}</Text>
            {isAuthenticated && (
              <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); bookmark.mutate(); }} activeOpacity={0.7}>
                <Bookmark size={13} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View className="flex-row items-center gap-2 px-2.5 py-2">
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation?.(); isAuthenticated && upvote.mutate(); }}
          disabled={upvote.isPending}
          activeOpacity={0.7}
          className={`flex-row items-center gap-1 px-2 py-1 rounded-lg border ${item.hasUpvoted ? "border-primary bg-primary/10" : "border-border"}`}
        >
          <ArrowUp size={11} color={item.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
          <Text className={`text-xs font-semibold ${item.hasUpvoted ? "text-primary" : "text-muted-foreground"}`}>{item.upvoteCount}</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xs font-semibold text-foreground" numberOfLines={1}>{item.title}</Text>
          <Text className="text-[0.65rem] text-muted-foreground">@{item.author.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>("foryou");
  const [sort, setSort] = useState<Sort>("recent");
  const { isAuthenticated } = useAuth();

  const forYou = useRedesigns({ sort });
  const following = useFollowingFeed();

  const active = tab === "foryou" ? forYou : following;
  const items = active.data?.pages.flatMap((p) => p.items) ?? [];

  const header = (
    <View className="pt-14 pb-2">
      {/* Tabs row */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={() => setTab("foryou")}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl ${tab === "foryou" ? "bg-accent" : ""}`}
          >
            <Flame size={13} color={tab === "foryou" ? "#E8A900" : "#8A8278"} />
            <Text className={`text-sm font-medium ${tab === "foryou" ? "text-foreground" : "text-muted-foreground"}`}>For You</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => isAuthenticated ? setTab("following") : router.push("/auth/login" as never)}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl ${tab === "following" ? "bg-accent" : ""}`}
          >
            <Users size={13} color={tab === "following" ? "#E8A900" : "#8A8278"} />
            <Text className={`text-sm font-medium ${tab === "following" ? "text-foreground" : "text-muted-foreground"}`}>Following</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-1">
          {isAuthenticated && (
            <TouchableOpacity onPress={() => router.push("/bookmarks" as never)} activeOpacity={0.7} className="p-1.5">
              <Bookmark size={18} color="#8A8278" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push("/upload" as never)}
            activeOpacity={0.8}
            className="flex-row items-center gap-1 px-3 py-1.5 rounded-xl bg-primary"
          >
            <Plus size={14} color="#fff" strokeWidth={2.5} />
            <Text className="text-white text-sm font-semibold">Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort pills (for you only) */}
      {tab === "foryou" && (
        <View className="flex-row items-center gap-2 px-4 mb-2">
          <TouchableOpacity
            onPress={() => setSort("recent")}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1 px-3 py-1 rounded-lg ${sort === "recent" ? "bg-accent" : ""}`}
          >
            <Clock size={12} color={sort === "recent" ? "#E8A900" : "#8A8278"} />
            <Text className={`text-xs font-medium ${sort === "recent" ? "text-foreground" : "text-muted-foreground"}`}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSort("top")}
            activeOpacity={0.7}
            className={`px-3 py-1 rounded-lg ${sort === "top" ? "bg-accent" : ""}`}
          >
            <Text className={`text-xs font-medium ${sort === "top" ? "text-foreground" : "text-muted-foreground"}`}>Top</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (active.isLoading) {
    return (
      <View className="flex-1 bg-background">
        {header}
        <View className="items-center justify-center py-16">
          <ActivityIndicator color="#E8A900" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={header}
        contentContainerClassName="px-3 pb-8"
        renderItem={({ item }) => <RedesignCard item={item} isAuthenticated={isAuthenticated} />}
        showsVerticalScrollIndicator={false}
        onEndReached={() => { if (active.hasNextPage && !active.isFetchingNextPage) active.fetchNextPage(); }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          active.isFetchingNextPage ? (
            <View className="py-4 items-center"><ActivityIndicator color="#E8A900" /></View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-6">
            <Text className="font-semibold text-foreground text-base mb-1">
              {tab === "following" ? "Follow designers to see their work" : "No redesigns yet"}
            </Text>
            <Text className="text-muted-foreground text-sm text-center">
              {tab === "following" ? "Discover designers on the For You tab." : "Be the first to share a redesign."}
            </Text>
          </View>
        }
      />
    </View>
  );
}
