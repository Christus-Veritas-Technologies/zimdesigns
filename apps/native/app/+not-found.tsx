import { Link, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Search, ArrowLeft } from "lucide-react-native";
import { FloatingImages } from "@/components/floating-images";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <View className="flex-1 bg-background">
        <FloatingImages />
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="text-foreground/5 font-extrabold"
            style={{ fontSize: 96, lineHeight: 96, fontFamily: "BricolageGrotesque-ExtraBold" }}
            aria-hidden
          >
            404
          </Text>

          <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-5 -mt-4">
            <Search size={24} color="#E8A900" strokeWidth={1.8} />
          </View>

          <Text
            className="text-[1.5rem] font-extrabold text-foreground tracking-tight mb-2 text-center"
            style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
          >
            Page not found
          </Text>
          <Text className="text-muted-foreground text-sm text-center leading-relaxed mb-8 max-w-[280px]">
            The page you're looking for doesn't exist or has been moved.
          </Text>

          <View className="flex-row gap-3">
            <Link href="/" asChild>
              <TouchableOpacity
                activeOpacity={0.85}
                className="flex-row items-center gap-2 px-5 py-2.5 rounded-xl bg-primary"
              >
                <ArrowLeft size={14} color="#2A2410" />
                <Text className="text-primary-foreground font-semibold text-sm">Back to feed</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/search" asChild>
              <TouchableOpacity
                activeOpacity={0.8}
                className="px-5 py-2.5 rounded-xl border border-border bg-card items-center justify-center"
              >
                <Text className="text-foreground font-semibold text-sm">Search</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
