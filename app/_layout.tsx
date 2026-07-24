import { BottomSheetProvider } from "@/component/bottom-sheet-provider";
import FeedbackAlert from "@/component/ui/feedback-alert";
import { QueryKey } from "@/constants/query-keys";
import { logOverdueEvents } from "@/helpers/log-overdue-event";
import { createNextScheduleEventNotification } from "@/helpers/schedule-next-event-notifications";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { api } from "@/utils/axiosInstance";
import { getAuthorizedUser } from "@/utils/getAuthorizedUser";
import { queryClient } from "@/utils/query-client";
import { getValidAccessToken } from "@/utils/tokenUtils";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { PortalProvider } from "@gorhom/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import * as LocalAuthentication from "expo-local-authentication";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../i18next/i18next";

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
    try {
      const token = await getValidAccessToken();
      if (token) {
        // Prefetch Applications Datas
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: [QueryKey.subscriptionPlan],
            queryFn: async () => {
              const res = await api.get("subscriptions");
              return res.data;
            },
          }),

          queryClient.prefetchQuery({
            queryKey: [QueryKey.medicationList],
            queryFn: async () => {
              const res = await api.get("medications");
              return res.data;
            },
          }),

          logOverdueEvents(),

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
    } catch (error) {
      console.error("An error occur in Bootstrap", error);
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    // Only load the app after the fonts are loaded.
    if (isReady && (loaded || error)) {
      SplashScreen.hide();
    }
  }, [error, isReady, loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <GestureHandlerRootView>
          <PortalProvider>
            <StatusBar style="auto" />
            <FeedbackAlert />

            <BottomSheetProvider>
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
            </BottomSheetProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
