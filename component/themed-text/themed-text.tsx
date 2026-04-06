import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "subtitle";
};

export function ThemedText({
  lightColor,
  darkColor,
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textPrimary",
  );
  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
      testID="themed-text"
    />
  );
}

const styles = StyleSheet.create({
  default: {},
  title: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 24,
    lineHeight: 24,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "center",
  },
});
