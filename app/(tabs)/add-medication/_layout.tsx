import Stepper from "@/component/ui/stepper";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { useMedicationProfileQuery } from "@/hooks/use-medication-profile-query";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useRef } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

const ADD_PILL_SEGMENTS = ["add-medication", "details-step", "schedule-step", "final-step"];

export default function AddPillLayout() {
  const openBannerRef = useRef<SubscriptionBannerRef>(null);
  const segments = useSegments();
  const { count } = useMedicationProfileQuery();
  const { maxMedications } = useSubscriptionPlanQuery();

  const router = useRouter();

  const currentScreen = segments[segments.length - 1];
  const currentStep = ADD_PILL_SEGMENTS.indexOf(currentScreen);

  const isPageActive = currentScreen === ADD_PILL_SEGMENTS[0];

  const canCreateMedicationProfile =
    maxMedications === null ? true : count < maxMedications ? true : false;

  // Guard expect a boolean
  useEffect(() => {
    if (isPageActive && !canCreateMedicationProfile) {
      openBannerRef.current?.openModal();
    }
  }, [canCreateMedicationProfile, isPageActive]);

  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen name="index">
          <Stack.Header transparent style={{ shadowColor: "transparent" }} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="details-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header transparent style={{}} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="schedule-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header transparent style={{ shadowColor: "transparent" }} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>

        <Stack.Screen name="final-step">
          <Stack.Screen.BackButton displayMode="minimal" />
          <Stack.Header transparent style={{ shadowColor: "transparent" }} />
          <Stack.Screen.Title asChild />
        </Stack.Screen>
      </Stack>

      <Stepper currentStep={currentStep} />
      {/* Subscription Banner */}
      <SubscriptionBanner
        ref={openBannerRef}
        onBannerClose={() => {
          router.navigate("/(tabs)/medications");
        }}
      />
    </React.Fragment>
  );
}
