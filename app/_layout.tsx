import FeedbackAlert from "@/component/ui/feedback-alert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { getValidAccessToken } from "@/utils/tokenUtils";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { PortalProvider } from "@gorhom/portal";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F7F7F7",
  },
};
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1C1C1E",
  },
};

export default function RootLayout() {
  const { isAuthenticated, hasCompleteOnboarding } = useAuthStore();
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const checkIsAccesTokenValid = async () => {
    await getValidAccessToken()
      .then((res) => {
        useAuthStore.getState().setIsAuthenticated(res !== null);
      })
      .catch((err) => {
        setIsTokenLoading(false);
        console.error(err);
      })
      .finally(() => {
        setIsTokenLoading(false);
      });
  };

  // Only load the app after the fonts are loaded.
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  // Check for valid access token or get a refresh token if the token expired.
  useEffect(() => {
    checkIsAccesTokenValid();
  }, []);

  useEffect(() => {
    if ((loaded || error) && !isTokenLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isTokenLoading]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
      <GestureHandlerRootView>
        <PortalProvider>
          <StatusBar style="auto" />
          <FeedbackAlert />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>

            <Stack.Protected guard={!hasCompleteOnboarding}>
              <Stack.Screen
                name="onboarding"
                options={{ headerShown: false }}
              />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated && hasCompleteOnboarding}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </PortalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
