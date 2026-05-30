import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ArrowUp, Trash2 } from "lucide-react-native";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

export default function RedesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: redesign, isLoading, isError } = useRedesign(id);
  const upvote = useUpvoteRedesign(id);
  const remove = useDeleteRedesign();
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<"after" | "before">("after");

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#E8A900" />
      </View>
    );
  }

  if (isError || !redesign) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-muted-foreground text-sm">Redesign not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-3">
          <Text className="text-primary text-sm font-medium">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === redesign.author.id;

  const handleDelete = () => {
    Alert.alert("Delete redesign", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          remove.mutate(redesign.id, {
            onSuccess: () => router.replace("/(drawer)" as never),
          }),
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerClassName="bg-background pb-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Image viewer */}
      <View className="relative" style={{ aspectRatio: 4 / 3 }}>
        <Image
          source={{ uri: absoluteUrl(view === "after" ? redesign.afterUrl : redesign.beforeUrl) }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Back button overlay */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/50 items-center justify-center"
          activeOpacity={0.8}
        >
          <ArrowLeft size={17} color="#fff" />
        </TouchableOpacity>

        {/* Before/After toggle */}
        <View className="absolute top-12 left-1/2 -translate-x-1/2 flex-row gap-1">
          {(["after", "before"] as const).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              activeOpacity={0.8}
              className={`px-3 py-1 rounded-full ${view === v ? "bg-primary" : "bg-black/50"}`}
            >
              <Text className={`text-xs font-semibold ${view === v ? "text-primary-foreground" : "text-white"}`}>
                {v === "after" ? "After" : "Before"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isOwner && (
          <TouchableOpacity
            onPress={handleDelete}
            disabled={remove.isPending}
            className="absolute top-12 right-4 w-9 h-9 rounded-full bg-black/50 items-center justify-center"
            activeOpacity={0.8}
          >
            <Trash2 size={15} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View className="px-5 pt-5">
        {/* Title + upvote */}
        <View className="flex-row items-start gap-4 mb-4">
          <TouchableOpacity
            onPress={() => { if (isAuthenticated) upvote.mutate(); }}
            disabled={upvote.isPending}
            activeOpacity={0.7}
            className={`items-center px-3 py-2.5 rounded-xl border gap-1 ${
              redesign.hasUpvoted ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <ArrowUp size={18} color={redesign.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
            <Text className={`text-sm font-bold tabular-nums ${redesign.hasUpvoted ? "text-primary" : "text-muted-foreground"}`}>
              {redesign.upvoteCount}
            </Text>
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className="text-[1.25rem] font-extrabold text-foreground tracking-tight leading-tight"
              style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
            >
              {redesign.title}
            </Text>
            <Text className="text-sm text-muted-foreground mt-0.5">
              <Text className="font-medium text-foreground">{redesign.appName}</Text>
              {" · "}by <Text className="font-medium text-foreground">@{redesign.author.username}</Text>
            </Text>
          </View>
        </View>

        {redesign.description ? (
          <Text className="text-[0.94rem] text-foreground/80 leading-relaxed mb-4">
            {redesign.description}
          </Text>
        ) : null}

        {redesign.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {redesign.tags.map((t) => (
              <Text key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                {t}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
