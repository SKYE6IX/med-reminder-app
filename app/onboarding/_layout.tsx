import { Stack, useSegments } from "expo-router";
import React from "react";

import OnboardingStepper from "@/component/onboarding-stepper";
const ONBOARDING_SEGMENTS = ["onboarding", "second", "third", "final"];

export default function OnboardingLayout() {
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = ONBOARDING_SEGMENTS.indexOf(currentScreen);

  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerTransparent: true,
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
