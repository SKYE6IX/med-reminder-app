import { Href, Link } from "expo-router";
import { type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { linkButtonStyles } from "@/component/shared-styles/link-button-styles";
import { useThemeColor } from "@/hooks/use-theme-color";

type CustomLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
  textVaraint?: "text" | "outlineText";
};

export default function CustomLink({
  style,
  href,
  label,
  variant = "primary",
  textVaraint = "text",
}: CustomLinkProps) {
  const backgroundColor = useThemeColor({}, "buttonPrimaryBg");
  return (
    <View
      style={[
        { backgroundColor },
        linkButtonStyles.base,
        linkButtonStyles[variant],
        style,
      ]}
      testID="custom-link-view"
    >
      <Link href={href} asChild>
        <Pressable style={pressableStyles.container}>
          <Text
            style={linkButtonStyles[textVaraint]}
            testID="custom-link-label"
          >
            {label}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const pressableStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
