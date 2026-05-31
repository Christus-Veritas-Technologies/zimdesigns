import { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, StyleSheet } from "react-native";

type ShapeStyle = {
  borderRadius?: number | string;
  width: number;
  height: number;
};

interface ImageConfig {
  seed: string;
  size: number;
  borderRadius: number;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  opacity: number;
  floatUp: boolean;
  delay: number;
  duration: number;
}

const BASE_URL = "https://picsum.photos/seed";

const CONFIGS: ImageConfig[] = [
  { seed: "arch1", size: 90, borderRadius: 45, top: "12%", left: "5%", opacity: 0.3, floatUp: true, delay: 0, duration: 5500 },
  { seed: "harare2", size: 70, borderRadius: 16, top: "10%", right: "8%", opacity: 0.25, floatUp: false, delay: 800, duration: 7000 },
  { seed: "zim3", size: 60, borderRadius: 30, top: "42%", left: "2%", opacity: 0.2, floatUp: true, delay: 400, duration: 6000 },
  { seed: "design4", size: 80, borderRadius: 20, top: "38%", right: "4%", opacity: 0.22, floatUp: false, delay: 1500, duration: 8000 },
  { seed: "mobile5", size: 55, borderRadius: 12, bottom: "25%", left: "8%", opacity: 0.18, floatUp: true, delay: 600, duration: 6500 },
  { seed: "tech6", size: 65, borderRadius: 32, bottom: "20%", right: "6%", opacity: 0.2, floatUp: false, delay: 1200, duration: 7500 },
];

function FloatingImage({ config }: { config: ImageConfig }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entryAnim = Animated.timing(opacity, {
      toValue: config.opacity,
      duration: 900,
      delay: config.delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    });

    const floatDistance = config.floatUp ? -16 : 16;
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: floatDistance,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel([entryAnim, floatLoop]).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          opacity,
          transform: [{ translateY }],
          width: config.size,
          height: config.size,
          top: config.top as number,
          bottom: config.bottom as number,
          left: config.left as number,
          right: config.right as number,
          position: "absolute",
          borderRadius: config.borderRadius,
          overflow: "hidden",
          pointerEvents: "none" as "none",
        },
      ]}
    >
      <Image
        source={{ uri: `${BASE_URL}/${config.seed}/${config.size * 2}/${config.size * 2}` }}
        style={{ width: config.size, height: config.size }}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

export function FloatingImages() {
  return (
    <>
      {CONFIGS.map((cfg) => (
        <FloatingImage key={cfg.seed} config={cfg} />
      ))}
    </>
  );
}
