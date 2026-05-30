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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ArrowUp, Trash2, Send, MessageCircle, Share2, Bookmark } from "lucide-react-native";
import { useRedesign, useUpvoteRedesign, useDeleteRedesign } from "@/hooks/use-redesigns";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useToggleBookmark } from "@/hooks/use-bookmarks";
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
  const [view, setView] = useState<"after" | "before">("after");
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
        {/* Image viewer */}
        <View style={{ aspectRatio: 4 / 3 }} className="relative">
          <Image
            source={{ uri: absoluteUrl(view === "after" ? redesign.afterUrl : redesign.beforeUrl) }}
            className="w-full h-full"
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/50 items-center justify-center"
            activeOpacity={0.8}
          >
            <ArrowLeft size={17} color="#fff" />
          </TouchableOpacity>

          <View className="absolute top-12 flex-row gap-1.5" style={{ left: "50%", transform: [{ translateX: -50 }] }}>
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
                <Bookmark size={15} color="#fff" />
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
              <Text className="text-[1.2rem] font-extrabold text-foreground tracking-tight leading-tight" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
                {redesign.title}
              </Text>
              <Text className="text-sm text-muted-foreground mt-0.5">
                <Text className="font-medium text-foreground">{redesign.appName}</Text>
                {" · "}by{" "}
                <Text
                  className="font-medium text-foreground"
                  onPress={() => router.push(`/users/${redesign.author.username}` as never)}
                >
                  @{redesign.author.username}
                </Text>
              </Text>
            </View>
          </View>

          {redesign.description ? (
            <Text className="text-[0.94rem] text-foreground/80 leading-relaxed mb-4">{redesign.description}</Text>
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
              <MessageCircle size={15} color="#8A8278" />
              <Text className="font-semibold text-foreground text-sm">
                Comments {comments ? `(${comments.length})` : ""}
              </Text>
            </View>

            {comments?.map((c) => (
              <View key={c.id} className="flex-row gap-3 mb-4">
                <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center flex-none">
                  <Text className="text-primary font-bold text-xs">{c.author.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => router.push(`/users/${c.author.username}` as never)}>
                      <Text className="text-sm font-semibold text-foreground">@{c.author.username}</Text>
                    </TouchableOpacity>
                    <Text className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{c.body}</Text>
                </View>
                {user?.id === c.author.id && (
                  <TouchableOpacity onPress={() => deleteComment.mutate(c.id)} className="mt-0.5">
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
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm"
                  style={{ minHeight: 44, maxHeight: 120 }}
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
