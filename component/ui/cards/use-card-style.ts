import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";

export function useCardStyles() {
  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  return StyleSheet.create({
    card: {
      minHeight: 120,
      borderRadius: 16,
      padding: 16,
      position: "relative",
      gap: 16,
      backgroundColor: bgSecondary,
    },
    absolute: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    cardInnerContainer: {
      flexDirection: "row",
      gap: 10,
    },
    cardImageWrapper: {
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: bgTertiary,
    },
    cardImage: {
      width: "100%",
      height: "100%",
    },
    cardContent: {
      gap: 8,
    },
    cardContentRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    cardTextLarge: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      lineHeight: 19.2,
      color,
    },
    cardTextMedium: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      lineHeight: 16.2,
      textTransform: "lowercase",
    },

    medicationSchedule: {
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    },
    medicationScheduleText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 14,
      lineHeight: 16.2,
    },
    medicationScheduleDivider: {
      width: 1.5,
      height: 16,
    },

    cardActionButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    profile: {
      flexDirection: "row",
      gap: 4,
    },
    profileImage: {
      width: 15,
      height: 15,
      borderRadius: 999,
      backgroundColor: "#90A8F06E",
      justifyContent: "center",
      alignItems: "center",
    },
    profileImagePlaceholder: {
      fontFamily: "Roboto_400Regular",
      fontSize: 10,
      lineHeight: 11,
    },
    profileText: {
      fontFamily: "Roboto_400Regular",
      fontSize: 12,
      lineHeight: 14.2,
    },
    badge: {
      width: 90,
      height: 25,
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      right: 0,
      top: 0,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
    },
    badgeText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      lineHeight: 14.2,
      color: "#F7F7F7",
    },
    cardButton: {
      width: 90,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: tintColor,
    },
    cardButtonText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 12,
      lineHeight: 14.2,
      color: "#F7F7F7",
    },
    progressContainer: {
      gap: 5,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    progressTextValue: {
      fontFamily: "Roboto_400Regular",
      fontSize: 13,
      lineHeight: 14.2,
    },
    progressPipe: {
      height: 5,
      width: "100%",
      borderRadius: 35,
      position: "relative",
    },
    progressActivePipe: {
      position: "absolute",
      height: 5,
      width: "50%",
      borderRadius: 35,
      top: 0,
      left: 0,
    },
  });
}
