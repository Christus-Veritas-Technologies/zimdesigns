import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Search, ArrowUp, X } from "lucide-react-native";
import { useSearch } from "@/hooks/use-profiles";
import { useUpvoteRedesign, type Redesign } from "@/hooks/use-redesigns";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@zimdesigns/env/native";

function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${env.EXPO_PUBLIC_SERVER_URL}${url}`;
}

function SearchCard({ item }: { item: Redesign }) {
  const { isAuthenticated } = useAuth();
  const upvote = useUpvoteRedesign(item.id);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/redesigns/${item.id}` as never)}
      activeOpacity={0.9}
      className="flex-row bg-card border border-border rounded-2xl overflow-hidden mb-3"
    >
      <Image source={{ uri: absoluteUrl(item.afterUrl) }} className="w-20 h-20" resizeMode="cover" />
      <View className="flex-1 px-3 py-2.5 gap-1">
        <Text className="font-semibold text-foreground text-sm leading-snug" numberOfLines={2}>{item.title}</Text>
        <Text className="text-xs text-muted-foreground">{item.appName} · @{item.author.username}</Text>
        {item.tags.length > 0 && (
          <View className="flex-row gap-1 flex-wrap mt-0.5">
            {item.tags.slice(0, 2).map((t) => (
              <Text key={t} className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</Text>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => { if (isAuthenticated) upvote.mutate(); }}
        activeOpacity={0.7}
        className={`items-center justify-center px-3 gap-0.5 ${item.hasUpvoted ? "opacity-100" : "opacity-60"}`}
      >
        <ArrowUp size={13} color={item.hasUpvoted ? "#E8A900" : "#8A8278"} strokeWidth={2.5} />
        <Text className="text-xs font-semibold text-muted-foreground">{item.upvoteCount}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(input), 350);
    return () => clearTimeout(t);
  }, [input]);

  const { data: results, isLoading } = useSearch(q);

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-14 pb-3 border-b border-border bg-background">
        <Text className="text-[1.4rem] font-extrabold text-foreground tracking-tight mb-3" style={{ fontFamily: "BricolageGrotesque-ExtraBold" }}>
          Search
        </Text>
        <View className="flex-row items-center gap-2 h-11 px-3.5 rounded-xl border border-input bg-card">
          <Search size={15} color="#8A8278" />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="App name, title, or tag…"
            placeholderTextColor="#8A8278"
            autoFocus
            returnKeyType="search"
            className="flex-1 text-foreground text-sm"
          />
          {input.length > 0 && (
            <TouchableOpacity onPress={() => { setInput(""); setQ(""); }}>
              <X size={15} color="#8A8278" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {q.trim().length >= 2 && isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8A900" />
        </View>
      )}

      {q.trim().length >= 2 && !isLoading && results?.length === 0 && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-sm text-center">No redesigns found for &ldquo;{q}&rdquo;.</Text>
        </View>
      )}

      {q.trim().length < 2 && (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center mb-4">
            <Search size={24} color="#8A8278" />
          </View>
          <Text className="font-semibold text-foreground mb-1">Search redesigns</Text>
          <Text className="text-sm text-muted-foreground text-center">Find redesigns by app name, title, or tag.</Text>
        </View>
      )}

      {results && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchCard item={item} />}
          contentContainerClassName="px-4 pt-4 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
