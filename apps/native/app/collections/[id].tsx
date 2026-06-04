import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Bookmark, Share2, ArrowUp } from "lucide-react-native";
import { useState } from "react";
import { useCollection } from "@/hooks/use-discover";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function abs(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

type CollectionRedesign = {
  id: string;
  title: string;
  appName: string;
  afterUrl: string;
  upvoteCount: number;
  author: { name: string; avatarUrl: string | null; role: string | null };
};

function RedesignCard({ item }: { item: CollectionRedesign }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.85}
      className="flex-1 rounded-2xl border border-border bg-card overflow-hidden mx-1 mb-3"
    >
      <View className="aspect-[4/3] bg-muted relative">
        <Image source={{ uri: abs(item.afterUrl) }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute top-2 left-2 flex-row gap-1">
          <View className="bg-[#E8A900] rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-black uppercase tracking-wide">REDESIGN</Text>
          </View>
          <View className="bg-[#E8A900] rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-black uppercase tracking-wide">{item.appName}</Text>
          </View>
        </View>
      </View>
      <View className="p-3">
        <Text className="text-sm font-semibold text-foreground mb-2" numberOfLines={2}
          style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          {item.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="w-5 h-5 rounded-full bg-muted overflow-hidden">
              {item.author.avatarUrl ? (
                <Image source={{ uri: abs(item.author.avatarUrl) }} className="w-5 h-5" resizeMode="cover" />
              ) : (
                <Text className="text-[9px] font-bold text-muted-foreground text-center leading-5">
                  {item.author.name.charAt(0)}
                </Text>
              )}
            </View>
            <Text className="text-xs text-muted-foreground">{item.author.name}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <ArrowUp size={12} color="#8A8278" />
            <Text className="text-xs text-muted-foreground">{item.upvoteCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SkeletonBlock({ style }: { style?: object }) {
  return <View className="bg-muted rounded-2xl animate-pulse" style={style} />;
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: collection, isLoading } = useCollection(id);
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background pt-14">
        <View className="px-5 mb-6">
          <SkeletonBlock style={{ height: 16, width: 120, marginBottom: 20 }} />
          <SkeletonBlock style={{ height: 12, width: 100, marginBottom: 12 }} />
          <SkeletonBlock style={{ height: 32, width: "80%", marginBottom: 12 }} />
          <SkeletonBlock style={{ height: 14, width: "100%", marginBottom: 8 }} />
          <SkeletonBlock style={{ height: 14, width: "60%", marginBottom: 20 }} />
          <SkeletonBlock style={{ aspectRatio: 4 / 3, width: "100%", borderRadius: 16 }} />
        </View>
        <ActivityIndicator color="#E8A900" />
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="font-semibold text-foreground mb-2">Collection not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-sm">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalVotes = collection.redesigns.reduce((s, r) => s + r.upvoteCount, 0);

  const renderItem = ({ item, index }: { item: CollectionRedesign; index: number }) => {
    if (index % 2 === 0) {
      const next = collection.redesigns[index + 1];
      return (
        <View className="flex-row px-3">
          <RedesignCard item={item} />
          {next ? <RedesignCard item={next} /> : <View className="flex-1 mx-1" />}
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={collection.redesigns.filter((_, i) => i % 2 === 0)}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item, index }) => renderItem({ item: collection.redesigns[index * 2], index: index * 2 })}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListHeaderComponent={
        <View className="bg-background">
          {/* Header */}
          <View className="pt-14 px-5 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="flex-row items-center gap-1.5 mb-6"
            >
              <ArrowLeft size={15} color="#8A8278" />
              <Text className="text-muted-foreground text-sm">Back to Discover</Text>
            </TouchableOpacity>

            {/* Pill */}
            <View className="bg-[#E8A900] self-start rounded-full px-3 py-1 mb-4">
              <Text className="text-[10px] font-bold text-black uppercase tracking-wide">✦ Curated Collection</Text>
            </View>

            {/* Title */}
            <Text
              className="text-2xl font-extrabold text-foreground mb-3 leading-tight"
              style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
            >
              {collection.title}
            </Text>

            {collection.description ? (
              <Text className="text-muted-foreground text-sm mb-4 leading-relaxed">{collection.description}</Text>
            ) : null}

            {/* Curator */}
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-7 h-7 rounded-full bg-muted overflow-hidden">
                {collection.curator.avatarUrl ? (
                  <Image source={{ uri: abs(collection.curator.avatarUrl) }} className="w-7 h-7" resizeMode="cover" />
                ) : (
                  <Text className="text-xs font-bold text-muted-foreground text-center leading-7">
                    {collection.curator.name.charAt(0)}
                  </Text>
                )}
              </View>
              <Text className="text-sm text-muted-foreground">
                Curated by <Text className="font-semibold text-foreground">{collection.curator.name}</Text>
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-row items-center gap-3 mb-5">
              <Text className="text-sm text-muted-foreground">
                <Text className="font-semibold text-foreground">{collection.redesigns.length}</Text> redesigns
              </Text>
              <Text className="text-muted-foreground">·</Text>
              <Text className="text-sm text-muted-foreground">
                <Text className="font-semibold text-foreground">{totalVotes}</Text> votes
              </Text>
            </View>

            {/* Cover image */}
            <View className="rounded-2xl overflow-hidden bg-muted border border-border mb-6" style={{ aspectRatio: 16 / 9 }}>
              {collection.coverImageUrl ? (
                <Image source={{ uri: abs(collection.coverImageUrl) }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-5xl font-extrabold text-[#E8A900]/40" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
                    {collection.title.charAt(0)}
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View className="flex-row gap-2 mb-6">
              <TouchableOpacity
                onPress={() => setSaved(!saved)}
                activeOpacity={0.8}
                className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl border ${saved ? "bg-primary border-primary" : "border-border"}`}
              >
                <Bookmark size={14} color={saved ? "#000" : "#8A8278"} fill={saved ? "#000" : "none"} />
                <Text className={`text-sm font-semibold ${saved ? "text-primary-foreground" : "text-foreground"}`}>
                  {saved ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border"
              >
                <Share2 size={14} color="#8A8278" />
                <Text className="text-sm font-semibold text-foreground">Share</Text>
              </TouchableOpacity>
            </View>

            <Text className="font-bold text-foreground mb-4" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
              Redesigns in this collection
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center justify-center py-12">
          <Text className="font-semibold text-foreground mb-1">No redesigns yet</Text>
          <Text className="text-sm text-muted-foreground">This collection is empty.</Text>
        </View>
      }
    />
  );
}
