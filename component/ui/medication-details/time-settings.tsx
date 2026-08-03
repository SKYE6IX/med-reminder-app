import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import ClockIcon from "@/component/icons/clock-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { useTranslation } from "@/i18next/i18next";
import { MedicationProfileReponse } from "@/types/medication";
import { toLocalTime } from "@/utils/luxonUtil";
import { updateScheduleTimes } from "@/utils/rruleUtils";
import React, { useRef } from "react";
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
  medicationProfile: MedicationProfileReponse;
  fullWidth: boolean;
}) {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const isAndroid = Platform.OS === "android";

  const { openSheet, closeSheet } = useBottomSheet();

  const { mutate, isPending } = useUpdateMedicationMutation({ name: "UPDATE TIME" });

  // @Platform ANDROID ONLY
  const androidTimeRef = useRef<DateTimeWrapperRef>(null);

  const color = useThemeColor({}, "textPrimary");

  const updateFreqRule = (date: Date) => {
    const newRules = updateScheduleTimes({
      rrule: medicationProfile.schedule.recurrenceRule,
      date,
    });
    if (medicationProfile.schedule.recurrenceRule !== newRules) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: newRules } });
    }
  };

  // @platform ANDROID ONLY
  const handleOnDateTimeChange = (date: Date) => {
    if (isAndroid) {
      updateFreqRule(date);
    }
  };

  // @platform IOS ONLY
  const handleApplyChange = (date: Date) => {
    updateFreqRule(date);
    closeSheet();
  };

  const openDateTime = () => {
    if (isAndroid) {
      androidTimeRef.current?.showDateTime();
    } else {
      openSheet({
        title: t("medication_screen.details_schedule_time_label"),
        snapPointPercent: "45%",
        content: (
          <IOSDateTimeWrapper
            mode="time"
            onDateTimeChange={(date) => handleOnDateTimeChange(date)}
            applyChange={handleApplyChange}
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
          <Text style={sharedStyles.cardTitle}>
            {t("medication_screen.details_schedule_time_label")}
          </Text>
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
