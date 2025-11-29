import { useFocusEffect, useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { useCallback } from "react";

export const useBackToHome = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)/home");
        }
        return true; // block default back nav
      };

      // Add listener
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Cleanup
      return () => subscription.remove();
    }, [])
  );
};
