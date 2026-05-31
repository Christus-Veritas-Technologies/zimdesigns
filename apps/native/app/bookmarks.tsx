import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ArrowUp, Bookmark } from "lucide-react-native";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";
import type { Redesign } from "@/hooks/use-redesigns";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

function BookmarkCard({ item }: { item: Redesign }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="flex-1 mx-1.5 mb-3 rounded-2xl border border-border bg-card overflow-hidden"
    >
      <View style={{ aspectRatio: 4 / 3 }} className="relative">
        <Image source={{ uri: absoluteUrl(item.afterUrl) }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 h-10 items-end pr-2 justify-end pb-1.5">
          <Text className="text-[0.65rem] text-white/80 font-medium">{item.appName}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2 px-2.5 py-2">
        <View className="flex-row items-center gap-1">
          <ArrowUp size={11} color="#8A8278" strokeWidth={2.5} />
          <Text className="text-xs font-semibold text-muted-foreground">{item.upvoteCount}</Text>
        </View>
        <Text className="text-xs font-semibold text-foreground flex-1" numberOfLines={1}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BookmarksScreen() {
  const { isAuthenticated } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center mb-4">
          <Bookmark size={24} color="#8A8278" />
        </View>
        <Text className="font-semibold text-foreground text-base mb-1">Sign in to see bookmarks</Text>
        <Text className="text-muted-foreground text-sm text-center mb-4">Save redesigns to revisit them later.</Text>
        <TouchableOpacity onPress={() => router.push("/auth/login" as never)} activeOpacity={0.8} className="px-5 py-2.5 rounded-xl bg-primary">
          <Text className="text-white font-semibold text-sm">Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const header = (
    <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2">
        <ArrowLeft size={16} color="#8A8278" />
        <Text className="text-muted-foreground text-sm">Back</Text>
      </TouchableOpacity>
      <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>Saved</Text>
    </View>
  );

  if (isLoading) {
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
        data={bookmarks ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={header}
        contentContainerClassName="px-3 pb-8"
        renderItem={({ item }) => <BookmarkCard item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-6">
            <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center mb-4">
              <Bookmark size={24} color="#8A8278" />
            </View>
            <Text className="font-semibold text-foreground text-base mb-1">No saved redesigns yet</Text>
            <Text className="text-muted-foreground text-sm text-center">Bookmark redesigns to find them here.</Text>
          </View>
        }
      />
    </View>
  );
}
