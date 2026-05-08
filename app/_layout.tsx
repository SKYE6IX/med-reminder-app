import FeedbackAlert from "@/component/ui/feedback-alert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { getAuthorizedUser } from "@/utils/getAuthorizedUser";
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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  const checkTokenAndFetchUser = async () => {
    try {
      const token = await getValidAccessToken();
      if (token) {
        getAuthorizedUser();
        useAuthStore.getState().setIsAuthenticated(true);
        setIsReady(true);
      } else {
        useAuthStore.getState().setIsAuthenticated(false);
        setIsReady(true);
      }
    } catch (error) {
      console.log("An error occur when checking auth or fetching user -> ", error);
      setIsReady(true);
    }
  };

  // Only load the app after the fonts are loaded.
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  // Check for valid access token or get a refresh token if the token expired.
  useEffect(() => {
    checkTokenAndFetchUser();
  }, []);

  useEffect(() => {
    if (isReady && (loaded || error)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isReady]);

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
// Index Page for Schedule Events
// 1. We need to display the upcoming hour for only pills that are on the day of when user
// open the app. ✅
// 2. The button need to be available immediately when the the is equal or passed. Same time when
// notification set up will go off. ✅
// 3. With sorting, it more than just using the schedule time. It neccessary to push down the taken
// badge or missed badge down in the ALL tabs. and all the upcoming shown first. ✅
// 4. The item need to update to re-render when the screen is focus back to
// them to keep all events up to dates ✅

// Medication Details Page
// 1. We need to render the right text in Russian for the rules.
// 2. Update how many pills has been taken.
// 3. Give oppurtunity for user to to add the pack later if they didn't add it.
// 4. Display the times for when user is updating ther rules so they can see it.

// Pack Set up
// 1. Consume data for packs
// 2. Set up progess based on the pill taken and how many left.

// Medication Card
// 1. Some dosage meter shown undifined. Fix it. ✅
