import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
  PanResponder,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ArrowUp, Trash2, Send, MessageCircle, Share2, Bookmark, BookmarkCheck } from "lucide-react-native";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

export default function RedesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: redesign, isLoading, isError } = useRedesign(id);
  const { data: comments } = useComments(id);
  const upvote = useUpvoteRedesign(id);
  const remove = useDeleteRedesign();
  const createComment = useCreateComment(id);
  const deleteComment = useDeleteComment(id);
  const { user, isAuthenticated } = useAuth();
  const [commentBody, setCommentBody] = useState("");

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
  const bookmark = useToggleBookmark(id);
  const { data: bookmarks } = useBookmarks(isAuthenticated);
  const isBookmarked = bookmarks?.some((b) => b.id === id) ?? false;
  const screenWidth = Dimensions.get("window").width;
  const [sliderPct, setSliderPct] = useState(50);
  const sliderX = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const pct = Math.min(100, Math.max(0, (e.nativeEvent.locationX / screenWidth) * 100));
        setSliderPct(pct);
      },
      onPanResponderMove: (e) => {
        const pct = Math.min(100, Math.max(0, (e.nativeEvent.pageX / screenWidth) * 100));
        setSliderPct(pct);
      },
    }),
  ).current;

  const handleShare = async () => {
    try {
      await Share.share({
        title: redesign.title,
        message: `Check out this redesign: ${redesign.title} by @${redesign.author.username}`,
      });
    } catch {}
  };

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

  const handleSubmitComment = () => {
    if (!commentBody.trim() || createComment.isPending) return;
    createComment.mutate(commentBody.trim(), { onSuccess: () => setCommentBody("") });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Before/after comparison slider */}
        <View style={{ aspectRatio: 4 / 3 }} className="relative overflow-hidden" {...panResponder.panHandlers}>
          {/* After (full) */}
          <Image source={{ uri: absoluteUrl(redesign.afterUrl) }} className="w-full h-full absolute" resizeMode="cover" />
          {/* Before (clipped left) */}
          <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${sliderPct}%`, overflow: "hidden" }}>
            <Image source={{ uri: absoluteUrl(redesign.beforeUrl) }} style={{ width: screenWidth, height: "100%" }} resizeMode="cover" />
          </View>
          {/* Divider */}
          <View style={{ position: "absolute", top: 0, bottom: 0, left: `${sliderPct}%`, width: 2, backgroundColor: "#fff", transform: [{ translateX: -1 }] }} />
          {/* Handle */}
          <View style={{ position: "absolute", top: "50%", left: `${sliderPct}%`, transform: [{ translateX: -18 }, { translateY: -18 }], width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, color: "#666", letterSpacing: -4 }}>◂▸</Text>
          </View>
          {/* Labels */}
          <View className="absolute top-12 left-3"><View className="bg-black/60 px-2 py-0.5 rounded-full"><Text className="text-white text-[0.65rem] font-semibold">Before</Text></View></View>
          <View className="absolute top-12 right-3"><View className="bg-black/60 px-2 py-0.5 rounded-full"><Text className="text-white text-[0.65rem] font-semibold">After</Text></View></View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/50 items-center justify-center"
            activeOpacity={0.8}
          >
            <ArrowLeft size={17} color="#fff" />
          </TouchableOpacity>

          <View className="absolute top-12 right-4 flex-row gap-2">
            <TouchableOpacity
              onPress={handleShare}
              className="w-9 h-9 rounded-full bg-black/50 items-center justify-center"
              activeOpacity={0.8}
            >
              <Share2 size={15} color="#fff" />
            </TouchableOpacity>
            {isAuthenticated && (
              <TouchableOpacity
                onPress={() => bookmark.mutate()}
                disabled={bookmark.isPending}
                className="w-9 h-9 rounded-full bg-black/50 items-center justify-center"
                activeOpacity={0.8}
              >
                {isBookmarked
                  ? <BookmarkCheck size={15} color="#E8A900" />
                  : <Bookmark size={15} color="#fff" />}
              </TouchableOpacity>
            )}
            {isOwner && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={remove.isPending}
                className="w-9 h-9 rounded-full bg-black/50 items-center justify-center"
                activeOpacity={0.8}
              >
                <Trash2 size={15} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="px-5 pt-5 pb-6">
          {/* Pills */}
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 10 }}>
            <View style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.5 }}>Redesign</Text>
            </View>
            <Text style={{ color: "#8A8278", fontSize: 12 }}>·</Text>
            <View style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.5 }}>{redesign.appName}</Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-[1.2rem] font-bold text-foreground tracking-tight leading-tight mb-2" style={{ fontFamily: "BricolageGrotesque-Bold" }}>
            {redesign.title}
          </Text>

          {/* Author + stats row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <TouchableOpacity
              onPress={() => router.push(`/users/${redesign.author.username}` as never)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(232,169,0,0.2)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {redesign.author.avatarUrl ? (
                  <Image source={{ uri: absoluteUrl(redesign.author.avatarUrl) }} style={{ width: 26, height: 26 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#E8A900" }}>{redesign.author.name.charAt(0)}</Text>
                )}
              </View>
              <Text className="text-sm font-semibold text-foreground">{redesign.author.name}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => { if (isAuthenticated) upvote.mutate(); }}
              disabled={upvote.isPending}
              activeOpacity={0.7}
              style={{
                flexDirection: "row", alignItems: "center", gap: 6,
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                borderWidth: 1,
                borderColor: redesign.hasUpvoted ? "#E8A900" : "#E4E0D8",
                backgroundColor: redesign.hasUpvoted ? "rgba(232,169,0,0.1)" : "transparent",
              }}
            >
              <ArrowUp size={14} color={redesign.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: redesign.hasUpvoted ? "#E8A900" : "#8A8278" }}>{redesign.upvoteCount}</Text>
              <Text style={{ fontSize: 12, color: "#8A8278" }}>votes</Text>
            </TouchableOpacity>
          </View>

          {redesign.description ? (
            <View className="mb-4">
              <Text className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "BricolageGrotesque-Bold" }}>What this redesign solves</Text>
              <Text className="text-[0.94rem] text-foreground/80 leading-relaxed">{redesign.description}</Text>
            </View>
          ) : null}

          {redesign.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-6">
              {redesign.tags.map((t) => (
                <Text key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">{t}</Text>
              ))}
            </View>
          )}

          {/* Comments */}
          <View className="border-t border-border pt-5">
            <View className="flex-row items-center gap-2 mb-4">
              <Text className="font-bold text-foreground text-base" style={{ fontFamily: "BricolageGrotesque-Bold" }}>
                Let&apos;s Build on This
              </Text>
              {comments && comments.length > 0 && (
                <View style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 }}>
                  <Text style={{ fontSize: 9, fontWeight: "700", color: "#6B6B6B", textTransform: "uppercase" }}>{comments.length} {comments.length === 1 ? "note" : "notes"}</Text>
                </View>
              )}
            </View>

            {comments?.map((c) => (
              <View key={c.id} className="flex-row gap-3 mb-4 p-3 rounded-2xl border border-border bg-card">
                <View className="w-9 h-9 rounded-full bg-primary/20 items-center justify-center flex-none">
                  <Text className="text-primary font-bold text-xs">{c.author.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 flex-wrap mb-1">
                    <TouchableOpacity onPress={() => router.push(`/users/${c.author.username}` as never)}>
                      <Text className="text-sm font-semibold text-foreground">{c.author.name}</Text>
                    </TouchableOpacity>
                    {(c.author as typeof c.author & { role?: string | null }).role && (
                      <View style={{ backgroundColor: "#F0F0F0", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 }}>
                        <Text style={{ fontSize: 9, fontWeight: "600", color: "#6B6B6B" }}>
                          {(c.author as typeof c.author & { role?: string }).role}
                        </Text>
                      </View>
                    )}
                    <Text className="text-xs text-muted-foreground">· {new Date(c.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text className="text-sm text-foreground/90 leading-relaxed">{c.body}</Text>
                </View>
                {user?.id === c.author.id && (
                  <TouchableOpacity
                    onPress={() => deleteComment.mutate(c.id)}
                    disabled={deleteComment.isPending}
                    className="mt-0.5"
                    style={{ opacity: deleteComment.isPending ? 0.4 : 1 }}
                  >
                    <Trash2 size={13} color="#8A8278" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {comments?.length === 0 && (
              <Text className="text-sm text-muted-foreground mb-4">No comments yet.</Text>
            )}

            {isAuthenticated && (
              <View className="flex-row gap-2 mt-2">
                <TextInput
                  value={commentBody}
                  onChangeText={setCommentBody}
                  placeholder="Add a comment…"
                  placeholderTextColor="#8A8278"
                  maxLength={1000}
                  multiline
                  editable={!createComment.isPending}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm"
                  style={{ minHeight: 44, maxHeight: 120, opacity: createComment.isPending ? 0.6 : 1 }}
                />
                <TouchableOpacity
                  onPress={handleSubmitComment}
                  disabled={!commentBody.trim() || createComment.isPending}
                  activeOpacity={0.8}
                  className="w-11 h-11 rounded-xl bg-primary items-center justify-center disabled:opacity-40 self-end"
                >
                  <Send size={15} color="#2A2410" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
