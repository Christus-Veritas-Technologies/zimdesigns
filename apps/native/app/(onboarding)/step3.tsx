import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Upload, Compass, Flag, Check } from "lucide-react-native";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";
import { useCompleteOnboarding } from "@/hooks/use-onboarding";

export default function Step3Screen() {
  const complete = useCompleteOnboarding();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerClassName="px-6 pt-16 pb-10 flex-grow bg-background items-center"
      showsVerticalScrollIndicator={false}
    >
      {/* Check circle */}
      <View
        className="w-[72px] h-[72px] rounded-full bg-secondary items-center justify-center mb-6"
        style={{ shadowColor: "#2D9D6A", shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } }}
      >
        <Check size={30} color="white" strokeWidth={3} />
      </View>

      <Text
        className="text-[1.55rem] font-bold text-foreground text-center tracking-tight leading-[1.2] mb-3"
        style={{ fontFamily: "BricolageGrotesque-Bold" }}
      >
        You&apos;re In. Now Let&apos;s Build Something Better.
      </Text>

      <Text className="text-[0.94rem] text-muted-foreground text-center mb-8 max-w-xs">
        Your profile is ready. Here&apos;s what happens next.
      </Text>

      {/* Actions */}
      <View className="w-full gap-3">
        <TouchableOpacity
          onPress={() => complete.mutate()}
          disabled={complete.isPending}
          className="h-12 rounded-xl bg-primary flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          {complete.isPending
            ? <ActivityIndicator color="#2A2410" />
            : (
              <>
                <Upload size={18} color="#2A2410" />
                <Text className="font-semibold text-base text-primary-foreground">Upload Your First Redesign</Text>
              </>
            )}
        </TouchableOpacity>

        <Text className="text-xs text-muted-foreground text-center -mt-1">
          Show us how you&apos;d improve a Zimbabwean app.
        </Text>

        {complete.isError && (
          <Text className="text-destructive text-sm text-center">
            {(complete.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Something went wrong. Please try again."}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => { complete.mutate(); }}
          className="h-12 rounded-xl bg-secondary flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          <Compass size={18} color="#fff" />
          <Text className="font-semibold text-base text-secondary-foreground">Explore Redesigns</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(drawer)")}
          className="h-11 flex-row items-center justify-center gap-2"
          activeOpacity={0.7}
        >
          <Flag size={15} color="#8A8278" />
          <Text className="text-muted-foreground font-medium text-sm">Tell us what app needs fixing</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8">
        <FlagBar width={72} height={5} />
      </View>
    </ScrollView>
  );
}
