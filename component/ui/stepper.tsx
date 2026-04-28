import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WRAPPER_WIDTH = 230;
const STEP_LENGTH = 4;
const STEP_WIDTH = (WRAPPER_WIDTH - 4 * (STEP_LENGTH - 1)) / STEP_LENGTH;
const STEP_STRIDE = STEP_WIDTH + 4;

export default function Stepper({ currentStep }: { currentStep: number }) {
  const insets = useSafeAreaInsets();

  const tintColor = useThemeColor({}, "tint");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(currentStep * STEP_STRIDE) }],
  }));

  return (
    <View style={[styles.container, { top: insets.top }]}>
      <View style={styles.wrapper}>
        <Animated.View
          style={[styles.stepProgress, { backgroundColor: tintColor }, animatedStyle]}
        />
        {Array.from({ length: STEP_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.step]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    pointerEvents: "none",
  },
  wrapper: {
    width: 230,
    flexDirection: "row",
    gap: 4,
    position: "relative",
  },
  stepProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 2,
    zIndex: 10,
    borderRadius: 16,
    width: STEP_WIDTH,
  },
  step: {
    height: 2,
    borderRadius: 16,
    backgroundColor: "#CECECE",
    flex: 1,
  },
});
