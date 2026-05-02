import FeedbackAlert from "@/component/ui/feedback-alert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserStore } from "@/stores/user-store";
import { UserResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { getValidAccessToken } from "@/utils/tokenUtils";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { PortalProvider } from "@gorhom/portal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
        const { data } = await api.get<UserResponse>("/users");
        useUserStore.getState().setUser(data);
        useAuthStore.getState().setIsAuthenticated(true);
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

  // Development Functions
  const clearOnbordingComplete = () => {
    deleteItemAsync("auth-store");
  };

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);
    } catch (e) {
      // read key error
    }
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  };

  // Check for valid access token or get a refresh token if the token expired.
  useEffect(() => {
    checkTokenAndFetchUser();
  }, []);

  useEffect(() => {
    // clearOnbordingComplete();
    // getAllKeys();
    if ((loaded || error) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isReady]);

  return (
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
  );
}
