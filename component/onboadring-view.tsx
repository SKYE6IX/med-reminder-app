import { Platform, StyleSheet, View, type ViewProps } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColor } from "@/hooks/use-theme-color";

export type OnboardingVievProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function OnboardingView({
  style,
  lightColor,
  darkColor,
  ...rest
}: OnboardingVievProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  return (
    <View
      style={[
        {
          backgroundColor,
          paddingTop: Platform.OS === "ios" ? headerHeight : 0,
          paddingBottom: insets.bottom + 20,
        },
        styles.container,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    gap: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
