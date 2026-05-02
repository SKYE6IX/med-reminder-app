import { Platform, StyleSheet, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type OnboardingVievProps = ViewProps;

export function OnboardingView({ style, ...rest }: OnboardingVievProps) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  // NOTE:
  // The reason we use VIEW instead of SafeAreaView from "react-native-safe-area-context",
  // is because we want to have control on the stepper position around the screen.
  // This won't be possible if we use the SafeAreaView wrapper. Because diffrent device has it's
  // own top and bottom inset value.
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
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
