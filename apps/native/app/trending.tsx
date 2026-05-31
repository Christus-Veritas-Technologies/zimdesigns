import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ArrowUp, TrendingUp, Users } from "lucide-react-native";
import { useTrending } from "@/hooks/use-bookmarks";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

const ROLE_LABEL: Record<string, string> = {
  designer: "Designer",
  developer: "Developer",
  both: "Designer & Developer",
};

export default function TrendingScreen() {
  const { data, isLoading } = useTrending();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2">
          <ArrowLeft size={16} color="#8A8278" />
          <Text className="text-muted-foreground text-sm">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>Trending</Text>
      </View>

      {isLoading ? (
        <View className="items-center justify-center py-16"><ActivityIndicator color="#E8A900" /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Top Redesigns */}
          <View className="px-5 mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <TrendingUp size={15} color="#E8A900" />
              <Text className="font-semibold text-foreground">Top Redesigns this week</Text>
            </View>
            {data?.topRedesigns?.length === 0 && (
              <Text className="text-sm text-muted-foreground">No redesigns this week yet.</Text>
            )}
            {data?.topRedesigns?.map((r, i) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => router.push(`/redesigns/${r.id}` as never)}
                activeOpacity={0.8}
                className="flex-row items-center gap-3 mb-2 p-3 rounded-2xl border border-border bg-card"
              >
                <Text className="text-base font-extrabold w-5 text-center" style={{ color: "rgba(232,169,0,0.5)" }}>{i + 1}</Text>
                <View className="w-12 h-9 rounded-lg overflow-hidden bg-muted flex-none">
                  <Image source={{ uri: absoluteUrl(r.afterUrl) }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-foreground" numberOfLines={1}>{r.title}</Text>
                  <Text className="text-xs text-muted-foreground">{r.appName} · @{r.author.username}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <ArrowUp size={11} color="#8A8278" strokeWidth={2.5} />
                  <Text className="text-xs font-semibold text-muted-foreground">{r.upvoteCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Top Designers */}
          <View className="px-5">
            <View className="flex-row items-center gap-2 mb-3">
              <Users size={15} color="#E8A900" />
              <Text className="font-semibold text-foreground">Top Designers</Text>
            </View>
            {data?.topDesigners?.length === 0 && (
              <Text className="text-sm text-muted-foreground">No designers yet.</Text>
            )}
            {data?.topDesigners?.map((d, i) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => router.push(`/users/${d.username}` as never)}
                activeOpacity={0.8}
                className="flex-row items-center gap-3 mb-2 p-3 rounded-2xl border border-border bg-card"
              >
                <Text className="text-sm font-extrabold w-5 text-center" style={{ color: "rgba(232,169,0,0.5)" }}>{i + 1}</Text>
                <View className="w-9 h-9 rounded-xl bg-primary/20 items-center justify-center overflow-hidden flex-none">
                  {d.avatarUrl ? (
                    <Image source={{ uri: absoluteUrl(d.avatarUrl) }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <Text className="text-sm font-extrabold text-primary">{d.name.charAt(0).toUpperCase()}</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-foreground" numberOfLines={1}>{d.name}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {d.role ? ROLE_LABEL[d.role] ?? d.role : "@" + d.username} · {d.redesignCount} redesign{d.redesignCount !== 1 ? "s" : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
