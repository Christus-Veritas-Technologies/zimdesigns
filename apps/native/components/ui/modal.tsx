import * as React from "react";
import { Modal as RNModal, View, Text, Pressable, type ModalProps as RNModalProps, type ViewStyle } from "react-native";
import { XIcon } from "lucide-react-native";
import { cn } from "heroui-native";

interface ModalProps extends Omit<RNModalProps, "transparent" | "animationType"> {
  onClose?: () => void;
  showClose?: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  contentClassName?: string;
  contentStyle?: ViewStyle;
}

function Modal({
  visible,
  onClose,
  showClose = true,
  title,
  description,
  children,
  contentClassName,
  contentStyle,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className={cn(
            "w-[90%] max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl",
            contentClassName,
          )}
          style={contentStyle}
          onPress={(e) => e.stopPropagation()}
        >
          {(title || showClose) && (
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 pr-8">
                {title ? (
                  <Text className="text-lg font-extrabold text-foreground">{title}</Text>
                ) : null}
                {description ? (
                  <Text className="text-sm text-muted-foreground mt-1">{description}</Text>
                ) : null}
              </View>
              {showClose && onClose ? (
                <Pressable
                  onPress={onClose}
                  className="p-1 rounded-lg active:bg-muted"
                  hitSlop={8}
                >
                  <XIcon size={18} className="text-muted-foreground" />
                </Pressable>
              ) : null}
            </View>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

export { Modal };
