import * as React from "react";
import { View, Text, type ViewStyle } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  slots: {
    root: "flex-row items-center gap-1 rounded-lg px-2 py-0.5 self-start",
    label: "text-xs font-medium",
  },
  variants: {
    variant: {
      default: {
        root: "bg-primary border border-transparent",
        label: "text-primary-foreground",
      },
      secondary: {
        root: "bg-secondary border border-transparent",
        label: "text-secondary-foreground",
      },
      outline: {
        root: "border border-border bg-transparent",
        label: "text-foreground",
      },
      muted: {
        root: "bg-muted border border-transparent",
        label: "text-muted-foreground",
      },
      success: {
        root: "border border-transparent",
        label: "text-green-700 dark:text-green-400",
        // background applied inline since Tailwind can't use CSS var in bg here
      },
      warning: {
        root: "border border-transparent",
        label: "text-amber-700 dark:text-amber-400",
      },
      destructive: {
        root: "bg-red-50 dark:bg-red-950 border border-transparent",
        label: "text-destructive",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  style?: ViewStyle;
}

const variantBgStyle: Record<string, string> = {
  success: "bg-green-100 dark:bg-green-950",
  warning: "bg-amber-100 dark:bg-amber-950",
};

function Badge({ variant = "default", children, style }: BadgeProps) {
  const { root, label } = badgeVariants({ variant });
  const extraBg = variant && variantBgStyle[variant] ? variantBgStyle[variant] : "";

  return (
    <View className={`${root()} ${extraBg}`} style={style}>
      {typeof children === "string" ? (
        <Text className={label()}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export { Badge, badgeVariants };
