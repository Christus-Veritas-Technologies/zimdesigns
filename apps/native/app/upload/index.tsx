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
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Upload, ImageIcon, Check, X, ArrowLeft } from "lucide-react-native";
import { useCreateRedesign } from "@/hooks/use-redesigns";

const TAG_OPTIONS = [
  "Mobile Apps", "Web Apps", "Banking", "E-commerce",
  "Social Media", "Fintech", "Government", "Health", "Other",
];

interface PickedImage {
  uri: string;
  name: string;
  type: string;
}

function ImageSlot({
  label,
  image,
  onPick,
}: {
  label: string;
  image: PickedImage | null;
  onPick: (img: PickedImage) => void;
}) {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const ext = asset.uri.split(".").pop() ?? "jpg";
      onPick({ uri: asset.uri, name: `${label.toLowerCase()}.${ext}`, type: asset.mimeType ?? `image/${ext}` });
    }
  };

  return (
    <View className="flex-1 gap-1.5">
      <Text className="text-[0.84rem] font-semibold text-foreground">{label}</Text>
      <TouchableOpacity
        onPress={pick}
        activeOpacity={0.8}
        className="rounded-xl border-2 border-dashed border-border bg-muted/40 items-center justify-center overflow-hidden"
        style={{ aspectRatio: 4 / 3 }}
      >
        {image ? (
          <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="items-center gap-2 p-4">
            <View className="w-10 h-10 rounded-xl bg-muted items-center justify-center">
              <ImageIcon size={18} color="#8A8278" />
            </View>
            <Text className="text-xs text-muted-foreground text-center">Tap to pick image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function UploadScreen() {
  const create = useCreateRedesign();
  const [title, setTitle] = useState("");
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [before, setBefore] = useState<PickedImage | null>(null);
  const [after, setAfter] = useState<PickedImage | null>(null);

  const toggleTag = (t: string) =>
    setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const valid = title.trim() && appName.trim() && before && after;

  const handleSubmit = () => {
    if (!valid) return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("appName", appName.trim());
    if (description.trim()) fd.append("description", description.trim());
    fd.append("tags", JSON.stringify(tags));
    fd.append("before", { uri: before!.uri, name: before!.name, type: before!.type } as never);
    fd.append("after", { uri: after!.uri, name: after!.name, type: after!.type } as never);

    create.mutate(fd, {
      onSuccess: (r) => {
        router.replace(`/redesigns/${r.id}` as never);
      },
      onError: () => {
        Alert.alert("Upload failed", "Please try again.");
      },
    });
  };

  return (
    <ScrollView
      contentContainerClassName="px-5 pt-14 pb-10 bg-background flex-grow"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl items-center justify-center bg-muted"
        >
          <ArrowLeft size={18} color="#8A8278" />
        </TouchableOpacity>
        <View>
          <Text
            className="text-[1.4rem] font-extrabold text-foreground tracking-tight"
            style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
          >
            Upload Redesign
          </Text>
          <Text className="text-xs text-muted-foreground">Show how you&apos;d improve an app.</Text>
        </View>
      </View>

      {/* Images */}
      <View className="flex-row gap-3 mb-5">
        <ImageSlot label="Before" image={before} onPick={setBefore} />
        <ImageSlot label="After" image={after} onPick={setAfter} />
      </View>

      <View className="gap-4 mb-6">
        {/* Title */}
        <View className="gap-1.5">
          <Text className="text-[0.84rem] font-semibold text-foreground">Title</Text>
          <TextInput
            className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground"
            placeholder="EcoCash redesign — cleaner checkout"
            placeholderTextColor="#8A8278"
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />
        </View>

        {/* App name */}
        <View className="gap-1.5">
          <Text className="text-[0.84rem] font-semibold text-foreground">App name</Text>
          <TextInput
            className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground"
            placeholder="EcoCash"
            placeholderTextColor="#8A8278"
            value={appName}
            onChangeText={setAppName}
            maxLength={60}
          />
        </View>

        {/* Description */}
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[0.84rem] font-semibold text-foreground">Description</Text>
            <Text className="text-xs font-mono text-muted-foreground">{description.length}/500</Text>
          </View>
          <TextInput
            className="px-3.5 py-2.5 rounded-xl border border-input bg-card text-foreground"
            placeholder="What problem does your redesign solve?"
            placeholderTextColor="#8A8278"
            value={description}
            onChangeText={setDescription}
            maxLength={500}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 90 }}
          />
        </View>

        {/* Tags */}
        <View className="gap-2">
          <Text className="text-[0.84rem] font-semibold text-foreground">Tags</Text>
          <View className="flex-row flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => {
              const on = tags.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => toggleTag(t)}
                  activeOpacity={0.7}
                  className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                    on ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  {on && <Check size={10} color="#E8A900" strokeWidth={3} />}
                  <Text className={`text-sm font-medium ${on ? "text-primary" : "text-foreground"}`}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!valid || create.isPending}
        activeOpacity={0.85}
        className={`h-12 rounded-xl flex-row items-center justify-center gap-2 ${valid && !create.isPending ? "bg-primary" : "bg-muted"}`}
      >
        {create.isPending ? (
          <ActivityIndicator color="#2A2410" />
        ) : (
          <>
            <Upload size={17} color={valid ? "#2A2410" : "#8A8278"} />
            <Text className={`font-semibold text-base ${valid ? "text-primary-foreground" : "text-muted-foreground"}`}>
              Publish Redesign
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
