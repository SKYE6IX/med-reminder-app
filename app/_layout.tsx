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
      // Prefetch Applications Datas
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["subscriptions-plan"],
          queryFn: async () => (await api.get("subscriptions")).data,
        }),
        queryClient.prefetchQuery({
          queryKey: ["medication-profile", "list"],
          queryFn: async () => (await api.get("medications")).data,
        }),

        // Generate next medicatiion schedule events if available
        createNextScheduleEventNotification({
          ...useAppSettingsStore.getState().notfication,
          ...useAppSettingsStore.getState().reminderPreferences,
        }),
      ]);

      getAuthorizedUser();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      // If user set up local device lock
      if (useAppSettingsStore.getState().useDeviceLock && isEnrolled) {
        const localAuthenticate = await LocalAuthentication.authenticateAsync({
          promptMessage: "Подтвердите личность",
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
              {/* ONBOARDING */}
              <Stack.Protected guard={!hasCompleteOnboarding}>
                <Stack.Screen name="onboarding">
                  <Stack.Header hidden />
                  <Stack.Title></Stack.Title>
                </Stack.Screen>
              </Stack.Protected>

              {/* AUTHENTICATIONS */}
              <Stack.Protected guard={!isAuthenticated && hasCompleteOnboarding}>
                <Stack.Screen name="(auth)">
                  <Stack.Header hidden />
                  <Stack.Title></Stack.Title>
                </Stack.Screen>
              </Stack.Protected>

              {/* MAIN APPLICATION */}
              <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)">
                  <Stack.Header hidden />
                  <Stack.Title></Stack.Title>
                </Stack.Screen>
              </Stack.Protected>
            </Stack>
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// TODO:
// Test App on Wider screen, to make sure it render properly
// Reset all local setting back to default when user delete their account. ✅
// Social login issue:
//  It's possible that when user delete their account, and if for some reason they want to sign in again,
//  we don't have access to name or email.

// When sign out and sign in, data are not sync immdiately with the current user. ✅
// Clear all data if user sign out also. ✅
// Confirm data are fresh when user sign in again ✅

// When adding pills on custom selection, user should able to close when they click outside of the application
// Also the buttons on the custom arew very small.
// The form selection in add pills, should be arrage based on the width of the screen.
