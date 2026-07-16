import { StyleSheet } from "react-native";

export function useCustomFreqStyles() {
  return StyleSheet.create({
    container: {
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 16,
    },
    frequencyPressable: {
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    frequencyPressableText: {
      fontFamily: "Roboto_500Medium",
      fontSize: 16,
      lineHeight: 19.2,
    },
    opitonsItem: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    optionsLabel: {
      fontFamily: "Roboto_400Regular",
      fontSize: 16,
      lineHeight: 19.2,
      color: "#F7F7F7",
    },
    optionsGroup: {
      flexShrink: 0,
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    optionsGroupItem: {
      width: 80,
      alignItems: "center",
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 16,
      backgroundColor: "#FFFFFF33",
    },
    groupItemValue: {
      fontFamily: "Roboto_400Regular",
      fontSize: 18,
      lineHeight: 22.2,
      color: "#F7F7F7",
    },
  });
}
