import { CheckCircle } from "lucide-react-native";
import { router } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

function Modal() {
  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <View className="p-6 w-full max-w-sm rounded-2xl bg-card border border-border">
          <View className="items-center">
            <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mb-4">
              <CheckCircle size={24} className="text-primary" />
            </View>
            <Text className="text-foreground font-extrabold text-lg mb-1">Modal Screen</Text>
            <Text className="text-muted-foreground text-sm text-center mb-6">
              This is an example modal screen for dialogs and confirmations.
            </Text>
          </View>
          <Button onPress={handleClose} variant="outline" className="w-full">Close</Button>
        </View>
      </View>
    </Container>
  );
}

export default Modal;
