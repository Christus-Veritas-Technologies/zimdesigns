import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ArrowUp } from "lucide-react-native";
import { useProfile, useUserRedesigns } from "@/hooks/use-profiles";
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

function RedesignCard({ item }: { item: Redesign }) {
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

export default function ProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { data: profile, isLoading: profileLoading, isError } = useProfile(username);
  const { data: redesigns, isLoading: redesignsLoading } = useUserRedesigns(username);

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

  const header = (
    <>
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center gap-2 px-5 pt-14 pb-4"
        activeOpacity={0.7}
      >
        <ArrowLeft size={16} color="#8A8278" />
        <Text className="text-muted-foreground text-sm">Back</Text>
      </TouchableOpacity>

      <View className="mx-4 mb-5 p-4 rounded-2xl border border-border bg-card">
        <View className="flex-row gap-4 items-center mb-3">
          <View className="w-16 h-16 rounded-2xl bg-primary/20 items-center justify-center overflow-hidden flex-none">
            {profile.avatarUrl ? (
              <Image source={{ uri: absoluteUrl(profile.avatarUrl) }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-2xl font-extrabold text-primary">{profile.name.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-foreground tracking-tight" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
              {profile.name}
            </Text>
            <Text className="text-sm text-muted-foreground">@{profile.username}</Text>
            {profile.role && (
              <View className="mt-1 self-start px-2 py-0.5 rounded-full bg-primary/10">
                <Text className="text-xs font-medium text-primary">{ROLE_LABEL[profile.role] ?? profile.role}</Text>
              </View>
            )}
          </View>
        </View>

        {profile.bio && (
          <Text className="text-sm text-foreground/80 leading-relaxed mb-2">{profile.bio}</Text>
        )}

        <Text className="text-xs text-muted-foreground">
          {profile.redesignCount} redesign{profile.redesignCount !== 1 ? "s" : ""}
          {" · "}Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </Text>
      </View>

      <Text className="font-semibold text-foreground px-5 mb-3">Redesigns</Text>
    </>
  );

  return (
    <View className="flex-1 bg-background">
      {redesignsLoading ? (
        <>
          {header}
          <View className="items-center justify-center py-8">
            <ActivityIndicator color="#E8A900" />
          </View>
        </>
      ) : (
        <FlatList
          data={redesigns ?? []}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={header}
          contentContainerClassName="px-3 pb-8"
          columnWrapperClassName="mb-0"
          renderItem={({ item }) => <RedesignCard item={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-sm text-muted-foreground px-2">No redesigns yet.</Text>
          }
        />
      )}
    </View>
  );
}
