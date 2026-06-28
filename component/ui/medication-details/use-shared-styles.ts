import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";

export function useSharedStyles() {
  const color = useThemeColor({}, "textPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  return StyleSheet.create({
    detailsGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    detailsGroupItem: {
      width: "48%",
    },

    card: {
      padding: 12,
      borderRadius: 16,
      minHeight: 76,
      gap: 8,
      justifyContent: "space-between",
      backgroundColor: bgSecondary,
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    cardBody: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    cardTitle: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      lineHeight: 19.2,
      color,
    },

    cardTextContent: {
      fontFamily: "Roboto_400Regular",
      fontSize: 14,
      lineHeight: 16.2,
      color,
    },
  });
}
