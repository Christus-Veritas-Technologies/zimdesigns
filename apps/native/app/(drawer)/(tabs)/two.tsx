import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Search, TrendingUp, ArrowUp } from "lucide-react-native";
import { useSearch } from "@/hooks/use-profiles";
import { useTrending } from "@/hooks/use-bookmarks";
import { env } from "@zimdesigns/env/native";
import type { Redesign } from "@/hooks/use-redesigns";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

function RedesignRow({ item }: { item: Redesign }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.8}
      className="flex-row items-center gap-3 mx-4 mb-2 p-3 rounded-2xl border border-border bg-card"
    >
      <View className="w-14 h-10 rounded-lg overflow-hidden bg-muted flex-none">
        <Image source={{ uri: absoluteUrl(item.afterUrl) }} style={{ width: 56, height: 40 }} resizeMode="cover" />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="font-semibold text-sm text-foreground" numberOfLines={1}>{item.title}</Text>
        <Text className="text-xs text-muted-foreground">{item.appName} · @{item.author.username}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <ArrowUp size={11} color="#8A8278" strokeWidth={2.5} />
        <Text className="text-xs font-semibold text-muted-foreground">{item.upvoteCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DiscoverTab() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading: searching } = useSearch(query);
  const { data: trending } = useTrending();

  const isSearching = query.trim().length >= 2;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={isSearching ? (results ?? []) : (trending?.topRedesigns?.slice(0, 10) as Redesign[] | undefined ?? [])}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="pt-14 pb-3">
            {/* Search bar */}
            <View className="mx-4 mb-4 flex-row items-center gap-2 px-3 py-2.5 rounded-2xl border border-border bg-card">
              <Search size={16} color="#8A8278" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search redesigns…"
                placeholderTextColor="#8A8278"
                className="flex-1 text-sm text-foreground"
                clearButtonMode="while-editing"
              />
            </View>

            {!isSearching && (
              <View className="flex-row items-center gap-2 px-5 mb-3">
                <TrendingUp size={14} color="#E8A900" />
                <Text className="font-semibold text-foreground">Trending this week</Text>
              </View>
            )}

            {isSearching && searching && (
              <View className="items-center py-4"><ActivityIndicator color="#E8A900" /></View>
            )}

            {isSearching && !searching && results?.length === 0 && (
              <View className="items-center py-16 px-6">
                <Text className="font-semibold text-foreground mb-1">No results</Text>
                <Text className="text-sm text-muted-foreground text-center">Try a different search term.</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => <RedesignRow item={item as Redesign} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          !isSearching ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator color="#E8A900" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
