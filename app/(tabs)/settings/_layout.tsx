import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";
import { ColorValue, StyleProp, StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function SettingsLayout() {
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const headerStyle: StyleProp<{
    backgroundColor: ColorValue;
    shadowColor: "transparent";
  }> = {
    shadowColor: "transparent",
    backgroundColor: bgPrimary,
  };

  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Header transparent blurEffect="systemMaterial" style={headerStyle} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>Настройки</Stack.Screen.Title>
      </Stack.Screen>

      <Stack.Screen name="profile">
        <Stack.Screen.BackButton displayMode="minimal" />
        <Stack.Header transparent blurEffect="systemMaterial" style={headerStyle} />
        <Stack.Screen.Title style={[styles.headerTitle, { color }]}>Профиль</Stack.Screen.Title>
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
