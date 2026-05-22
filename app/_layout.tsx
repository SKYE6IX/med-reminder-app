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
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NotificationHelper } from "@/helpers/notification-helper";
import { getAuthorizedUser } from "@/utils/getAuthorizedUser";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

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
  const [isReady, setIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  const resetOnBoarding = async () => {
    await deleteItemAsync("auth-store");
  };

  async function bootstrap() {
    // Check for valid token and authorized user with it.
    const token = await getValidAccessToken();
    if (token) {
      getAuthorizedUser();
      useAuthStore.getState().setIsAuthenticated(true);
    } else {
      useAuthStore.getState().setIsAuthenticated(false);
    }
    // Handle when app is open by a notification
    await NotificationHelper.handleOnNotificationOpenApp();
  }

  useEffect(() => {
    bootstrap()
      .then(() => setIsReady(true))
      .catch((error) => {
        console.log("Error occur in bootstrap -> ", error);
        setIsReady(true);
      });

    // Susbscribe to foreground events for notifications
    const unsubscribe = NotificationHelper.handleOnForeGroundEvent();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // resetOnBoarding();
    // Only load the app after the fonts are loaded.
    if (isReady && (loaded || error)) {
      SplashScreen.hideAsync();
    }
  }, [error, isReady, loaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <GestureHandlerRootView>
          <PortalProvider>
            <StatusBar style="auto" />
            <FeedbackAlert />
            <Stack>
              <Stack.Protected guard={!hasCompleteOnboarding}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={!isAuthenticated && hasCompleteOnboarding}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// TODO:
// 1. Test on android ✅
// 2. Set up notification for Refilled Pack
// 3. Animate the week calender selection, make it swipeable,
//    additionally, when user switch to new week, we should set a default,
//    and when they go back to previous week, we set to exacly when they were,
//    before they switch week.
// 4. Implementation for adding image or emoji.
// 5. bluring card when it has been set to in_active.
// 6. Premium user flag and basic user flag feautures.
// 7. Premimum page selections
