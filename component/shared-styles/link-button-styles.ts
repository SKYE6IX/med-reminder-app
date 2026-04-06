import { StyleSheet } from "react-native";

export const linkButtonStyles = StyleSheet.create({
  base: {
    width: "100%",
    height: 48,
    borderRadius: 16,
  },
  text: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "#FFF",
    lineHeight: 19.2,
  },
  primary: {},
  secondary: {},
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  outlineText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: "#9E9E9E",
  },
});
