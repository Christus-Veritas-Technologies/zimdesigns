import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { CheckCircle, XCircle, Bell, TrendingUp, TrendingDown } from "lucide-react-native";
import { useAuth } from "@/contexts/auth-context";
import { useAdminStats, useAdminAppRequests, useApproveAppRequest, useDenyAppRequest } from "@/hooks/use-admin";
import type { PendingAppRequest } from "@/hooks/use-admin";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function abs(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

const AVATAR_COLORS = ["#E8A900", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B"];
const TABS = ["Overview", "App requests", "Original apps", "Redesigns", "Designers"];

function AppAvatar({ name }: { name: string }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <View className="w-9 h-9 rounded-xl flex-none items-center justify-center" style={{ backgroundColor: color }}>
      <Text className="text-white font-bold text-sm">{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

function StatCard({ label, value, subtitle, trend }: { label: string; value: number | string; subtitle?: string; trend?: number }) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-card p-4">
      <Text className="text-xs text-muted-foreground mb-1">{label}</Text>
      <Text className="text-2xl font-extrabold text-foreground mb-0.5" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
        {value}
      </Text>
      {subtitle ? (
        <View className="flex-row items-center gap-1">
          {trend !== undefined && trend > 0 ? (
            <TrendingUp size={10} color="#10B981" />
          ) : trend !== undefined && trend < 0 ? (
            <TrendingDown size={10} color="#EF4444" />
          ) : null}
          <Text className="text-[10px] text-muted-foreground">{subtitle}</Text>
        </View>
      ) : null}
    </View>
  );
}

function RequestRow({ req }: { req: PendingAppRequest }) {
  const approve = useApproveAppRequest();
  const deny = useDenyAppRequest();
  const diff = Date.now() - new Date(req.createdAt).getTime();
  const days = Math.floor(diff / 86400000);
  const age = days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;

  return (
    <View className="flex-row items-start gap-3 py-4 border-b border-border mx-4">
      <AppAvatar name={req.appName} />

      <View className="flex-1">
        <View className="flex-row items-center gap-2 flex-wrap mb-0.5">
          <Text className="font-semibold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            {req.appName}
          </Text>
          <View className="rounded-full px-2 py-0.5 bg-yellow-100">
            <Text className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide">{req.voteCount} want this</Text>
          </View>
        </View>
        {req.description ? (
          <Text className="text-xs text-muted-foreground mb-1" numberOfLines={1}>{req.description}</Text>
        ) : null}
        <Text className="text-xs text-muted-foreground">@{req.requester.username} · {age}</Text>
      </View>

      <View className="flex-row gap-1.5 flex-none">
        <TouchableOpacity
          onPress={() => approve.mutate(req.id)}
          disabled={approve.isPending || deny.isPending}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl border border-green-200 bg-green-50"
        >
          <CheckCircle size={13} color="#16A34A" />
          <Text className="text-xs font-semibold text-green-700">Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deny.mutate(req.id)}
          disabled={approve.isPending || deny.isPending}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50"
        >
          <XCircle size={13} color="#DC2626" />
          <Text className="text-xs font-semibold text-red-700">Deny</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: requests, isLoading: reqLoading } = useAdminAppRequests();

  if (!user || user.role !== "ADMIN") {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="font-semibold text-foreground mb-2">Access denied</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-sm">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-14 px-5 pb-4 border-b border-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            ZimDesigns
          </Text>
          <View className="bg-primary rounded-full px-2 py-0.5">
            <Text className="text-[9px] font-bold text-primary-foreground uppercase tracking-wide">ADMIN</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity activeOpacity={0.7}>
            <Bell size={20} color="#8A8278" />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full bg-muted overflow-hidden">
            {user.avatarUrl ? (
              <Image source={{ uri: abs(user.avatarUrl) }} className="w-8 h-8" resizeMode="cover" />
            ) : (
              <Text className="text-xs font-bold text-muted-foreground text-center leading-8">
                {user.name.charAt(0)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-border"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
            className={`flex-row items-center gap-1.5 px-4 py-2 rounded-xl ${activeTab === tab ? "bg-foreground" : "bg-accent"}`}
          >
            <Text className={`text-sm font-semibold ${activeTab === tab ? "text-background" : "text-muted-foreground"}`}>
              {tab}
            </Text>
            {tab === "App requests" && requests && (
              <View className={`rounded-full px-1.5 py-0.5 ${activeTab === tab ? "bg-background/20" : "bg-primary/20"}`}>
                <Text className={`text-[9px] font-bold ${activeTab === tab ? "text-background" : "text-primary"}`}>
                  {requests.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Page heading */}
        <View className="px-5 pt-5 pb-4 flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            {activeTab}
          </Text>
        </View>

        {activeTab === "Overview" && (
          <>
            {/* Stats grid */}
            <View className="px-5 mb-6">
              {statsLoading ? (
                <View className="flex-row flex-wrap gap-3">
                  {[1,2,3,4].map((i) => (
                    <View key={i} className="rounded-2xl bg-muted h-24" style={{ flex: 1, minWidth: "45%" }} />
                  ))}
                </View>
              ) : stats ? (
                <>
                  <View className="flex-row gap-3 mb-3">
                    <StatCard label="Requests pending" value={stats.pendingRequests} subtitle="Needs action" />
                    <StatCard label="Live apps" value={stats.liveApps} subtitle="+2 this week" />
                  </View>
                  <View className="flex-row gap-3">
                    <StatCard
                      label="Redesigns / week"
                      value={stats.redesignsThisWeek}
                      trend={stats.redesignsGrowth}
                      subtitle={`${stats.redesignsGrowth > 0 ? "+" : ""}${stats.redesignsGrowth}%`}
                    />
                    <StatCard
                      label="New designers"
                      value={stats.newDesigners}
                      trend={stats.designersGrowth}
                      subtitle={`${stats.designersGrowth > 0 ? "+" : ""}${stats.designersGrowth}%`}
                    />
                  </View>
                </>
              ) : null}
            </View>

            {/* Pending requests section */}
            <View className="px-5 mb-3 flex-row items-center gap-2">
              <Text className="font-bold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
                Pending review
              </Text>
              {requests && (
                <View className="bg-primary/10 rounded-full px-2 py-0.5">
                  <Text className="text-xs font-bold text-primary">{requests.length}</Text>
                </View>
              )}
            </View>
            <View className="rounded-2xl border border-border bg-card mx-4">
              {reqLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator color="#E8A900" />
                </View>
              ) : !requests || requests.length === 0 ? (
                <View className="items-center py-10">
                  <Text className="font-semibold text-foreground mb-1">No pending requests</Text>
                  <Text className="text-sm text-muted-foreground">All app requests have been reviewed.</Text>
                </View>
              ) : (
                requests.map((req) => <RequestRow key={req.id} req={req} />)
              )}
            </View>
          </>
        )}

        {activeTab !== "Overview" && (
          <View className="items-center justify-center py-20">
            <Text className="text-muted-foreground text-sm">Coming soon</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
