import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";

const env = { EXPO_PUBLIC_SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL ?? "http://localhost:3001" };
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

function NavItem({ icon, label, onPress, color }: { icon: string; label: string; onPress: () => void; color: string }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 px-4 py-3 rounded-xl"
    >
      <Ionicons name={icon as never} size={20} color={color} />
      <Text style={{ color, fontWeight: "500", fontSize: 15 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function CustomDrawer() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, clearAuth } = useAuth();
  const fg = useThemeColor("foreground");
  const muted = "#8A8278";
  const primary = "#E8A900";
  const bg = useThemeColor("background");
  const border = useThemeColor("border");

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* User header */}
      <View style={{ borderBottomWidth: 1, borderColor: border, paddingHorizontal: 16, paddingVertical: 16 }}>
        {isAuthenticated && user ? (
          <TouchableOpacity
            onPress={() => router.push(`/users/${user.username}` as never)}
            activeOpacity={0.8}
            className="flex-row items-center gap-3"
          >
            <View className="w-12 h-12 rounded-2xl bg-primary/20 items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <Image source={{ uri: absoluteUrl(user.avatarUrl) }} style={{ width: 48, height: 48 }} />
              ) : (
                <Text style={{ fontSize: 20, fontWeight: "900", color: primary }}>{user.name.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View className="flex-1 min-w-0">
              <Text style={{ fontWeight: "700", fontSize: 15, color: fg }} numberOfLines={1}>{user.name}</Text>
              <Text style={{ fontSize: 12, color: muted }}>@{user.username}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={{ fontWeight: "900", fontSize: 20, color: fg, fontFamily: "BricolageGrotesque-ExtraBold" }}>
              Zim<Text style={{ color: primary }}>Designs</Text>
            </Text>
            <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>Discover Zimbabwean redesigns</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8 }}>
        <NavItem icon="home-outline" label="Home" onPress={() => router.push("/(drawer)/(tabs)/" as never)} color={fg} />
        <NavItem icon="trending-up-outline" label="Trending" onPress={() => router.push("/trending" as never)} color={fg} />
        <NavItem icon="list-outline" label="App Requests" onPress={() => router.push("/app-requests" as never)} color={fg} />
        <NavItem icon="search-outline" label="Search" onPress={() => router.push("/search" as never)} color={fg} />
        <NavItem icon="notifications-outline" label="Notifications" onPress={() => router.push("/notifications" as never)} color={fg} />

        {isAuthenticated && (
          <>
            <View style={{ height: 1, backgroundColor: useThemeColor("border"), marginVertical: 8, marginHorizontal: 16 }} />
            <NavItem icon="bookmark-outline" label="Saved" onPress={() => router.push("/bookmarks" as never)} color={fg} />
            <NavItem icon="person-outline" label="Profile" onPress={() => user && router.push(`/users/${user.username}` as never)} color={fg} />
            <NavItem icon="settings-outline" label="Settings" onPress={() => router.push("/settings" as never)} color={fg} />
            <View style={{ height: 1, backgroundColor: useThemeColor("border"), marginVertical: 8, marginHorizontal: 16 }} />
            <NavItem icon="log-out-outline" label="Sign Out" onPress={async () => { await clearAuth(); router.replace("/auth/login" as never); }} color="#ef4444" />
          </>
        )}

        {!isAuthenticated && (
          <>
            <View style={{ height: 1, backgroundColor: useThemeColor("border"), marginVertical: 8, marginHorizontal: 16 }} />
            <NavItem icon="log-in-outline" label="Sign In" onPress={() => router.push("/auth/login" as never)} color={primary} />
          </>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingBottom: 8, borderTopWidth: 1, borderColor: border, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11, color: muted }}>ZimDesigns</Text>
        <ThemeToggle />
      </View>
    </View>
  );
}

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      drawerContent={() => <CustomDrawer />}
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: { fontWeight: "600", color: themeColorForeground },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
