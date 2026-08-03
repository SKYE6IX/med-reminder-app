import { useBottomSheet } from "@/component/bottom-sheet-provider";
import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import ArrowRight from "@/component/icons/arrow-right";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { useTranslation } from "@/i18next/i18next";
import { SchedulePreset } from "@/stores/add-pill-store";
import { MedicationProfileReponse } from "@/types/medication";
import { formatRRuleToText, generateScheduleTimes } from "@/utils/rruleUtils";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import FrequencySettings from "../frequency-settings";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsFrequencySettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileReponse;
}) {
  const { t, i18n } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { openSheet, closeSheet } = useBottomSheet();

  const { isPending, mutate } = useUpdateMedicationMutation({ name: "UPDATE FREQUENCY" });

  const ruleToText = formatRRuleToText(medicationProfile.schedule.recurrenceRule, i18n.language);

  const handleUpdateRules = (updatedRule: string) => {
    closeSheet();
    if (updatedRule && updatedRule !== medicationProfile.schedule.recurrenceRule) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: updatedRule } });
    }
  };

  const openFrequencySettingSheet = () => {
    openSheet({
      title: t("medication_screen.details_schedule_freq_sheet_title"),
      content: <FrequencySheet handleUpdateRules={handleUpdateRules} />,
    });
  };

  const color = useThemeColor({}, "textPrimary");
  return (
    <React.Fragment>
      <Pressable style={sharedStyles.card} onPress={openFrequencySettingSheet}>
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>
            {t("medication_screen.details_schedule_freq_label")}
          </Text>
          <ArrowRight color={color} />
        </View>
        <View style={[sharedStyles.cardBody, { alignItems: "flex-start" }]}>
          <AlarmClockIcon color={color} />
          <View style={{ flex: 1 }}>
            <Text style={sharedStyles.cardTextContent}>{ruleToText}</Text>
          </View>
        </View>
      </Pressable>
      <Loader visible={isPending} />
    </React.Fragment>
  );
}

const FrequencySheet = ({
  handleUpdateRules,
}: {
  handleUpdateRules: (updatedRule: string) => void;
}) => {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] = useState<SchedulePreset | undefined>(undefined);
  const [updatedRule, setUpdatedRule] = useState("");

  const occurences = generateScheduleTimes({
    rrule: updatedRule,
  });

  const canUpdate = updatedRule.length > 1;

  const handleSetFrequency = ({
    rrule,
    preset,
  }: {
    rrule: string;
    preset: SchedulePreset | undefined;
  }) => {
    setSelectedPreset(preset);
    setUpdatedRule(rrule);
  };

  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");

  return (
    <View style={{ gap: 32 }}>
      <FrequencySettings onFreqSet={handleSetFrequency} preset={selectedPreset} />
      <View style={styles.scheduleTimeList}>
        {occurences?.map((time, i) => (
          <Text key={time + i} style={[styles.scheduleTime, { backgroundColor: bGColor, color }]}>
            {time}
          </Text>
        ))}
      </View>
      <CustomButton
        label={t("common.apply")}
        onPress={() => handleUpdateRules(updatedRule)}
        disabled={!canUpdate}
        variant={canUpdate ? "filled" : "disabled"}
        textVaraint={canUpdate ? "regularText" : "mutedText"}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
  },
  scheduleTimeList: {
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  scheduleTime: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 12,
  },
});
