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
import * as LocalAuthentication from "expo-local-authentication";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NotificationHelper } from "@/helpers/notification-helper";
import { createNextScheduleEventNotification } from "@/helpers/schedule-next-event-notifications";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { api } from "@/utils/axiosInstance";
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
  const { useDeviceLock } = useAppSettingsStore();
  const { isAuthenticated, hasCompleteOnboarding } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
  });

  async function bootstrap() {
    // Check for valid token and authorized user with it.
    const token = await getValidAccessToken();
    if (token) {
      // Prefetch Datas
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["subscriptions-plan"],
          queryFn: async () => (await api.get("subscriptions")).data,
        }),
        queryClient.prefetchQuery({
          queryKey: ["medication-profile", "list"],
          queryFn: async () => (await api.get("medications")).data,
        }),
        createNextScheduleEventNotification({
          ...useAppSettingsStore.getState().notfication,
          ...useAppSettingsStore.getState().reminderPreferences,
        }),
      ]);
      getAuthorizedUser();

      // If user set up local device lock
      if (useDeviceLock) {
        const localAuthenticate = await LocalAuthentication.authenticateAsync({
          cancelLabel: "Отменить",
          fallbackLabel: "Используйте пароль",
        });
        if (localAuthenticate.success) {
          useAuthStore.getState().setIsAuthenticated(true);
        }
      } else {
        useAuthStore.getState().setIsAuthenticated(true);
      }
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
// 1. Implement versioning ✅
// 2. Set up rating action ✅.
// 3. set up contact us page which will include
//  email ✅
// 4. Set up lock screen for user that activate it. ✅
// 5. Set up all production setting for both IOS and Android
