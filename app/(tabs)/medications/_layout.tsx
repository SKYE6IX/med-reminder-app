import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function PillsLayout() {
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header
          transparent
          blurEffect="systemMaterial"
          style={{ shadowColor: "transparent", backgroundColor: bgPrimary }}
        />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          Мои лекарства
        </Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="[medicationProfileId]">
        <Stack.Header
          transparent
          blurEffect="systemMaterial"
          style={{ shadowColor: "transparent", backgroundColor: bgPrimary }}
        />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>
          Информация о лекарстве
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
