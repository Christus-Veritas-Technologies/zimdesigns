import * as React from "react";
import { Pressable, Text, ActivityIndicator, type PressableProps, type TextStyle, type ViewStyle } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  slots: {
    root: "flex-row items-center justify-center rounded-xl active:opacity-80",
    label: "font-semibold",
    icon: "",
  },
  variants: {
    variant: {
      default: {
        root: "bg-primary border border-transparent",
        label: "text-primary-foreground",
      },
      outline: {
        root: "border border-border bg-background",
        label: "text-foreground",
      },
      secondary: {
        root: "bg-secondary border border-transparent",
        label: "text-secondary-foreground",
      },
      ghost: {
        root: "border border-transparent",
        label: "text-foreground",
      },
      destructive: {
        root: "bg-destructive/10 border border-transparent",
        label: "text-destructive",
      },
    },
    size: {
      xs: {
        root: "h-7 gap-1 rounded-lg px-2.5",
        label: "text-xs",
      },
      sm: {
        root: "h-8 gap-1 rounded-lg px-3",
        label: "text-xs",
      },
      default: {
        root: "h-9 gap-1.5 px-4",
        label: "text-sm",
      },
      lg: {
        root: "h-10 gap-1.5 rounded-2xl px-5",
        label: "text-base",
      },
      icon: {
        root: "size-9 rounded-xl",
        label: "",
      },
    },
    disabled: {
      true: {
        root: "opacity-50",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  loading?: boolean;
  children?: React.ReactNode;
  textStyle?: TextStyle;
  style?: ViewStyle;
}

function Button({
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  textStyle,
  style,
  ...props
}: ButtonProps) {
  const { root, label } = buttonVariants({ variant, size, disabled: disabled ?? loading });

  return (
    <Pressable
      disabled={disabled ?? loading}
      style={[{ flexDirection: "row", alignItems: "center", justifyContent: "center" } as ViewStyle, style]}
      className={root()}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "default" || variant === "secondary" ? "white" : undefined}
        />
      ) : typeof children === "string" ? (
        <Text className={label()} style={textStyle}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { Button, buttonVariants };
