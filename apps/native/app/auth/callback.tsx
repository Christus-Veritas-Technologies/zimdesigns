// This screen is the deep-link landing page for Google OAuth.
// URL: zimdesigns://auth/callback?token=...&refreshToken=...&userId=...&onboardingComplete=...
//
// expo-web-browser's openAuthSessionAsync will dismiss the browser and route
// here automatically when the deep link fires.  We just store the tokens and
// navigate — the user never sees this screen for more than a frame.

import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/axios";
import { saveTokens } from "@/lib/token-storage";

interface SafeUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
}

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{
    token: string;
    refreshToken: string;
    userId: string;
    onboardingComplete: string;
  }>();
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { token, refreshToken, userId, onboardingComplete } = params;
    if (!token || !refreshToken || !userId) {
      router.replace("/(auth)/login");
      return;
    }

    (async () => {
      try {
        // Save tokens first so the axios interceptor can use them
        await saveTokens(token, refreshToken);

        // Fetch full user profile
        const res = await api.get<SafeUser>("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        await setAuth(res.data, token, refreshToken);

        const complete = onboardingComplete === "true" || res.data.onboardingComplete;
        router.replace(complete ? "/(drawer)" : "/(onboarding)/step1");
      } catch {
        // Fallback: use minimal user from params
        await setAuth(
          {
            id: userId,
            email: "",
            name: "",
            username: "",
            avatarUrl: null,
            onboardingComplete: onboardingComplete === "true",
          },
          token,
          refreshToken,
        );
        router.replace(onboardingComplete === "true" ? "/(drawer)" : "/(onboarding)/step1");
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#E8A900" />
    </View>
  );
}
