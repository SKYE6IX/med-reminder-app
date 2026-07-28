import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function SettingsLayout() {
  const { t } = useTranslation();
  const color = useThemeColor({}, "textPrimary");

  const { isPremiumPlan } = useSubscriptionPlanQuery();

  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.index_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="user-details">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.profile_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="relations">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.relation_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="notifications">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.notification_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="reminders">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.reminders_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="security">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.security_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="subscription">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.subscription_header")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Protected guard={!isPremiumPlan}>
        <Stack.Screen name="subscription-plan">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header transparent style={{ shadowColor: "transparent" }} />
          <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
            {t("settings_screen.subscription_plans_header")}
          </Stack.Screen.Title>
        </Stack.Screen>
      </Stack.Protected>

      <Stack.Screen name="about">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("settings_screen.about_header")}
        </Stack.Screen.Title>
      </Stack.Screen>
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
});
