import * as React from "react";
import { TextInput, View, Text, type TextInputProps, type ViewStyle } from "react-native";
import { cn } from "heroui-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, className, containerStyle, ...props }, ref) => {
    return (
      <View className="gap-1.5" style={containerStyle}>
        {label ? <Text className="text-sm font-medium text-foreground">{label}</Text> : null}
        <TextInput
          ref={ref}
          className={cn(
            "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground",
            error && "border-destructive",
            props.editable === false && "opacity-50",
            className,
          )}
          placeholderTextColor="var(--muted-foreground)"
          {...props}
        />
        {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
      </View>
    );
  },
);

Input.displayName = "Input";

export { Input };
