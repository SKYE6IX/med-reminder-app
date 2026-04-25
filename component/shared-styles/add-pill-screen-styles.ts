import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useAddPillScreenStyles() {
  const isIOS = Platform.OS === "ios";
  const { bottom } = useSafeAreaInsets();
  const color = useThemeColor({}, "textPrimary");

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
    },
    title: {
      fontFamily: "Roboto_500Medium",
      fontSize: 18,
      lineHeight: 21,
      color,
    },
    sectionContainer: {
      gap: 16,
    },
    button: {
      marginTop: "auto",
    },
    bottomInset: {
      paddingBottom: isIOS ? bottom + 10 : 10,
    },
  });
}
