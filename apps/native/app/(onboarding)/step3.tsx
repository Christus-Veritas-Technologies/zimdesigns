import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Upload, Compass, Check } from "lucide-react-native";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";
import { useCompleteOnboarding } from "@/hooks/use-onboarding";

export default function Step3Screen() {
  const complete = useCompleteOnboarding();

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
        className="text-xl font-bold text-foreground text-center tracking-tight leading-[1.2] mb-3"
        style={{ fontFamily: "BricolageGrotesque-Bold" }}
      >
        You&apos;re In. Now Let&apos;s Build Something Better.
      </Text>

      <Text className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
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

      </View>

      <View className="mt-8">
        <FlagBar width={72} height={5} />
      </View>
    </ScrollView>
  );
}
