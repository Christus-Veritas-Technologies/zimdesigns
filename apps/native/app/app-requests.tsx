import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { ArrowLeft, ArrowUp, Flag, Globe, TrendingUp, Clock, X } from "lucide-react-native";
import { useAppRequests, useCreateAppRequest, useVoteAppRequest } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";

const CATEGORIES = ["Banking", "Telecoms", "Transit", "Government", "E-commerce", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: "Under Review", bg: "#FEF3C7", text: "#92400E" },
  approved: { label: "Approved", bg: "#D1FAE5", text: "#065F46" },
  live: { label: "Now Live", bg: "#DBEAFE", text: "#1E40AF" },
  denied: { label: "Denied", bg: "#FEE2E2", text: "#991B1B" },
};

const AVATAR_COLORS = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];

type AppRequest = {
  id: string;
  appName: string;
  description: string | null;
  voteCount: number;
  hasVoted: boolean;
  status: string;
  requester: { username: string };
  createdAt: string;
};

function RequestRow({ item, isAuthenticated }: { item: AppRequest; isAuthenticated: boolean }) {
  const vote = useVoteAppRequest(item.id);
  const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.open;
  const avatarColor = AVATAR_COLORS[item.appName.charCodeAt(0) % AVATAR_COLORS.length];
  const diff = Date.now() - new Date(item.createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  const age = days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;

  return (
    <View className="flex-row items-start gap-3 mx-4 mb-0 py-4 border-b border-border">
      {/* Vote pill */}
      <TouchableOpacity
        onPress={() => isAuthenticated ? vote.mutate() : router.push("/auth/login" as never)}
        disabled={vote.isPending}
        activeOpacity={0.7}
        className={`items-center px-2.5 py-2 rounded-xl border flex-none min-w-[42px] ${item.hasVoted ? "border-primary bg-primary/10" : "border-border"}`}
      >
        <ArrowUp size={13} color={item.hasVoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
        <Text className={`text-xs font-bold mt-0.5 ${item.hasVoted ? "text-primary" : "text-muted-foreground"}`}>
          {item.voteCount}
        </Text>
      </TouchableOpacity>

      {/* App avatar */}
      <View className="w-10 h-10 rounded-xl flex-none items-center justify-center" style={{ backgroundColor: avatarColor }}>
        <Text className="text-white font-bold text-sm">{item.appName.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 flex-wrap mb-0.5">
          <Text className="font-semibold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            {item.appName}
          </Text>
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: status.bg }}>
            <Text className="text-[9px] font-bold uppercase tracking-wide" style={{ color: status.text }}>
              {status.label}
            </Text>
          </View>
        </View>
        {item.description ? (
          <Text className="text-sm text-muted-foreground mb-1" numberOfLines={2}>{item.description}</Text>
        ) : null}
        <Text className="text-xs text-muted-foreground">@{item.requester.username} · {age}</Text>
      </View>
    </View>
  );
}

function SuggestModal({ visible, onClose, isAuthenticated }: {
  visible: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}) {
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const createRequest = useCreateAppRequest();

  const handleSubmit = () => {
    if (!isAuthenticated) { onClose(); router.push("/auth/login" as never); return; }
    if (!appName.trim()) return;
    createRequest.mutate(
      { appName: appName.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setAppName(""); setCategory(""); setDescription(""); setAppUrl("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          {/* Modal header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
              Suggest an app
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-accent items-center justify-center">
              <X size={16} color="#8A8278" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-muted-foreground mb-6">Know an app that needs a redesign? Tell the community.</Text>

          {/* App name */}
          <Text className="text-xs font-semibold text-foreground mb-1.5">App name *</Text>
          <TextInput
            value={appName}
            onChangeText={setAppName}
            placeholder="e.g. EcoCash, NetOne, ZESA"
            placeholderTextColor="#8A8278"
            className="w-full px-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground mb-4"
          />

          {/* Category */}
          <Text className="text-xs font-semibold text-foreground mb-2">Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(category === cat ? "" : cat)}
                activeOpacity={0.8}
                className={`px-3 py-1.5 rounded-full border ${category === cat ? "bg-primary border-primary" : "border-border"}`}
              >
                <Text className={`text-xs font-medium ${category === cat ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text className="text-xs font-semibold text-foreground mb-1.5">Why does it need fixing?</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what's broken or what could be improved..."
            placeholderTextColor="#8A8278"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="w-full px-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground mb-4"
            style={{ minHeight: 80 }}
          />

          {/* App URL */}
          <Text className="text-xs font-semibold text-foreground mb-1.5">App link (optional)</Text>
          <View className="relative mb-6">
            <View className="absolute left-3 top-0 bottom-0 justify-center" style={{ zIndex: 1 }}>
              <Globe size={14} color="#8A8278" />
            </View>
            <TextInput
              value={appUrl}
              onChangeText={setAppUrl}
              placeholder="https://play.google.com/..."
              placeholderTextColor="#8A8278"
              keyboardType="url"
              autoCapitalize="none"
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={createRequest.isPending || !appName.trim()}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 py-3.5 rounded-xl bg-primary"
            style={{ opacity: !appName.trim() ? 0.6 : 1 }}
          >
            <Flag size={16} color="#000" strokeWidth={2} />
            <Text className="text-primary-foreground font-bold text-sm">
              {createRequest.isPending ? "Submitting…" : "Submit request"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function AppRequestsScreen() {
  const { isAuthenticated } = useAuth();
  const [sort, setSort] = useState<"votes" | "recent">("votes");
  const [modalVisible, setModalVisible] = useState(false);
  const { data: rawRequests, isLoading } = useAppRequests();

  const requests = useMemo(
    () =>
      rawRequests
        ? [...rawRequests].sort((a, b) =>
            sort === "votes"
              ? b.voteCount - a.voteCount
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        : undefined,
    [rawRequests, sort],
  );

  const header = (
    <View className="bg-background">
      {/* Top nav */}
      <View className="flex-row items-center justify-between pt-14 px-5 pb-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2">
          <ArrowLeft size={16} color="#8A8278" />
          <Text className="text-muted-foreground text-sm">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Heading */}
      <View className="px-5 mb-6">
        <Text className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          What app needs fixing?
        </Text>
        <Text className="text-sm text-muted-foreground">Vote for apps you want designers to redesign next.</Text>
      </View>

      {/* Sort & count row */}
      <View className="flex-row items-center justify-between px-5 mb-3">
        <Text className="font-bold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          Community requests{" "}
          <Text className="font-normal text-muted-foreground">· {requests?.length ?? 0}</Text>
        </Text>
        <View className="flex-row gap-1">
          <TouchableOpacity onPress={() => setSort("votes")} activeOpacity={0.7}
            className={`flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg ${sort === "votes" ? "bg-accent" : ""}`}>
            <TrendingUp size={11} color={sort === "votes" ? "#E8A900" : "#8A8278"} />
            <Text className={`text-xs font-medium ${sort === "votes" ? "text-foreground" : "text-muted-foreground"}`}>Top</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSort("recent")} activeOpacity={0.7}
            className={`flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg ${sort === "recent" ? "bg-accent" : ""}`}>
            <Clock size={11} color={sort === "recent" ? "#E8A900" : "#8A8278"} />
            <Text className={`text-xs font-medium ${sort === "recent" ? "text-foreground" : "text-muted-foreground"}`}>Recent</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <SuggestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isAuthenticated={isAuthenticated}
      />

      {isLoading ? (
        <>
          {header}
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#E8A900" />
          </View>
        </>
      ) : (
        <FlatList
          data={requests ?? []}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          renderItem={({ item }) => <RequestRow item={item} isAuthenticated={isAuthenticated} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Text className="font-semibold text-foreground mb-1">No requests yet</Text>
              <Text className="text-muted-foreground text-sm">Be the first to request an app.</Text>
            </View>
          }
        />
      )}

      {/* Sticky bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-background border-t border-border">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2 py-3.5 rounded-xl bg-primary"
        >
          <Flag size={16} color="#000" strokeWidth={2} />
          <Text className="text-primary-foreground font-bold">Suggest an app</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
