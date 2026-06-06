import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Share,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowUp, UserPlus, UserMinus, Share2, Flag, UserX, Swords, MoreVertical, Bookmark, BookmarkCheck, MessageCircle } from "lucide-react-native";
import { useProfile, useUserRedesigns } from "@/hooks/use-profiles";
import { useFollowStatus, useToggleFollow } from "@/hooks/use-follows";
import { useToggleBookmark, useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";
import type { Redesign } from "@/hooks/use-redesigns";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Designer & Developer",
};

const SOCIAL_FIELDS = [
  { key: "figmaUrl" as const, label: "Figma" },
  { key: "githubUrl" as const, label: "GitHub" },
  { key: "websiteUrl" as const, label: "Website" },
  { key: "linkedinUrl" as const, label: "LinkedIn" },
  { key: "dribbbleUrl" as const, label: "Dribbble" },
  { key: "twitterUrl" as const, label: "X" },
] as const;

function RedesignCard({ item }: { item: Redesign }) {
  const bookmark = useToggleBookmark(item.id);
  const { isAuthenticated } = useAuth();
  const { data: bookmarks } = useBookmarks(isAuthenticated);
  const isBookmarked = bookmarks?.some((b) => b.id === item.id) ?? false;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="bg-card border border-border rounded-2xl overflow-hidden mb-4"
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: absoluteUrl(item.afterUrl) }}
          style={{ width: "100%", aspectRatio: 4 / 3 }}
          resizeMode="cover"
        />
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
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(232,169,0,0.2)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {item.author.avatarUrl ? (
                <Image source={{ uri: absoluteUrl(item.author.avatarUrl) }} style={{ width: 22, height: 22 }} resizeMode="cover" />
              ) : (
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#E8A900" }}>{item.author.name.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text className="text-foreground text-xs font-medium" numberOfLines={1}>{item.author.name}</Text>
            {item.author.role ? <Text className="text-muted-foreground" style={{ fontSize: 10 }}>{ROLE_LABEL[item.author.role] ?? item.author.role}</Text> : null}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <ArrowUp size={11} color="#8A8278" strokeWidth={2.5} />
              <Text style={{ fontSize: 11, color: "#8A8278" }}>{item.upvoteCount}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <MessageCircle size={11} color="#8A8278" />
              <Text style={{ fontSize: 11, color: "#8A8278" }}>{item.commentCount}</Text>
            </View>
            <TouchableOpacity
              onPress={() => isAuthenticated && bookmark.mutate()}
              disabled={bookmark.isPending}
              style={{
                width: 26, height: 26, borderRadius: 13,
                borderWidth: 1,
                borderColor: isBookmarked ? "#E8A900" : "#E4E0D8",
                backgroundColor: isBookmarked ? "rgba(232,169,0,0.1)" : "transparent",
                alignItems: "center", justifyContent: "center",
              }}
            >
              {isBookmarked
                ? <BookmarkCheck size={11} color="#E8A900" strokeWidth={2} />
                : <Bookmark size={11} color="#8A8278" strokeWidth={2} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<"redesigns" | "saved" | "comments" | "votes">("redesigns");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { data: profile, isLoading: profileLoading, isError } = useProfile(username);
  const { data: redesigns, isLoading: redesignsLoading } = useUserRedesigns(username);
  const isOwnProfile = user?.username === username;
  const { data: followStatus } = useFollowStatus(username);
  const toggleFollow = useToggleFollow(username);

  const handleShare = async () => {
    if (!profile) return;
    try {
      await Share.share({
        message: `Check out ${profile.name} on ZimDesigns`,
        title: `${profile.name} on ZimDesigns`,
      });
    } catch {}
  };

  /** Action-sheet modal for Report / Block on other profiles */
  const moreMenuModal = (
    <Modal
      visible={showMoreMenu}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMoreMenu(false)}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
        activeOpacity={1}
        onPress={() => setShowMoreMenu(false)}
      >
        <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32 }}>
          {/* Handle + label */}
          <View style={{ paddingTop: 12, paddingBottom: 12, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F0EDE8" }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#E4E0D8", marginBottom: 8 }} />
            <Text style={{ fontSize: 13, color: "#8A8278", fontWeight: "500" }}>@{profile?.username}</Text>
          </View>

          {/* Report */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 15, paddingHorizontal: 20 }}
            onPress={() => {
              setShowMoreMenu(false);
              Alert.alert("Coming soon", "Report feature will be available in a future update.");
            }}
          >
            <Flag size={19} color="#1A1A1A" />
            <Text style={{ fontSize: 15, color: "#1A1A1A" }}>Report @{profile?.username}</Text>
          </TouchableOpacity>

          {/* Block */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 15, paddingHorizontal: 20 }}
            onPress={() => {
              setShowMoreMenu(false);
              Alert.alert("Coming soon", "Block feature will be available in a future update.");
            }}
          >
            <UserX size={19} color="#DC2626" />
            <Text style={{ fontSize: 15, color: "#DC2626" }}>Block @{profile?.username}</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ marginHorizontal: 16, marginTop: 6, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center" }}
            onPress={() => setShowMoreMenu(false)}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1A1A1A" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (profileLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#E8A900" />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-muted-foreground text-sm">User not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-3">
          <Text className="text-primary text-sm font-medium">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const socialLinks = SOCIAL_FIELDS.map((s) => ({ ...s, url: profile[s.key] })).filter((s) => s.url);
  const initials = profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const TABS = ["redesigns", "saved", "comments", "votes"] as const;

  const header = (
    <>
      {/* Banner */}
      <View
        style={{
          height: 100,
          backgroundImage: undefined,
        }}
        className="bg-[var(--zd-bg-alt)]"
      >
        <View
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
          }}
        />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {/* Avatar + action buttons row */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: -30, marginBottom: 12 }}>
          <View style={{
            width: 68, height: 68, borderRadius: 34,
            backgroundColor: "rgba(232,169,0,0.2)",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            borderWidth: 3, borderColor: "#fff",
          }}>
            {profile.avatarUrl ? (
              <Image source={{ uri: absoluteUrl(profile.avatarUrl) }} style={{ width: 68, height: 68 }} resizeMode="cover" />
            ) : (
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#E8A900" }}>{initials}</Text>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 8, paddingBottom: 4, alignItems: "center" }}>
            {!isOwnProfile && isAuthenticated && (
              <TouchableOpacity
                onPress={() => toggleFollow.mutate()}
                disabled={toggleFollow.isPending}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  borderRadius: 12,
                  backgroundColor: followStatus?.following ? "transparent" : "#E8A900",
                  borderWidth: followStatus?.following ? 1 : 0,
                  borderColor: "#E4E0D8",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {followStatus?.following
                  ? <><UserMinus size={13} color="#8A8278" /><Text style={{ fontSize: 13, fontWeight: "600", color: "#8A8278" }}>Unfollow</Text></>
                  : <><UserPlus size={13} color="#2A2410" /><Text style={{ fontSize: 13, fontWeight: "600", color: "#2A2410" }}>Follow</Text></>}
              </TouchableOpacity>
            )}
            {isOwnProfile && (
              <TouchableOpacity onPress={() => router.push("/profile/edit" as never)} activeOpacity={0.8}
                style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8" }}>
                <Text style={{ fontSize: 13, fontWeight: "600" }} className="text-foreground">Edit profile</Text>
              </TouchableOpacity>
            )}

            {/* Share */}
            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.75}
              style={{ width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center", justifyContent: "center" }}
            >
              <Share2 size={15} color="#8A8278" />
            </TouchableOpacity>

            {/* More — only for others' profiles */}
            {!isOwnProfile && (
              <TouchableOpacity
                onPress={() => setShowMoreMenu(true)}
                activeOpacity={0.75}
                style={{ width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center", justifyContent: "center" }}
              >
                <MoreVertical size={15} color="#8A8278" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Name + badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
          <Text className="text-[1.2rem] font-bold text-foreground tracking-tight" style={{ fontFamily: "BricolageGrotesque-Bold" }}>
            {profile.name}
          </Text>
          {profile.role && (
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, borderColor: "#2D9D6A", backgroundColor: "rgba(45,157,106,0.12)", flexDirection: "row", alignItems: "center", gap: 4 }}>
              {profile.role === "both" && <Swords size={11} color="#2D9D6A" />}
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#2D9D6A", textTransform: profile.role === "both" ? "none" : "uppercase", letterSpacing: 0.5 }}>
                {ROLE_LABEL[profile.role] ?? profile.role}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-sm text-muted-foreground mb-2">
          @{profile.username}{profile.location ? ` · ${profile.location}` : ""}
        </Text>

        {profile.bio && (
          <Text className="text-[0.9rem] text-foreground/80 leading-relaxed mb-3">{profile.bio}</Text>
        )}

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 20, marginBottom: 12 }}>
          {[
            { value: profile.redesignCount, label: "Redesigns" },
            { value: profile.followerCount >= 1000 ? `${(profile.followerCount / 1000).toFixed(1)}k` : profile.followerCount, label: "Followers" },
            { value: profile.votesEarned >= 1000 ? `${(profile.votesEarned / 1000).toFixed(1)}k` : profile.votesEarned, label: "Votes" },
          ].map(({ value, label }) => (
            <View key={label}>
              <Text style={{ fontSize: 15, fontWeight: "700" }} className="text-foreground">{value}</Text>
              <Text className="text-muted-foreground" style={{ fontSize: 11 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
            {socialLinks.map(({ key, label, url }) => (
              <TouchableOpacity
                key={key}
                onPress={() => url && Linking.openURL(url)}
                activeOpacity={0.7}
                style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: "#E4E0D8" }}
              >
                <Text className="text-foreground" style={{ fontSize: 12, fontWeight: "600" }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Tabs */}
        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E4E0D8", marginBottom: 16 }}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
              style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2, borderBottomColor: tab === t ? "#1A1A1A" : "transparent" }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: tab === t ? "#1A1A1A" : "#8A8278", textTransform: "capitalize" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  if (tab !== "redesigns") {
    return (
      <ScrollView className="flex-1 bg-background">
        {moreMenuModal}
        {header}
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text className="text-muted-foreground text-sm">Coming soon.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {moreMenuModal}
      {redesignsLoading ? (
        <>
          <ScrollView>{header}</ScrollView>
          <View className="items-center justify-center py-8">
            <ActivityIndicator color="#E8A900" />
          </View>
        </>
      ) : (
        <FlatList
          data={redesigns ?? []}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          renderItem={({ item }) => <RedesignCard item={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-sm text-muted-foreground">No redesigns yet.</Text>
          }
        />
      )}
    </View>
  );
}
