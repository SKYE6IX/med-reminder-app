import Stepper from "@/component/ui/stepper";
import SubscriptionOfferBanner, {
  SubscriptionOfferBannerRef,
} from "@/component/ui/subscription-offer-banner";
import { useMedicationProfileQuery } from "@/hooks/use-medication-profile-query";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ColorValue, StyleProp } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

const ADD_PILL_SEGMENTS = ["add-medication", "details-step", "schedule-step", "final-step"];

export default function AddPillLayout() {
  const openBannerRef = useRef<SubscriptionOfferBannerRef>(null);
  const segments = useSegments();
  const { count } = useMedicationProfileQuery();
  const { maxMedications } = useSubscriptionPlanQuery();

  const router = useRouter();

  const currentScreen = segments[segments.length - 1];
  const currentStep = ADD_PILL_SEGMENTS.indexOf(currentScreen);
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const isPageActive = currentScreen === ADD_PILL_SEGMENTS[0];

  const headerStyle: StyleProp<{
    backgroundColor: ColorValue;
    shadowColor: "transparent";
  }> = {
    shadowColor: "transparent",
    backgroundColor: bgPrimary,
  };

  const canCreateMedicationProfile =
    maxMedications === null ? true : count < maxMedications ? true : false;

  // Guard expect a boolean
  useEffect(() => {
    if (isPageActive && !canCreateMedicationProfile) {
      openBannerRef.current?.toggleBanner();
    }
  }, [canCreateMedicationProfile, isPageActive]);

  const onModalDismiss = () => {
    router.navigate("/(tabs)/medications");
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

      {/* Subscription Banner */}
      <SubscriptionOfferBanner ref={openBannerRef} onModalClose={onModalDismiss} />
    </React.Fragment>
  );
}
