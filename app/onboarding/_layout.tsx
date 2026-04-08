import { Stack, useSegments } from "expo-router";
import React from "react";

import OnboardingStepper from "@/component/ui/onboarding-stepper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Platform } from "react-native";
const ONBOARDING_SEGMENTS = ["onboarding", "second", "third", "final"];

export default function OnboardingLayout() {
  const isIos = Platform.OS === "ios";
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = ONBOARDING_SEGMENTS.indexOf(currentScreen);

  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerTransparent: isIos,
          ...(!isIos && {
            headerStyle: {
              backgroundColor,
            },
          }),
          headerShadowVisible: false,
          headerTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <OnboardingStepper
        steps={ONBOARDING_SEGMENTS}
        currentStep={currentStep}
      />
    </React.Fragment>
  );
}
