import { View } from "react-native";

interface FlagBarProps {
  height?: number;
  width?: number;
}

// Zimbabwe flag stripe: gold / green / black / white
export function FlagBar({ height = 5, width = 64 }: FlagBarProps) {
  return (
    <View className="flex-row overflow-hidden rounded-full" style={{ height, width }}>
      <View className="flex-1 bg-primary" />
      <View className="flex-1 bg-secondary" />
      <View className="flex-1 bg-foreground" />
      <View className="flex-1 bg-background border border-border" />
    </View>
  );
}
