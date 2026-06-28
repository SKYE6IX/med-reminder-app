import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";

export function useLinkButtonStyles() {
  const primaryBg = useThemeColor({}, "buttonPrimaryBg");
  const outlineBg = useThemeColor({}, "buttonOutlineBg");
  const textPrimary = useThemeColor({}, "textPrimary");
  const textMuted = useThemeColor({}, "textMuted");
  const disabledBg = useThemeColor({}, "buttonDisabledBg");
  const tintColor = useThemeColor({}, "tint");

  return StyleSheet.create({
    base: {
      height: 48,
      width: "100%",
      borderRadius: 16,
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    text: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      lineHeight: 19.2,
    },

    filled: {
      backgroundColor: primaryBg,
    },

    outline: {
      backgroundColor: outlineBg,
      borderWidth: 1,
      borderColor: tintColor,
    },

    disabled: {
      backgroundColor: disabledBg,
    },

    danger: {
      backgroundColor: "#DC0000",
    },

    regularText: {
      color: "#FFF",
    },

    accentText: {
      color: textPrimary,
    },

    mutedText: {
      color: textMuted,
    },

    tintText: {
      color: tintColor,
    },
    logo: {
      width: 24,
      height: 24,
      objectFit: "contain",
    },
  });
}
