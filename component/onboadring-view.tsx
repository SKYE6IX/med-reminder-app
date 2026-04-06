import { StyleSheet, type ViewProps } from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          {
            paddingBottom: insets.bottom,
            backgroundColor,
          },
          styles.container,
          style,
        ]}
        {...rest}
      />
    </SafeAreaProvider>
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
