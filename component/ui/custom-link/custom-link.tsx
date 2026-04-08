import { Href, Link } from "expo-router";
import { type ComponentProps } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";

import { useLinkButtonStyles } from "@/component/shared-styles/link-button-styles";

type CustomLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
  label: string;
  variant?: "filled" | "outline";
  textVaraint?: "regularText" | "accentText" | "mutedText";
  style?: ViewProps["style"];
};

export default function CustomLink({
  href,
  label,
  variant = "filled",
  textVaraint = "regularText",
  style,
}: CustomLinkProps) {
  const linkStyles = useLinkButtonStyles();

  return (
    <View
      style={[linkStyles.base, linkStyles[variant], style]}
      testID="custom-link-view"
    >
      <Link href={href} asChild>
        <Pressable style={pressableStyles.container}>
          <Text style={[linkStyles.text, linkStyles[textVaraint]]}>
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
