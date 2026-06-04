import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Camera, Save } from "lucide-react-native";
import { useMe, useUpdateProfileSettings } from "@/hooks/use-onboarding";

// Simple brand-matching colors for social icons (lucide-react-native icons used below)
const SOCIAL_FIELDS = [
  { key: "linkedinUrl", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname", color: "#0A66C2" },
  { key: "githubUrl", label: "GitHub", placeholder: "https://github.com/yourname", color: "#24292f" },
  { key: "dribbbleUrl", label: "Dribbble", placeholder: "https://dribbble.com/yourname", color: "#EA4C89" },
  { key: "twitterUrl", label: "X (Twitter)", placeholder: "https://x.com/yourname", color: "#000000" },
  { key: "websiteUrl", label: "Website", placeholder: "https://yoursite.com", color: "#8A8278" },
] as const;

// Social icons as emoji fallbacks (lucide-react-native doesn't have all brand icons)
const SOCIAL_ICONS: Record<string, string> = {
  linkedinUrl: "in",
  githubUrl: "gh",
  dribbbleUrl: "db",
  twitterUrl: "𝕏",
  websiteUrl: "🌐",
};

const ROLES = [
  { id: "designer", label: "Designer" },
  { id: "developer", label: "Developer" },
  { id: "both", label: "Both" },
] as const;

export default function EditProfileScreen() {
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfileSettings();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<"designer" | "developer" | "both">("designer");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [avatar, setAvatar] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [initialised, setInitialised] = useState(false);

  if (me && !initialised) {
    setName(me.name ?? "");
    setUsername(me.username ?? "");
    setBio(me.bio ?? "");
    setRole((me.role as typeof role) ?? "designer");
    setLinks({
      linkedinUrl: me.linkedinUrl ?? "",
      githubUrl: me.githubUrl ?? "",
      dribbbleUrl: me.dribbbleUrl ?? "",
      twitterUrl: me.twitterUrl ?? "",
      websiteUrl: me.websiteUrl ?? "",
    });
    setInitialised(true);
  }

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.uri.split(".").pop() ?? "jpg";
      setAvatar({ uri: asset.uri, name: `avatar.${ext}`, type: asset.mimeType ?? `image/${ext}` });
    }
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("username", username);
    fd.append("bio", bio);
    fd.append("role", role);
    for (const [k, v] of Object.entries(links)) fd.append(k, v);
    if (avatar) fd.append("avatar", avatar as never);

    update.mutate(fd, {
      onSuccess: () => {
        Alert.alert("Saved", "Your profile has been updated.");
        router.back();
      },
      onError: (err) => {
        const msg = (err as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save.";
        Alert.alert("Error", msg);
      },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#E8A900" />
      </View>
    );
  }

  const avatarSrc = avatar?.uri ?? me?.avatarUrl ?? null;

  return (
    <ScrollView
      contentContainerClassName="px-5 pt-14 pb-10 bg-background flex-grow"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl items-center justify-center bg-muted">
          <ArrowLeft size={18} color="#8A8278" />
        </TouchableOpacity>
        <View>
          <Text className="text-[1.4rem] font-extrabold text-foreground tracking-tight" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
            Edit Profile
          </Text>
          <Text className="text-xs text-muted-foreground">Update your info and links.</Text>
        </View>
      </View>

      {/* Avatar picker */}
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85} style={{ width: 96, height: 96 }} className="relative">
          <View className="w-full h-full rounded-full bg-primary/20 items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <Image source={{ uri: avatarSrc }} style={{ width: 96, height: 96 }} resizeMode="cover" />
            ) : (
              <Text className="text-3xl font-extrabold text-primary">{(me?.name ?? "?").charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center"
            style={{ borderWidth: 2, borderColor: "white" }}
          >
            <Camera size={14} color="#2A2410" />
          </View>
        </TouchableOpacity>
        <Text className="text-xs text-muted-foreground mt-2">PNG or JPG · max 5 MB</Text>
      </View>

      <View className="gap-4 mb-6">
        {/* Name */}
        <View className="gap-1.5">
          <Text className="text-[0.84rem] font-semibold text-foreground">Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            maxLength={100}
            editable={!update.isPending}
            className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground"
            placeholderTextColor="#8A8278"
          />
        </View>

        {/* Username */}
        <View className="gap-1.5">
          <Text className="text-[0.84rem] font-semibold text-foreground">Username</Text>
          <View className="flex-row items-center">
            <Text className="absolute left-3.5 font-mono text-muted-foreground z-10 text-[0.92rem]">@</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              maxLength={30}
              autoCapitalize="none"
              editable={!update.isPending}
              className="flex-1 h-11 pl-8 pr-3.5 rounded-xl border border-input bg-card text-foreground"
              placeholderTextColor="#8A8278"
            />
          </View>
        </View>

        {/* Bio */}
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[0.84rem] font-semibold text-foreground">Bio</Text>
            <Text className="text-xs font-mono text-muted-foreground">{bio.length}/160</Text>
          </View>
          <TextInput
            value={bio}
            onChangeText={setBio}
            maxLength={160}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!update.isPending}
            className="px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground"
            style={{ minHeight: 80 }}
            placeholderTextColor="#8A8278"
          />
        </View>

        {/* Role */}
        <View className="gap-2">
          <Text className="text-[0.84rem] font-semibold text-foreground">I am a…</Text>
          <View className="flex-row gap-2">
            {ROLES.map(({ id, label }) => (
              <TouchableOpacity
                key={id}
                onPress={() => setRole(id)}
                className={`flex-1 py-3 rounded-xl border items-center ${role === id ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <Text className={`text-sm font-semibold ${role === id ? "text-primary" : "text-foreground"}`}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Social links */}
      <View className="border-t border-border pt-5 gap-3 mb-6">
        <Text className="text-[0.84rem] font-semibold text-foreground">Social links</Text>
        {SOCIAL_FIELDS.map(({ key, label, placeholder, color }) => (
          <View key={key} className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-xl border border-border bg-card items-center justify-center flex-none">
              <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{SOCIAL_ICONS[key]}</Text>
            </View>
            <TextInput
              value={links[key] ?? ""}
              onChangeText={(v) => setLinks((s) => ({ ...s, [key]: v }))}
              placeholder={placeholder}
              placeholderTextColor="#8A8278"
              autoCapitalize="none"
              keyboardType="url"
              editable={!update.isPending}
              className="flex-1 h-11 px-3.5 rounded-xl border border-input bg-card text-foreground text-sm"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={update.isPending}
        activeOpacity={0.85}
        className="h-12 rounded-xl bg-primary flex-row items-center justify-center gap-2"
      >
        {update.isPending ? (
          <ActivityIndicator color="#2A2410" />
        ) : (
          <>
            <Save size={16} color="#2A2410" />
            <Text className="font-semibold text-base text-primary-foreground">Save Changes</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
