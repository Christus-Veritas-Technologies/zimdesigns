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
import { useSignup } from "@/hooks/use-auth";

function GoogleButton({ disabled }: { disabled?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const handlePress = async () => {
    setIsLoading(true);
    try {
      await WebBrowser.openAuthSessionAsync(
        `${env.EXPO_PUBLIC_SERVER_URL}/api/auth/google?platform=native`,
        "zimdesigns://auth/callback",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const busy = isLoading || disabled;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={busy}
      className="w-full h-12 flex-row items-center justify-center gap-3 rounded-xl border border-border bg-card"
      activeOpacity={0.7}
      style={{ opacity: busy ? 0.6 : 1 }}
    >
      {isLoading ? <ActivityIndicator size="small" color="#8A8278" /> : null}
      <Text className="text-base font-semibold text-foreground">
        {isLoading ? "Opening browser…" : "Continue with Google"}
      </Text>
    </TouchableOpacity>
  );
}

export default function SignupScreen() {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const signup = useSignup();

  const errorMsg =
    (signup.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message;

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

        {/* Hero text */}
        <Text
          className="text-[1.65rem] font-bold text-foreground tracking-tight leading-tight mb-2"
          style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}
        >
          Redesign Zimbabwe&apos;s apps.
        </Text>
        <Text className="text-[0.93rem] text-muted-foreground leading-relaxed mb-7">
          Zimbabwe has talented designers &amp; developers. Let&apos;s fix the apps we use every day.
        </Text>

        {/* Google */}
        <GoogleButton disabled={signup.isPending} />

        {/* Divider */}
        <View className="flex-row items-center gap-3 my-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-xs text-muted-foreground font-mono tracking-wider uppercase">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Form */}
        <View className="gap-4">
          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Full name</Text>
            <TextInput
              className="h-11 px-3.5 rounded-xl border border-input bg-card text-foreground text-[0.95rem]"
              placeholder="Tinashe Moyo"
              placeholderTextColor="#8A8278"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              autoCapitalize="words"
              editable={!signup.isPending}
            />
          </View>

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
              editable={!signup.isPending}
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Username</Text>
            <View className="relative flex-row items-center">
              <Text className="absolute left-3.5 text-muted-foreground font-mono text-[0.92rem] z-10">@</Text>
              <TextInput
                className="flex-1 h-11 pl-8 pr-3.5 rounded-xl border border-input bg-card text-foreground text-[0.95rem]"
                placeholder="tinashe"
                placeholderTextColor="#8A8278"
                value={form.username}
                onChangeText={(v) => setForm((f) => ({ ...f, username: v }))}
                autoCapitalize="none"
                editable={!signup.isPending}
              />
            </View>
          </View>

          <View className="gap-1.5">
            <Text className="text-[0.84rem] font-semibold text-foreground">Password</Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-11 pl-3.5 pr-12 rounded-xl border border-input bg-card text-foreground text-[0.95rem]"
                placeholder="Create a password"
                placeholderTextColor="#8A8278"
                value={form.password}
                onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                editable={!signup.isPending}
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

        {/* Error */}
        {signup.isError && (
          <Text className="text-destructive text-sm mt-2">{errorMsg ?? "Something went wrong."}</Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          onPress={() => signup.mutate(form)}
          disabled={signup.isPending}
          className="mt-5 rounded-xl bg-primary flex-row-reverse items-center justify-center gap-2"
          style={{ height: 50 }}
          activeOpacity={0.85}
        >
          {signup.isPending
            ? <ActivityIndicator color="#2A2410" />
            : (
              <>
                <ArrowRight size={18} color="#2A2410" />
                <Text className="text-[var(--zd-gold-fg)] font-semibold text-base text-primary-foreground">
                  Create account
                </Text>
              </>
            )}
        </TouchableOpacity>

        {/* Footer */}
        <Text className="text-center mt-5 text-[0.9rem] text-muted-foreground">
          Already have an account?{" "}
          <Link href="/(auth)/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
