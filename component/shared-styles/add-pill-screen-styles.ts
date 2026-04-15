import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_HEIGHT = 60;

export function useAddPillScreenStyles() {
  const isIOS = Platform.OS === "ios";
  const { bottom } = useSafeAreaInsets();
  const color = useThemeColor({}, "textPrimary");

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: isIOS ? TAB_HEIGHT + bottom : bottom,
    },
    title: {
      fontFamily: "Roboto_500Medium",
      fontSize: 18,
      lineHeight: 21,
      color,
    },
    button: {
      marginTop: "auto",
    },
  });
}
