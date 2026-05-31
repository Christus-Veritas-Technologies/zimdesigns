import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const request = useMutation({
    mutationFn: (email: string) =>
      api.post("/api/auth/forgot-password", { email }).then((r) => r.data),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <CheckCircle size={28} color="#E8A900" />
        </View>
        <Text className="text-xl font-extrabold text-foreground mb-2 text-center" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          Check your email
        </Text>
        <Text className="text-sm text-muted-foreground text-center mb-6">
          If an account with that email exists, we've sent a password reset link. Check your inbox.
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text className="text-primary text-sm font-semibold">← Back to sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-6">
      <View className="pt-14 pb-6">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="flex-row items-center gap-2 mb-8">
          <ArrowLeft size={16} color="#8A8278" />
          <Text className="text-muted-foreground text-sm">Back to sign in</Text>
        </TouchableOpacity>

        <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <Mail size={20} color="#E8A900" />
        </View>

        <Text className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          Forgot your password?
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          Enter your email and we'll send you a reset link.
        </Text>
      </View>

      <Text className="text-xs font-medium text-muted-foreground mb-1">Email address</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="you@example.com"
        placeholderTextColor="#8A8278"
        className="w-full px-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground mb-4"
      />

      {request.isError && (
        <Text className="text-sm text-destructive mb-3">Something went wrong. Please try again.</Text>
      )}

      <TouchableOpacity
        onPress={() => email && request.mutate(email)}
        disabled={request.isPending || !email}
        activeOpacity={0.8}
        className={`py-3.5 rounded-xl items-center ${request.isPending || !email ? "bg-primary/40" : "bg-primary"}`}
      >
        {request.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-white font-semibold text-base">Send reset link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
