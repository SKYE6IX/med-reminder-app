import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OnboardingStepperProps = {
  currentStep: number;
  steps: string[];
};

export default function OnboardingStepper({ currentStep, steps }: OnboardingStepperProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const top = insets.top + (width - 20);

  return (
    <View style={[{ top }, styles.container]}>
      {steps.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.step,
            {
              backgroundColor: i === currentStep ? "#1256DB" : "#CECECE",
              flexGrow: i === currentStep ? 2 : 1,
              transitionProperty: "flexGrow",
              transitionDuration: 300,
            } as any,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 14,
    flexDirection: "row",
    gap: 5,
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  step: {
    height: "100%",
    borderRadius: 50,
  },
});
