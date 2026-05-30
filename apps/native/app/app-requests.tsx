import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ArrowLeft, ArrowUp, Plus } from "lucide-react-native";
import { useAppRequests, useCreateAppRequest, useVoteAppRequest } from "@/hooks/use-bookmarks";
import { useAuth } from "@/contexts/auth-context";

type AppRequest = {
  id: string;
  appName: string;
  description: string | null;
  voteCount: number;
  hasVoted: boolean;
  requester: { username: string };
  createdAt: string;
};

function RequestRow({ item, isAuthenticated }: { item: AppRequest; isAuthenticated: boolean }) {
  const vote = useVoteAppRequest(item.id);
  return (
    <View className="flex-row items-start gap-3 mx-4 mb-3 p-4 rounded-2xl border border-border bg-card">
      <TouchableOpacity
        onPress={() => isAuthenticated ? vote.mutate() : router.push("/auth/login" as never)}
        disabled={vote.isPending}
        activeOpacity={0.7}
        className={`items-center px-2.5 py-2 rounded-xl border flex-none ${item.hasVoted ? "border-primary bg-primary/10" : "border-border"}`}
      >
        <ArrowUp size={14} color={item.hasVoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
        <Text className={`text-xs font-semibold mt-0.5 ${item.hasVoted ? "text-primary" : "text-muted-foreground"}`}>{item.voteCount}</Text>
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="font-semibold text-foreground">{item.appName}</Text>
        {item.description ? <Text className="text-sm text-muted-foreground mt-0.5" numberOfLines={2}>{item.description}</Text> : null}
        <Text className="text-xs text-muted-foreground mt-1">@{item.requester.username} · {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
}

export default function AppRequestsScreen() {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const { data: requests, isLoading } = useAppRequests();
  const createRequest = useCreateAppRequest();

  const handleSubmit = () => {
    if (!appName.trim()) return;
    createRequest.mutate(
      { appName: appName.trim(), description: description.trim() || undefined },
      { onSuccess: () => { setShowForm(false); setAppName(""); setDescription(""); } },
    );
  };

  const header = (
    <View className="pt-14 pb-2">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2">
            <ArrowLeft size={16} color="#8A8278" />
            <Text className="text-muted-foreground text-sm">Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>App Requests</Text>
        </View>
        <TouchableOpacity
          onPress={() => isAuthenticated ? setShowForm(!showForm) : router.push("/auth/login" as never)}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-xl bg-primary"
        >
          <Plus size={13} color="#fff" strokeWidth={2.5} />
          <Text className="text-white text-xs font-semibold">Request</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View className="mx-4 mb-4 p-4 rounded-2xl border border-border bg-card">
          <Text className="font-semibold text-foreground mb-3">Request a redesign</Text>
          <Text className="text-xs font-medium text-muted-foreground mb-1">App name *</Text>
          <TextInput
            value={appName}
            onChangeText={setAppName}
            placeholder="e.g. EcoCash, NetOne"
            placeholderTextColor="#8A8278"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground mb-3"
          />
          <Text className="text-xs font-medium text-muted-foreground mb-1">Why does it need a redesign? (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what could be improved..."
            placeholderTextColor="#8A8278"
            multiline
            numberOfLines={3}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground mb-3"
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createRequest.isPending || !appName.trim()}
              activeOpacity={0.8}
              className="flex-1 py-2.5 rounded-xl bg-primary items-center"
            >
              <Text className="text-white font-semibold text-sm">{createRequest.isPending ? "Submitting…" : "Submit"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowForm(false)} activeOpacity={0.7} className="flex-1 py-2.5 rounded-xl border border-border items-center">
              <Text className="text-foreground font-semibold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text className="text-sm text-muted-foreground px-5 mb-3">Vote for the apps you want redesigned next.</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        {header}
        <View className="items-center justify-center py-16"><ActivityIndicator color="#E8A900" /></View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <FlatList
        data={requests ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <RequestRow item={item} isAuthenticated={isAuthenticated} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="font-semibold text-foreground mb-1">No requests yet</Text>
            <Text className="text-muted-foreground text-sm">Be the first to request an app redesign.</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}
