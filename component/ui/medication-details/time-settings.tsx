import ArrowRight from "@/component/icons/arrow-right";
import ClockIcon from "@/component/icons/clock-icon";
import DateTimeWrapper, { DateTimeWrapperRef } from "@/component/ui/date-time-wrapper";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfileResponse } from "@/types/medication";
import { toLocalTime } from "@/utils/luxonUtil";
import { updateTimeOcurrencesRule } from "@/utils/rruleUtils";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

const getStartTime = (startTime: string) => {
  const date = new Date(startTime);
  return toLocalTime(date);
};

export default function DetailsTimeSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const [updatedRule, setUpdatedRule] = useState("");

  const { mutate, isPending } = useUpdateMedicationMutation();

  const timeRef = useRef<DateTimeWrapperRef>(null);

  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");

  // Events are only used on ANDROID!!!
  const handleSetTime = (date: Date, event?: DateTimePickerEvent["type"]) => {
    const newRules = updateTimeOcurrencesRule({
      rrule: medicationProfile.schedule.recurrenceRule,
      date,
    });
    setUpdatedRule(newRules);

    // @platform ANDROID ONLY
    if (event && event === "set" && medicationProfile.schedule.recurrenceRule !== newRules) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: newRules } });
    }
  };

  // @platform IOS ONLY
  // Function to perform an Action that will
  // update the time if it's diffrent from the current one.
  const handleOnButtonPress = () => {
    if (updatedRule !== medicationProfile.schedule.recurrenceRule) {
      timeRef.current?.closeDateTime();
      mutate({ id: medicationProfile.id, data: { recurrenceRule: updatedRule } });
    } else {
      timeRef.current?.closeDateTime();
    }
  };

  return (
    <React.Fragment>
      <Pressable
        style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
        onPress={() => timeRef.current?.showDateTime()}
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
      <DateTimeWrapper
        onDateTimeSelected={(date, event) => handleSetTime(date, event)}
        ref={timeRef}
        mode="time"
        bottomSheetTitle="Время начала"
        showUpdateButton
        onUpdateButtonPress={handleOnButtonPress}
      />
      <Loader visible={isPending} />
    </React.Fragment>
  );
}
