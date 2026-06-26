import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, StyleSheet } from "react-native";

export function useAddPillScreenStyles() {
  const color = useThemeColor({}, "textPrimary");
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
    },
    title: {
      fontFamily: "Roboto_500Medium",
      fontSize: Platform.OS === "android" ? 16 : 18,
      lineHeight: 21,
      color,
    },
    sectionContainer: {
      gap: 16,
    },
    button: {
      marginTop: "auto",
    },
  });
}
