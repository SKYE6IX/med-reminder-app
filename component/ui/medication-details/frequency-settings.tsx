import { useBottomSheet } from "@/component/bottom-sheet-provider";
import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import ArrowRight from "@/component/icons/arrow-right";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { SchedulePreset } from "@/stores/add-pill-store";
import { MedicationProfile } from "@/types/medication";
import { formatRRuleToRussian, generateTimeOccurrences } from "@/utils/rruleUtils";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "../custom-button/custom-button";
import FrequencySettings from "../frequency-settings";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsFrequencySettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfile;
}) {
  const sharedStyles = useSharedStyles();
  const { openSheet, closeSheet } = useBottomSheet();

  const { isPending, mutate } = useUpdateMedicationMutation();
  const ruleToText = formatRRuleToRussian(medicationProfile.schedule.recurrenceRule);

  const handleUpdateRules = (updatedRule: string) => {
    closeSheet();
    if (updatedRule && updatedRule !== medicationProfile.schedule.recurrenceRule) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: updatedRule } });
    }
  };
  const openFrequencySettingSheet = () => {
    openSheet({
      title: "Изменить частоту",
      content: <FrequencySheet handleUpdateRules={handleUpdateRules} />,
    });
  };

  const color = useThemeColor({}, "textPrimary");
  return (
    <React.Fragment>
      <Pressable style={sharedStyles.card} onPress={openFrequencySettingSheet}>
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Частота приема</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <AlarmClockIcon color={color} />
          <Text style={sharedStyles.cardTextContent}>{ruleToText}</Text>
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
  const inset = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const BOTTOM_SHEET_HEADER_HIEGHT = 24;
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const bottom = isAndroid ? inset.bottom * 2 : inset.bottom;
  const contentHeight = SCREEN_HEIGHT - (BOTTOM_SHEET_HEADER_HIEGHT + inset.top + bottom + 20 * 2);

  const [selectedPreset, setSelectedPreset] = useState<SchedulePreset | undefined>(undefined);
  const [updatedRule, setUpdatedRule] = useState("");

  const occurences = generateTimeOccurrences({
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
    <View style={{ gap: 16, height: contentHeight }}>
      <FrequencySettings onFreqSet={handleSetFrequency} preset={selectedPreset} />
      <View style={styles.scheduleTimeList}>
        {occurences?.map((time, i) => (
          <Text key={time + i} style={[styles.scheduleTime, { backgroundColor: bGColor, color }]}>
            {time}
          </Text>
        ))}
      </View>
      <CustomButton
        label="Применить"
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
