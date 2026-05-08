import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import ArrowRight from "@/component/icons/arrow-right";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { SchedulePreset } from "@/stores/add-pill-store";
import { MedicationProfileResponse } from "@/types/medication";
import { formatRRuleToRussian } from "@/utils/rruleUtils";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import FrequencySettings from "../frequency-settings";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsFrequencySettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const { isPending, mutate } = useUpdateMedicationMutation();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const [selectedPreset, setSelectedPreset] = useState<SchedulePreset | undefined>(undefined);
  const [updatedRule, setUpdatedRule] = useState("");

  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");

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

  const handleUpdateRules = () => {
    bottomSheetRef.current?.close();
    if (updatedRule && updatedRule !== medicationProfile.schedule.recurrenceRule) {
      mutate({ id: medicationProfile.id, data: { recurrenceRule: updatedRule } });
    }
  };

  const ruleToText = formatRRuleToRussian(medicationProfile.schedule.recurrenceRule);

  return (
    <React.Fragment>
      <Pressable style={sharedStyles.card} onPress={() => bottomSheetRef.current?.open()}>
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Частота приема</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <AlarmClockIcon color={color} />
          <Text style={sharedStyles.cardTextContent}>{ruleToText}</Text>
        </View>
      </Pressable>

      <BottomSheetWrapper ref={bottomSheetRef} title="Изменить частоту">
        <View style={{ gap: 16 }}>
          <FrequencySettings onFreqSet={handleSetFrequency} preset={selectedPreset} />
          <CustomButton
            label="Применить"
            onPress={handleUpdateRules}
            disabled={!canUpdate}
            variant={canUpdate ? "filled" : "disabled"}
            textVaraint={canUpdate ? "regularText" : "mutedText"}
          />
        </View>
      </BottomSheetWrapper>
      <Loader visible={isPending} />
    </React.Fragment>
  );
}
