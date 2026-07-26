import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function MedicationsLayout() {
  const { t } = useTranslation();
  const color = useThemeColor({}, "textPrimary");
  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("medication_screen.list_title")}
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="[medicationProfileId]">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent style={{ shadowColor: "transparent" }} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          {t("medication_screen.details_title")}
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
