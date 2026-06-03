import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { env } from "@zimdesigns/env/native";
import { Wordmark } from "@/components/brand/wordmark";
import { FlagBar } from "@/components/brand/flag-bar";
import { useLogin } from "@/hooks/use-auth";

export default function LoginScreen() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const login = useLogin();

  const errorMsg =
    (login.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message;

  const handleGooglePress = async () => {
    await WebBrowser.openAuthSessionAsync(
      `${env.EXPO_PUBLIC_SERVER_URL}/api/auth/google?platform=native`,
      "zimdesigns://auth/callback",
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="px-6 pt-14 pb-8 flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Wordmark size={19} />
          <FlagBar width={40} height={4} />
        </View>

        <Text
          className="text-[1.65rem] font-bold text-foreground tracking-tight leading-tight mb-2"
          style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
        >
          Welcome back.
        </Text>
        <Text className="text-[0.93rem] text-muted-foreground leading-relaxed mb-7">
          Sign in to your ZimDesigns account.
        </Text>

        {/* Google */}
        <TouchableOpacity
          onPress={handleGooglePress}
          className="w-full h-12 flex-row items-center justify-center gap-3 rounded-xl border border-border bg-card mb-5"
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-foreground">Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-xs text-muted-foreground font-mono tracking-wider uppercase">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Form */}
        <View className="gap-4">
          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Email</Text>
            <TextInput
              className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground text-[0.95rem]"
              placeholder="you@email.com"
              placeholderTextColor="#8A8278"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[0.84rem] font-semibold text-foreground">Password</Text>
              <Link href="/auth/forgot-password" className="text-xs text-muted-foreground">Forgot password?</Link>
            </View>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-11 pl-3.5 pr-12 rounded-xl border border-input bg-card text-foreground text-[0.95rem]"
                placeholder="Your password"
                placeholderTextColor="#8A8278"
                value={form.password}
                onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                secureTextEntry={!showPw}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPw((v) => !v)}
                className="absolute right-3.5"
                hitSlop={8}
              >
                {showPw
                  ? <EyeOff size={18} color="#8A8278" />
                  : <Eye size={18} color="#8A8278" />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {login.isError && (
          <Text className="text-destructive text-sm mt-2">{errorMsg ?? "Invalid email or password."}</Text>
        )}

        <TouchableOpacity
          onPress={() => login.mutate(form)}
          disabled={login.isPending}
          className="h-12 mt-5 rounded-xl bg-primary flex-row-reverse items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          {login.isPending
            ? <ActivityIndicator color="#2A2410" />
            : (
              <>
                <ArrowRight size={18} color="#2A2410" />
                <Text className="font-semibold text-base text-primary-foreground">Sign in</Text>
              </>
            )}
        </TouchableOpacity>

        <Text className="text-center mt-5 text-[0.9rem] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/(auth)/signup" className="font-semibold text-primary">
            Sign up
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
