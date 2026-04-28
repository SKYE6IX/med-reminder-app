import Stepper from "@/component/ui/stepper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack, useSegments } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

const ADD_PILL_SEGMENTS = ["add-medication", "details-step", "schedule-step", "final-step"];

export default function AddPillLayout() {
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = ADD_PILL_SEGMENTS.indexOf(currentScreen);

  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  return (
    <React.Fragment>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor,
          },
          headerTitle: "",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          contentStyle: {
            backgroundColor,
          },
        }}
      />
      <Stepper currentStep={currentStep} />
    </React.Fragment>
  );
}
