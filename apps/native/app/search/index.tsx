import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Search, ArrowUp, X, SlidersHorizontal, Check, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react-native";
import { useRedesigns, useUpvoteRedesign, type RedesignFilters, type Redesign } from "@/hooks/use-redesigns";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";
import { useAppEntries } from "@/hooks/use-app-entries";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

const CATEGORIES = ["Banking", "Mobile", "Web", "Local", "E-commerce", "Social"];
const ROLES = [
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "both", label: "Both" },
];

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
      className="bg-card border border-border rounded-2xl overflow-hidden mb-3"
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(232,169,0,0.2)", alignItems: "center", justifyContent: "center" }}>
              {item.author.avatarUrl ? (
                <Image source={{ uri: absoluteUrl(item.author.avatarUrl) }} style={{ width: 20, height: 20, borderRadius: 10 }} />
              ) : (
                <Text style={{ fontSize: 8, fontWeight: "700", color: "#E8A900" }}>{item.author.name.charAt(0)}</Text>
              )}
            </View>
            <Text className="text-foreground text-xs" numberOfLines={1}>{item.author.name}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <MessageCircle size={11} color="#8A8278" />
              <Text style={{ fontSize: 11, color: "#8A8278" }}>{item.commentCount}</Text>
            </View>
            <TouchableOpacity
              onPress={() => isAuthenticated && upvote.mutate()}
              disabled={upvote.isPending}
              style={{ flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: item.hasUpvoted ? "#E8A900" : "#E4E0D8", backgroundColor: item.hasUpvoted ? "rgba(232,169,0,0.1)" : "transparent" }}
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

export default function BrowseScreen() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "top">("recent");
  const [category, setCategory] = useState<string | undefined>();
  const [appFilter, setAppFilter] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: apps } = useAppEntries();
  const activeCount = [category, appFilter, role].filter(Boolean).length;

  const filters: RedesignFilters = { sort, category, appName: appFilter, role };
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useRedesigns(filters);

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const filtered = search.trim().length >= 2
    ? allItems.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.appName.toLowerCase().includes(search.toLowerCase()))
    : allItems;

  const clearAll = () => { setCategory(undefined); setAppFilter(undefined); setRole(undefined); };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#E4E0D8" }} className="bg-background">
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 22, fontWeight: "700", marginBottom: 10 }} className="text-foreground">Browse</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, height: 40, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8", backgroundColor: "white" }}>
            <Search size={14} color="#8A8278" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search redesigns…"
              placeholderTextColor="#8A8278"
              returnKeyType="search"
              style={{ flex: 1, fontSize: 14, color: "#1A1A1A" }}
            />
            {search.length > 0 && <TouchableOpacity onPress={() => setSearch("")}><X size={14} color="#8A8278" /></TouchableOpacity>}
          </View>
          <TouchableOpacity
            onPress={() => setFilterOpen(true)}
            style={{ height: 40, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 6, borderColor: activeCount > 0 ? "#E8A900" : "#E4E0D8", backgroundColor: activeCount > 0 ? "rgba(232,169,0,0.1)" : "white" }}
          >
            <SlidersHorizontal size={14} color={activeCount > 0 ? "#E8A900" : "#8A8278"} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: activeCount > 0 ? "#E8A900" : "#1A1A1A" }}>
              {activeCount > 0 ? `Filters · ${activeCount}` : "Filters"}
            </Text>
          </TouchableOpacity>
        </View>
        {activeCount > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 6 }}>
            {category && (
              <TouchableOpacity onPress={() => setCategory(undefined)} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: "rgba(232,169,0,0.1)", borderWidth: 1, borderColor: "#E8A900" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#E8A900" }}>{category}</Text>
                <X size={9} color="#E8A900" strokeWidth={3} />
              </TouchableOpacity>
            )}
            {appFilter && (
              <TouchableOpacity onPress={() => setAppFilter(undefined)} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: "rgba(232,169,0,0.1)", borderWidth: 1, borderColor: "#E8A900" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#E8A900" }}>{appFilter}</Text>
                <X size={9} color="#E8A900" strokeWidth={3} />
              </TouchableOpacity>
            )}
            {role && (
              <TouchableOpacity onPress={() => setRole(undefined)} style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: "rgba(232,169,0,0.1)", borderWidth: 1, borderColor: "#E8A900" }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#E8A900" }}>{ROLES.find((r) => r.value === role)?.label}</Text>
                <X size={9} color="#E8A900" strokeWidth={3} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={clearAll} style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#8A8278" }}>Clear all</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color="#E8A900" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 8 }}>
          <Search size={32} color="#C4BDB5" />
          <Text style={{ fontWeight: "600", fontSize: 15 }} className="text-foreground">No redesigns found</Text>
          <Text style={{ fontSize: 13, color: "#8A8278", textAlign: "center" }}>Try adjusting your filters.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RedesignCard item={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#E8A900" style={{ paddingVertical: 16 }} /> : null}
        />
      )}

      {/* Filter modal */}
      <Modal visible={filterOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setFilterOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, borderBottomWidth: 1, borderColor: "#E4E0D8" }}>
            <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 18, fontWeight: "700" }}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterOpen(false)}><X size={20} color="#8A8278" /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#8A8278", textTransform: "uppercase", letterSpacing: 1 }}>Sort by</Text>
              {[{ value: "recent", label: "Latest" }, { value: "top", label: "Trending" }].map(({ value, label }) => (
                <TouchableOpacity key={value} onPress={() => setSort(value as "recent" | "top")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, backgroundColor: sort === value ? "rgba(232,169,0,0.1)" : "#F8F6F2" }}>
                  <Text style={{ fontSize: 14, fontWeight: sort === value ? "700" : "500", color: sort === value ? "#E8A900" : "#1A1A1A" }}>{label}</Text>
                  {sort === value && <Check size={16} color="#E8A900" strokeWidth={2.5} />}
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#8A8278", textTransform: "uppercase", letterSpacing: 1 }}>Category</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setCategory(category === c ? undefined : c)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: category === c ? "#E8A900" : "#E4E0D8", backgroundColor: category === c ? "rgba(232,169,0,0.1)" : "transparent", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    {category === c && <Check size={11} color="#E8A900" strokeWidth={2.5} />}
                    <Text style={{ fontSize: 13, fontWeight: "600", color: category === c ? "#E8A900" : "#1A1A1A" }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {apps && apps.length > 0 && (
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#8A8278", textTransform: "uppercase", letterSpacing: 1 }}>App</Text>
                {apps.map((a) => (
                  <TouchableOpacity key={a.id} onPress={() => setAppFilter(appFilter === a.name ? undefined : a.name)} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: appFilter === a.name ? "rgba(232,169,0,0.1)" : "#F8F6F2" }}>
                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: a.iconColor, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>{a.iconLetter}</Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: appFilter === a.name ? "700" : "500", color: appFilter === a.name ? "#E8A900" : "#1A1A1A" }}>{a.name}</Text>
                    {appFilter === a.name && <Check size={16} color="#E8A900" strokeWidth={2.5} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#8A8278", textTransform: "uppercase", letterSpacing: 1 }}>Designer role</Text>
              {ROLES.map(({ value, label }) => (
                <TouchableOpacity key={value} onPress={() => setRole(role === value ? undefined : value)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, backgroundColor: role === value ? "rgba(232,169,0,0.1)" : "#F8F6F2" }}>
                  <Text style={{ fontSize: 14, fontWeight: role === value ? "700" : "500", color: role === value ? "#E8A900" : "#1A1A1A" }}>{label}</Text>
                  {role === value && <Check size={16} color="#E8A900" strokeWidth={2.5} />}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={{ padding: 20, borderTopWidth: 1, borderColor: "#E4E0D8", flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={clearAll} style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#1A1A1A" }}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFilterOpen(false)} style={{ flex: 2, height: 44, borderRadius: 12, backgroundColor: "#E8A900", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#2A2410" }}>Apply{activeCount > 0 ? ` · ${activeCount}` : ""}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
