import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Sparkles, ArrowRight, Trophy, BookOpen } from "lucide-react-native";
import { useCollections, useChallenges, type Collection, type Challenge } from "@/hooks/use-discover";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

const PLACEHOLDER_CHALLENGES: Challenge[] = [
  { id: "1", title: "Redesign the EcoCash checkout", slug: "ecocash-checkout", description: "Simplify the payment flow", gradientFrom: "#E8A900", gradientTo: "#FF6B35", appName: "EcoCash" },
  { id: "2", title: "ZESA app — first-time setup", slug: "zesa-onboarding", description: "Improve new user onboarding", gradientFrom: "#3B82F6", gradientTo: "#8B5CF6", appName: "ZESA" },
  { id: "3", title: "NetOne data bundle UI", slug: "netone-bundles", description: "Make bundle selection clearer", gradientFrom: "#10B981", gradientTo: "#3B82F6", appName: "NetOne" },
  { id: "4", title: "CBZ Mobile — dashboard", slug: "cbz-dashboard", description: "Modern banking dashboard", gradientFrom: "#F59E0B", gradientTo: "#EF4444", appName: "CBZ" },
];

function SectionHeader({ title, subtitle, onSeeAll }: { title: string; subtitle?: string; onSeeAll?: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 }}>
      <View>
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 16, fontWeight: "700", color: "#1A1A1A" }}>{title}</Text>
        {subtitle && <Text style={{ fontSize: 11, color: "#8A8278", marginTop: 2 }}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#E8A900" }}>See all</Text>
          <ArrowRight size={12} color="#E8A900" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function SpotlightCard({ collection }: { collection: Collection }) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/collections/${collection.id}` as never)}
      style={{ marginHorizontal: 16, borderRadius: 20, overflow: "hidden", aspectRatio: 16 / 7, backgroundColor: "#E8A900" }}
    >
      {collection.coverImageUrl && (
        <Image source={{ uri: absoluteUrl(collection.coverImageUrl) }} style={{ position: "absolute", width: "100%", height: "100%" }} resizeMode="cover" />
      )}
      <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }} />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <View style={{ backgroundColor: "#E8A900", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 9, fontWeight: "700", color: "#2A2410", textTransform: "uppercase" }}>✦ Spotlight</Text>
          </View>
        </View>
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 }} numberOfLines={2}>
          {collection.title}
        </Text>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }} numberOfLines={1}>
          {collection.redesignCount} redesigns · Curated by {collection.curator.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ChallengeCard({ challenge, size }: { challenge: Challenge; size: number }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/search?challenge=${challenge.slug}` as never)}
      style={{
        width: size,
        aspectRatio: 1,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: challenge.gradientFrom,
      }}
    >
      <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
      {challenge.appName && (
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 9, fontWeight: "600", color: "#fff" }}>{challenge.appName}</Text>
          </View>
        </View>
      )}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12 }}>
        <Trophy size={16} color="rgba(255,255,255,0.6)" style={{ marginBottom: 4 }} />
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 12, fontWeight: "700", color: "#fff" }} numberOfLines={2}>
          {challenge.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/collections/${collection.id}` as never)}
      style={{ width: 200, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E4E0D8", backgroundColor: "#fff" }}
    >
      <View style={{ aspectRatio: 16 / 9, backgroundColor: "#F5F3EE", position: "relative" }}>
        {collection.coverImageUrl ? (
          <Image source={{ uri: absoluteUrl(collection.coverImageUrl) }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={24} color="#C4BDB5" />
          </View>
        )}
        <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.2)" }} />
        <View style={{ position: "absolute", bottom: 6, left: 10 }}>
          <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>{collection.redesignCount} redesigns</Text>
        </View>
      </View>
      <View style={{ padding: 10, gap: 4 }}>
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 13, fontWeight: "700", color: "#1A1A1A" }} numberOfLines={2}>{collection.title}</Text>
        <Text style={{ fontSize: 11, color: "#8A8278" }}>{collection.curator.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function DiscoverTab() {
  const insets = useSafeAreaInsets();
  const { data: collections, isLoading: collectionsLoading } = useCollections();
  const { data: challenges, isLoading: challengesLoading } = useChallenges();

  const featuredCollection = collections?.find((c) => c.isFeatured) ?? collections?.[0];
  const otherCollections = collections?.filter((c) => c.id !== featuredCollection?.id) ?? [];
  const displayChallenges = (challenges && challenges.length > 0) ? challenges : PLACEHOLDER_CHALLENGES;

  const CARD_SIZE = 140;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "var(--background, #fff)" }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, marginBottom: 20 }}>
        <Sparkles size={18} color="#E8A900" />
        <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 22, fontWeight: "700" }} className="text-foreground">
          Discover
        </Text>
      </View>

      {/* Spotlight */}
      <View style={{ marginBottom: 28 }}>
        {collectionsLoading ? (
          <View style={{ marginHorizontal: 16, aspectRatio: 16 / 7, borderRadius: 20, backgroundColor: "#F0EDE8", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#E8A900" />
          </View>
        ) : featuredCollection ? (
          <SpotlightCard collection={featuredCollection} />
        ) : (
          <View style={{ marginHorizontal: 16, aspectRatio: 16 / 7, borderRadius: 20, backgroundColor: "rgba(232,169,0,0.1)", borderWidth: 1, borderColor: "rgba(232,169,0,0.2)", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Sparkles size={28} color="#E8A900" />
            <Text style={{ fontFamily: "BricolageGrotesque-Bold", fontSize: 15, fontWeight: "700" }} className="text-foreground">Collections coming soon</Text>
            <TouchableOpacity
              onPress={() => router.push("/search" as never)}
              style={{ marginTop: 4, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E8A900" }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#2A2410" }}>Browse all redesigns</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Challenges */}
      <View style={{ marginBottom: 28 }}>
        <SectionHeader title="Design Challenges" subtitle="Pick a challenge and show your take" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {challengesLoading ? (
            [1,2,3,4].map((i) => <View key={i} style={{ width: CARD_SIZE, aspectRatio: 1, borderRadius: 16, backgroundColor: "#F0EDE8" }} />)
          ) : (
            displayChallenges.slice(0, 4).map((c) => <ChallengeCard key={c.id} challenge={c} size={CARD_SIZE} />)
          )}
        </ScrollView>
      </View>

      {/* Collections */}
      <View>
        <SectionHeader title="Curated Collections" subtitle="Themed sets picked by the community" />
        {collectionsLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {[1,2,3].map((i) => <View key={i} style={{ width: 200, aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: "#F0EDE8" }} />)}
          </ScrollView>
        ) : otherCollections.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {otherCollections.map((c) => <CollectionCard key={c.id} collection={c} />)}
          </ScrollView>
        ) : (
          <View style={{ marginHorizontal: 16, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#E4E0D8", alignItems: "center", gap: 8 }}>
            <BookOpen size={24} color="#C4BDB5" />
            <Text style={{ fontSize: 14, fontWeight: "600" }} className="text-foreground">No collections yet</Text>
            <Text style={{ fontSize: 12, color: "#8A8278", textAlign: "center" }}>Collections will appear here once curated by the team.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
