import { Stack, useSegments } from "expo-router";
import React from "react";

import OnboardingStepper from "@/component/ui/onboarding-stepper";
import { ColorValue, StyleProp } from "react-native";
const ONBOARDING_SEGMENTS = ["onboarding", "second", "third", "final"];

export default function OnboardingLayout() {
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = ONBOARDING_SEGMENTS.indexOf(currentScreen);

  const headerStyle: StyleProp<{
    backgroundColor: ColorValue;
    shadowColor: "transparent";
  }> = {
    shadowColor: "transparent",
    backgroundColor: "transparent",
  };

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="index">
          <Stack.Header style={headerStyle} />
          <Stack.Title></Stack.Title>
        </Stack.Screen>

        <Stack.Screen name="second">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Title></Stack.Title>
        </Stack.Screen>

        <Stack.Screen name="third">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Title></Stack.Title>
        </Stack.Screen>

        <Stack.Screen name="final">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Title></Stack.Title>
        </Stack.Screen>
      </Stack>

      <OnboardingStepper steps={ONBOARDING_SEGMENTS} currentStep={currentStep} />
    </React.Fragment>
  );
}
