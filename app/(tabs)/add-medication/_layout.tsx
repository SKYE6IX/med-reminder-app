import Stepper from "@/component/ui/stepper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack, useSegments } from "expo-router";
import React from "react";
import { ColorValue, StyleProp } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

const ADD_PILL_SEGMENTS = ["add-medication", "details-step", "schedule-step", "final-step"];

export default function AddPillLayout() {
  const segments = useSegments();
  const currentScreen = segments[segments.length - 1];
  const currentStep = ADD_PILL_SEGMENTS.indexOf(currentScreen);
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const headerStyle: StyleProp<{
    backgroundColor: ColorValue;
    shadowColor: "transparent";
  }> = {
    shadowColor: "transparent",
    backgroundColor: bgPrimary,
  };

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="index">
          <Stack.Header style={headerStyle} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="details-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="schedule-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="final-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header style={headerStyle} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>
      </Stack>
      <Stepper currentStep={currentStep} />
    </React.Fragment>
  );
}
