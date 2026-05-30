import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Camera, Upload } from "lucide-react-native";
import { Wordmark } from "@/components/brand/wordmark";
import { useMe, useUpdateProfile } from "@/hooks/use-onboarding";
import { useAuth } from "@/contexts/auth-context";

type Role = "designer" | "developer" | "both";

const ROLES: { id: Role; label: string }[] = [
  { id: "designer", label: "Designer" },
  { id: "developer", label: "Developer" },
  { id: "both", label: "Both" },
];

function StepsBar({ current }: { current: 1 | 2 | 3 }) {
  return (
    <View className="flex-row gap-2 flex-1">
      {([1, 2, 3] as const).map((s) => (
        <View
          key={s}
          className="flex-1 h-1.5 rounded-full"
          style={{
            backgroundColor:
              s < current ? "#2D9D6A" : s === current ? "#E8A900" : "#E4E0D8",
          }}
        />
      ))}
    </View>
  );
}

export default function Step1Screen() {
  const { user } = useAuth();
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const router = useRouter();

  const [form, setForm] = useState({
    name: me?.name ?? user?.name ?? "",
    username: me?.username ?? user?.username ?? "",
    bio: me?.bio ?? "",
    role: (me?.role ?? "designer") as Role,
  });

  const bioLen = form.bio.length;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="px-5 pt-14 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl items-center justify-center bg-muted">
            <Text className="text-muted-foreground text-lg">←</Text>
          </TouchableOpacity>
          <StepsBar current={1} />
          <Text className="text-xs font-mono text-muted-foreground tracking-wider">1/3</Text>
        </View>

        <Text className="text-[1.5rem] font-extrabold text-foreground tracking-tight mb-1"
          style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          Let&apos;s Get You Started
        </Text>
        <Text className="text-[0.92rem] text-muted-foreground mb-6">
          Complete your profile. Everything below is ready to go.
        </Text>

        {/* Avatar */}
        <View className="flex-row items-center gap-4 mb-5">
          <View className="w-[72px] h-[72px] rounded-xl bg-muted border-2 border-dashed border-border items-center justify-center">
            <Camera size={22} color="#8A8278" />
          </View>
          <View>
            <TouchableOpacity className="flex-row items-center gap-2 h-9 px-3.5 rounded-xl border border-border bg-card">
              <Upload size={15} color="#8A8278" />
              <Text className="text-sm font-semibold text-foreground">Upload photo</Text>
            </TouchableOpacity>
            <Text className="text-xs text-muted-foreground mt-1.5">PNG or JPG, optional.</Text>
          </View>
        </View>

        <View className="gap-4">
          {/* Name */}
          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Full name</Text>
            <TextInput
              className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground"
              placeholder="Tinashe Moyo"
              placeholderTextColor="#8A8278"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              autoCapitalize="words"
            />
          </View>

          {/* Username */}
          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Username</Text>
            <Text className="text-xs text-muted-foreground -mt-0.5">Pre-filled from signup.</Text>
            <View className="flex-row items-center">
              <Text className="absolute left-3.5 font-mono text-muted-foreground z-10 text-[0.92rem]">@</Text>
              <TextInput
                className="flex-1 h-11 pl-8 pr-3.5 rounded-xl border border-input bg-card text-foreground"
                placeholder="tinashe"
                placeholderTextColor="#8A8278"
                value={form.username}
                onChangeText={(v) => setForm((f) => ({ ...f, username: v }))}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Bio */}
          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[0.84rem] font-semibold text-foreground">Bio</Text>
              <Text className="text-xs font-mono text-muted-foreground">{bioLen}/160</Text>
            </View>
            <TextInput
              className="px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground"
              placeholder="Designer focused on fixing everyday Zimbabwean apps."
              placeholderTextColor="#8A8278"
              value={form.bio}
              onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))}
              multiline
              numberOfLines={3}
              maxLength={160}
              textAlignVertical="top"
              style={{ minHeight: 80 }}
            />
          </View>

          {/* Role */}
          <View className="gap-2">
            <Text className="text-[0.84rem] font-semibold text-foreground">I am a…</Text>
            <View className="flex-row gap-2">
              {ROLES.map(({ id, label }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => setForm((f) => ({ ...f, role: id }))}
                  className={`flex-1 py-3.5 px-2 rounded-xl border items-center justify-center ${
                    form.role === id
                      ? "border-primary bg-accent"
                      : "border-border bg-card"
                  }`}
                >
                  <Text className={`text-sm font-semibold ${form.role === id ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {updateProfile.isError && (
          <Text className="text-destructive text-sm mt-3">
            {(updateProfile.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save."}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => updateProfile.mutate(form)}
          disabled={updateProfile.isPending}
          className="h-12 mt-6 rounded-xl bg-primary flex-row-reverse items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          {updateProfile.isPending
            ? <ActivityIndicator color="#2A2410" />
            : (
              <>
                <ArrowRight size={18} color="#2A2410" />
                <Text className="font-semibold text-base text-primary-foreground">Continue</Text>
              </>
            )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
