import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import ClockIcon from "@/component/icons/clock-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfile } from "@/types/medication";
import { toLocalTime } from "@/utils/luxonUtil";
import { updateTimeOcurrencesRule } from "@/utils/rruleUtils";
import React, { useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import AndroidDateTimeWrapper, {
  DateTimeWrapperRef,
} from "../date-time-wrapper/date-time-wrapper.android";
import IOSDateTimeWrapper from "../date-time-wrapper/date-time-wrapper.ios";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

const getStartTime = (startTime: string) => {
  const date = new Date(startTime);
  return toLocalTime(date);
};

export default function DetailsTimeSettings({
  medicationProfile,
  fullWidth,
}: {
  medicationProfile: MedicationProfile;
  fullWidth: boolean;
}) {
  const sharedStyles = useSharedStyles();
  const isAndroid = Platform.OS === "android";

  const { openSheet, closeSheet } = useBottomSheet();

  const [updatedRule, setUpdatedRule] = useState("");

  const { mutate, isPending } = useUpdateMedicationMutation();

  const androidTimeRef = useRef<DateTimeWrapperRef>(null); // @Platform ANDROID ONLY

  const color = useThemeColor({}, "textPrimary");

  const handleOnDateTimeChange = (date: Date) => {
    const newRules = updateTimeOcurrencesRule({
      rrule: medicationProfile.schedule.recurrenceRule,
      date,
    });
    setUpdatedRule(newRules);

    // @platform ANDROID ONLY
    if (isAndroid && medicationProfile.schedule.recurrenceRule !== newRules) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: newRules } });
    }
  };

  // @platform IOS ONLY
  // Function to perform an Action that will
  // update the time if it's diffrent from the current one.
  const handleOnButtonPress = () => {
    if (updatedRule !== medicationProfile.schedule.recurrenceRule) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: updatedRule } });
      closeSheet();
    } else {
      closeSheet();
    }
  };

  const openDateTime = () => {
    if (isAndroid) {
      androidTimeRef.current?.showDateTime();
    } else {
      openSheet({
        title: "Время начала",
        snapPointPercent: "45%",
        content: (
          <IOSDateTimeWrapper
            mode="time"
            onDateTimeChange={(date) => handleOnDateTimeChange(date)}
            showUpdateButton
            onUpdateButtonPress={handleOnButtonPress}
          />
        ),
      });
    }
  };

  return (
    <React.Fragment>
      <Pressable
        style={[sharedStyles.card, fullWidth ? undefined : sharedStyles.detailsGroupItem]}
        onPress={openDateTime}
      >
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Время начала</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <ClockIcon color={color} />
          <Text style={sharedStyles.cardTextContent}>
            {getStartTime(medicationProfile.schedule.starTime)}
          </Text>
        </View>
      </Pressable>
      <Loader visible={isPending} />

      {/* ONLY FOR ANDROID */}
      {isAndroid && (
        <AndroidDateTimeWrapper
          ref={androidTimeRef}
          onDateTimeChange={(date) => handleOnDateTimeChange(date)}
          mode="time"
        />
      )}
    </React.Fragment>
  );
}
