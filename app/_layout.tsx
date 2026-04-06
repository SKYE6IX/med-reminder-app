import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isAuthenticated = false;
  const hasComletedOnboarding = true;

  // Only load the app after the fonts are loaded.
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <React.Fragment>
      <StatusBar style="dark" translucent />
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated && hasComletedOnboarding}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!hasComletedOnboarding}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </React.Fragment>
  );
}
