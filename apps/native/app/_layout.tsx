import "@/global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { queryClient } from "@/lib/query-client";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

// Pages that require authentication to access
const AUTH_REQUIRED_SEGMENTS = new Set(["upload", "notifications", "profile", "admin"]);

// Redirects unauthenticated users away from auth-required pages and
// authenticated users past onboarding once complete.
function AuthGate() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  usePushNotifications();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inAuthCallback = segments[0] === "auth"; // deep-link callback

    if (!isAuthenticated && !inAuth && !inAuthCallback) {
      if (AUTH_REQUIRED_SEGMENTS.has(segments[0] as string)) {
        router.replace("/(auth)/login");
      }
    } else if (isAuthenticated && !user?.onboardingComplete && !inOnboarding && !inAuthCallback) {
      router.replace("/(onboarding)/step1");
    } else if (isAuthenticated && user?.onboardingComplete && (inAuth || inOnboarding)) {
      router.replace("/(drawer)");
    }
  }, [isAuthenticated, isLoading, user, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="upload" options={{ presentation: "modal" }} />
      <Stack.Screen name="redesigns" />
      <Stack.Screen name="search" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="users" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: true, title: "Modal" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <HeroUINativeProvider>
              <AuthProvider>
                <AuthGate />
              </AuthProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
