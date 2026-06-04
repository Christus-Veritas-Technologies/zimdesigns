import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";

export default function SettingsScreen() {
  const { isAuthenticated, clearAuth } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const changePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.post("/api/settings/change-password", data).then((r) => r.data),
    onSuccess: () => {
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPwSuccess(false), 4000);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      Alert.alert("Error", err.response?.data?.message ?? "Failed to update password.");
    },
  });

  const logout = useMutation({
    mutationFn: () => api.post("/api/auth/logout", {}).then(() => undefined),
    onSettled: async () => {
      await clearAuth();
      router.replace("/auth/login" as never);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: () => api.delete("/api/settings/account").then((r) => r.data),
    onSuccess: async () => {
      await clearAuth();
      router.replace("/auth/login" as never);
    },
  });

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="font-semibold text-foreground mb-2">Sign in to access settings</Text>
        <TouchableOpacity onPress={() => router.push("/auth/login" as never)}>
          <Text className="text-primary text-sm font-medium">Sign in →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confirmDelete = () => {
    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all redesigns. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteAccount.mutate() },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2">
          <ArrowLeft size={16} color="#8A8278" />
          <Text className="text-muted-foreground text-sm">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {/* Change password */}
        <View className="mb-4 p-4 rounded-2xl border border-border bg-card">
          <Text className="font-semibold text-foreground mb-3">Change Password</Text>

          {pwSuccess && (
            <View className="mb-3 px-3 py-2 rounded-xl bg-green-500/10">
              <Text className="text-green-600 text-sm">Password updated successfully.</Text>
            </View>
          )}

          <Text className="text-xs font-medium text-muted-foreground mb-1">Current password</Text>
          <View className="flex-row items-center border border-border rounded-xl bg-background mb-3" style={{ opacity: changePassword.isPending ? 0.6 : 1 }}>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder="••••••••"
              placeholderTextColor="#8A8278"
              editable={!changePassword.isPending}
              className="flex-1 px-3 py-2.5 text-sm text-foreground"
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} className="pr-3">
              {showCurrent ? <EyeOff size={15} color="#8A8278" /> : <Eye size={15} color="#8A8278" />}
            </TouchableOpacity>
          </View>

          <Text className="text-xs font-medium text-muted-foreground mb-1">New password</Text>
          <View className="flex-row items-center border border-border rounded-xl bg-background mb-3" style={{ opacity: changePassword.isPending ? 0.6 : 1 }}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Min. 8 characters"
              placeholderTextColor="#8A8278"
              editable={!changePassword.isPending}
              className="flex-1 px-3 py-2.5 text-sm text-foreground"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} className="pr-3">
              {showNew ? <EyeOff size={15} color="#8A8278" /> : <Eye size={15} color="#8A8278" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => changePassword.mutate({ currentPassword, newPassword })}
            disabled={changePassword.isPending || !currentPassword || newPassword.length < 8}
            activeOpacity={0.8}
            className={`py-2.5 rounded-xl items-center ${(changePassword.isPending || !currentPassword || newPassword.length < 8) ? "bg-primary/40" : "bg-primary"}`}
          >
            {changePassword.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-semibold text-sm">Update password</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <View className="mb-4 p-4 rounded-2xl border border-border bg-card">
          <Text className="font-semibold text-foreground mb-1">Sign Out</Text>
          <Text className="text-sm text-muted-foreground mb-3">Sign out of your account on this device.</Text>
          <TouchableOpacity
            onPress={() => logout.mutate()}
            disabled={logout.isPending}
            activeOpacity={0.8}
            className="py-2.5 rounded-xl border border-border items-center"
          >
            <Text className="text-foreground font-semibold text-sm">{logout.isPending ? "Signing out…" : "Sign out"}</Text>
          </TouchableOpacity>
        </View>

        {/* Delete account */}
        <View className="p-4 rounded-2xl border border-red-300/50 bg-red-50/5">
          <View className="flex-row items-center gap-2 mb-1">
            <AlertTriangle size={14} color="#ef4444" />
            <Text className="font-semibold text-red-500">Delete Account</Text>
          </View>
          <Text className="text-sm text-muted-foreground mb-3">
            Permanently delete your account and all your redesigns. This cannot be undone.
          </Text>
          <Text className="text-xs font-medium text-muted-foreground mb-1">Type <Text className="font-mono text-foreground">delete my account</Text> to confirm</Text>
          <TextInput
            value={deleteConfirm}
            onChangeText={setDeleteConfirm}
            placeholder="delete my account"
            placeholderTextColor="#8A8278"
            editable={!deleteAccount.isPending}
            className="px-3 py-2.5 rounded-xl border border-red-300/30 bg-background text-sm text-foreground mb-3"
            style={{ opacity: deleteAccount.isPending ? 0.6 : 1 }}
          />
          <TouchableOpacity
            onPress={confirmDelete}
            disabled={deleteConfirm !== "delete my account" || deleteAccount.isPending}
            activeOpacity={0.8}
            className={`flex-row items-center justify-center gap-2 py-2.5 rounded-xl ${deleteConfirm === "delete my account" && !deleteAccount.isPending ? "bg-red-500" : "bg-red-300/40"}`}
          >
            <Trash2 size={14} color="#fff" />
            <Text className="text-white font-semibold text-sm">{deleteAccount.isPending ? "Deleting…" : "Delete account"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
