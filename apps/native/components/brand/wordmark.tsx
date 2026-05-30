import { Text, View } from "react-native";

interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 22 }: WordmarkProps) {
  const markSize = Math.round(size * 1.35);
  return (
    <View className="flex-row items-center gap-2">
      <View
        className="items-center justify-center rounded-xl bg-primary"
        style={{ width: markSize, height: markSize }}
      >
        <Text
          className="font-extrabold text-primary-foreground"
          style={{ fontSize: markSize * 0.62, fontFamily: "BricolageGrotesque-ExtraBold" }}
        >
          Z
        </Text>
      </View>
      <Text
        className="text-foreground font-extrabold"
        style={{ fontSize: size, fontFamily: "BricolageGrotesque-ExtraBold", letterSpacing: -0.5 }}
      >
        Zim<Text className="text-primary">Designs</Text>
      </Text>
    </View>
  );
}
