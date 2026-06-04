import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ArrowUp, MessageCircle, Bookmark, BookmarkCheck, ArrowUpDown } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useUpvoteRedesign } from "@/hooks/use-redesigns";
import type { Redesign } from "@/hooks/use-redesigns";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

interface AppEntryDetail {
  id: string; slug: string; name: string;
  iconColor: string; iconLetter: string;
  description: string | null;
  tags: string[]; brokenItems: string[]; screenshotUrl: string | null;
  stats: { redesignCount: number; totalVotes: number; designerCount: number };
  redesigns: Redesign[];
}

function useAppEntry(slug: string) {
  return useQuery<AppEntryDetail>({
    queryKey: ["app-entry", slug],
    queryFn: () => api.get<AppEntryDetail>(`/api/apps/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

const ROLE_LABEL: Record<string, string> = { designer: "Designer", developer: "Developer", both: "Both" };

function RedesignCard({ item }: { item: Redesign }) {
  const { isAuthenticated } = useAuth();
  const upvote = useUpvoteRedesign(item.id);
  const bookmark = useToggleBookmark(item.id);
  const { data: bookmarks } = useBookmarks(isAuthenticated);
  const isBookmarked = bookmarks?.some((b) => b.id === item.id) ?? false;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="bg-card border border-border rounded-2xl overflow-hidden mb-4"
    >
      <View style={{ position: "relative" }}>
        <Image source={{ uri: absoluteUrl(item.afterUrl) }} style={{ width: "100%", aspectRatio: 4 / 3 }} resizeMode="cover" />
        <View style={{ position: "absolute", top: 10, left: 10, flexDirection: "row", gap: 6 }}>
          <View style={{ backgroundColor: "#E8A900", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#2A2410", textTransform: "uppercase" }}>Redesign</Text>
          </View>
          <View style={{ backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: "600", color: "#fff" }}>{item.appName}</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 12, gap: 8 }}>
        <Text className="font-semibold text-foreground text-sm leading-snug" numberOfLines={2}>{item.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(232,169,0,0.2)", alignItems: "center", justifyContent: "center" }}>
              {item.author.avatarUrl ? (
                <Image source={{ uri: absoluteUrl(item.author.avatarUrl) }} style={{ width: 22, height: 22, borderRadius: 11 }} />
              ) : (
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#E8A900" }}>{item.author.name.charAt(0)}</Text>
              )}
            </View>
            <Text className="text-foreground text-xs font-medium" numberOfLines={1}>{item.author.name}</Text>
            {item.author.role ? <Text className="text-muted-foreground" style={{ fontSize: 10 }}>{ROLE_LABEL[item.author.role] ?? item.author.role}</Text> : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <MessageCircle size={11} color="#8A8278" />
              <Text style={{ fontSize: 11, color: "#8A8278" }}>{item.commentCount}</Text>
            </View>
            <TouchableOpacity
              onPress={() => isAuthenticated && upvote.mutate()}
              disabled={upvote.isPending}
              style={{
                flexDirection: "row", alignItems: "center", gap: 3,
                paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
                borderWidth: 1,
                borderColor: item.hasUpvoted ? "#E8A900" : "#E4E0D8",
                backgroundColor: item.hasUpvoted ? "rgba(232,169,0,0.1)" : "transparent",
              }}
            >
              <ArrowUp size={11} color={item.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
              <Text style={{ fontSize: 11, color: item.hasUpvoted ? "#E8A900" : "#8A8278", fontWeight: "600" }}>{item.upvoteCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => isAuthenticated && bookmark.mutate()}
              style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: isBookmarked ? "#E8A900" : "#E4E0D8", backgroundColor: isBookmarked ? "rgba(232,169,0,0.1)" : "transparent", alignItems: "center", justifyContent: "center" }}
            >
              {isBookmarked ? <BookmarkCheck size={11} color="#E8A900" strokeWidth={2} /> : <Bookmark size={11} color="#8A8278" strokeWidth={2} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AppEntryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [sort, setSort] = useState<"top" | "recent">("top");
  const { data: entry, isLoading, isError } = useAppEntry(slug);

  if (isLoading) {
    return <View className="flex-1 bg-background items-center justify-center"><ActivityIndicator color="#E8A900" /></View>;
  }

  if (isError || !entry) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-muted-foreground text-sm">App not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-3"><Text className="text-primary text-sm font-medium">Go back</Text></TouchableOpacity>
      </View>
    );
  }

  const sortedRedesigns = [...entry.redesigns].sort((a, b) =>
    sort === "top" ? b.upvoteCount - a.upvoteCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const header = (
    <View style={{ paddingHorizontal: 16 }}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, marginTop: 8 }}>
        <ArrowLeft size={16} color="#8A8278" />
        <Text className="text-sm text-muted-foreground">Back to feed</Text>
      </TouchableOpacity>

      {/* App header */}
      <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
        <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: entry.iconColor, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>{entry.iconLetter}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: "BricolageGrotesque-Bold" }}>{entry.name}</Text>
          {entry.tags.length > 0 && (
            <View style={{ flexDirection: "row", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
              {entry.tags.map((t) => (
                <View key={t} style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                  <Text style={{ fontSize: 9, fontWeight: "700", color: "#6B6B6B", textTransform: "uppercase" }}>{t}</Text>
                </View>
              ))}
            </View>
          )}
          {entry.description && <Text className="text-xs text-muted-foreground mt-1">{entry.description}</Text>}
          <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
            {[
              { v: entry.stats.redesignCount, l: "redesigns" },
              { v: entry.stats.totalVotes >= 1000 ? `${(entry.stats.totalVotes / 1000).toFixed(1)}k` : entry.stats.totalVotes, l: "votes" },
              { v: entry.stats.designerCount, l: "designers" },
            ].map(({ v, l }) => (
              <View key={l}>
                <Text style={{ fontSize: 14, fontWeight: "700" }} className="text-foreground">{v}</Text>
                <Text className="text-muted-foreground" style={{ fontSize: 10 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => router.push("/upload" as never)}
          style={{ flex: 1, height: 42, borderRadius: 12, backgroundColor: "#E8A900", alignItems: "center", justifyContent: "center" }}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#2A2410" }}>+ Submit a redesign</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ height: 42, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center", justifyContent: "center" }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 13, fontWeight: "600" }} className="text-foreground">🚩 Fix</Text>
        </TouchableOpacity>
      </View>

      {/* What's broken */}
      {entry.brokenItems.length > 0 && (
        <View style={{ borderWidth: 1, borderColor: "#E4E0D8", borderRadius: 16, padding: 16, marginBottom: 16 }} className="bg-card">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Text className="font-bold text-foreground" style={{ fontFamily: "BricolageGrotesque-Bold" }}>What&apos;s broken</Text>
            <View style={{ borderWidth: 1, borderColor: "#E4E0D8", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ fontSize: 8, fontWeight: "700", color: "#8A8278", textTransform: "uppercase", letterSpacing: 0.5 }}>Curated</Text>
            </View>
          </View>
          {entry.brokenItems.map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#E8A900", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#2A2410" }}>{i + 1}</Text>
              </View>
              <Text className="text-sm text-foreground leading-relaxed" style={{ flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Redesigns header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text className="font-bold text-foreground" style={{ fontFamily: "BricolageGrotesque-Bold" }}>
          Redesigns · <Text className="text-muted-foreground font-normal">{entry.stats.redesignCount}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setSort(sort === "top" ? "recent" : "top")}
          style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#E4E0D8" }}
          activeOpacity={0.7}
        >
          <ArrowUpDown size={11} color="#8A8278" />
          <Text style={{ fontSize: 12, fontWeight: "600" }} className="text-foreground">Sort: {sort === "top" ? "Trending" : "Recent"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      className="flex-1 bg-background"
      data={sortedRedesigns}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      renderItem={({ item }) => <RedesignCard item={item} />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text className="text-muted-foreground text-sm">No redesigns yet. Be the first!</Text>
        </View>
      }
    />
  );
}
