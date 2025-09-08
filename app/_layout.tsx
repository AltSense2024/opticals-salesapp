import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/context/authContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProductProvider } from "@/context/ProductContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    regular: require("../assets/fonts/Gilroy-Regular.ttf"),
    bold: require("../assets/fonts/Gilroy-Bold.ttf"),
    heavy: require("../assets/fonts/Gilroy-Heavy.ttf"),
    semibold: require("../assets/fonts/Gilroy-SemiBold.ttf"),
    extrabold: require("../assets/fonts/Gilroy-ExtraBold.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ProductProvider>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="login"
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />

            {/* Customer Details */}
            <Stack.Screen
              name="customer/[id]"
              options={{ headerShown: false }}
            />

            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
