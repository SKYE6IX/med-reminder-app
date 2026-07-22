import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type FullScreenViewProps = ViewProps;

export function FullScreenView({ style, ...rest }: FullScreenViewProps) {
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor,
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
