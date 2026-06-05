import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Check, ArrowRight } from "lucide-react-native";
import { useUpdateInterests } from "@/hooks/use-onboarding";

const INTERESTS = [
  "Mobile Apps",
  "Web Apps",
  "Local Apps",
  "Banking",
  "E-commerce",
  "Social Media",
  "Other",
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

export default function Step2Screen() {
  const [selected, setSelected] = useState<string[]>(["Local Apps", "Banking"]);
  const updateInterests = useUpdateInterests();
  const router = useRouter();

  const toggle = (item: string) =>
    setSelected((s) => (s.includes(item) ? s.filter((x) => x !== item) : [...s, item]));

  return (
    <ScrollView
      contentContainerClassName="px-5 pt-14 pb-8 flex-grow bg-background"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity onPress={() => router.back()}
          className="w-10 h-10 rounded-xl items-center justify-center bg-muted">
          <Text className="text-muted-foreground text-lg">←</Text>
        </TouchableOpacity>
        <StepsBar current={2} />
        <Text className="text-xs font-mono text-muted-foreground tracking-wider">2/3</Text>
      </View>

      <Text
        className="text-[1.5rem] font-bold text-foreground tracking-tight mb-1"
        style={{ fontFamily: "BricolageGrotesque-Bold" }}
      >
        What Apps Should We Focus On?
      </Text>
      <Text className="text-[0.92rem] text-muted-foreground mb-6">
        Help us understand what needs improving.
      </Text>

      {/* Chips — 2-column grid */}
      <View className="mb-3" style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>

        {INTERESTS.map((item) => {
          const on = selected.includes(item);
          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggle(item)}
              activeOpacity={0.7}
              style={{ width: "47%", flexGrow: 1 }}
              className={`flex-row items-center gap-2 px-3.5 py-2.5 rounded-xl border ${
                on ? "border-primary bg-accent" : "border-border bg-card"
              }`}
            >
              <View
                className={`w-4 h-4 rounded-full items-center justify-center border ${
                  on ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {on && <Check size={9} color="#2A2410" strokeWidth={3} />}
              </View>
              <Text className={`text-[0.92rem] font-medium ${on ? "text-primary" : "text-foreground"}`}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row items-center gap-1.5 mb-4">
        <Check size={12} color="#2D9D6A" />
        <Text className="text-xs text-muted-foreground">Pick as many as you like — you can change this later.</Text>
      </View>

      {updateInterests.isError && (
        <Text className="text-destructive text-sm mb-4">
          {(updateInterests.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save interests. Please try again."}
        </Text>
      )}

      {/* Buttons */}
      <View className="gap-3">
        <TouchableOpacity
          onPress={() => updateInterests.mutate(selected, { onSuccess: () => router.push("/(onboarding)/step3") })}
          disabled={updateInterests.isPending}
          className="h-12 rounded-xl bg-primary flex-row-reverse items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          {updateInterests.isPending
            ? <ActivityIndicator color="#2A2410" />
            : (
              <>
                <ArrowRight size={18} color="#2A2410" />
                <Text className="font-semibold text-base text-primary-foreground">Continue</Text>
              </>
            )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/step3")}
          className="h-11 items-center justify-center"
          activeOpacity={0.7}
        >
          <Text className="text-muted-foreground font-medium">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
