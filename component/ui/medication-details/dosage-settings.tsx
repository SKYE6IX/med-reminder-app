import ArrowRight from "@/component/icons/arrow-right";
import PillIcon from "@/component/icons/pill-icon";
import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfile } from "@/types/medication";
import React, { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import DosageAmountInput from "../dosage-picker/dosage-amount-input";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfile;
}) {
  const sharedStyles = useSharedStyles();
  const { isPending, mutate } = useUpdateMedicationMutation();
  const showDosageAmountInputRef = useRef<BottomSheetWrapperRef>(null);

  const { schedule } = medicationProfile;

  const handleUpdateDosage = (value: string) => {
    const shouldUpdate = schedule.dosage !== value;

    if (shouldUpdate && value.length > 1) {
      mutate({ id: medicationProfile.id, data: { doseQuantity: value } });
    }
  };

  const color = useThemeColor({}, "textPrimary");

  return (
    <React.Fragment>
      <Pressable
        style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
        onPress={() => showDosageAmountInputRef.current?.open()}
      >
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Доза за прием</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <PillIcon color={color} size={16} />
          <Text style={sharedStyles.cardTextContent}>
            {`${medicationProfile.schedule.dosage} ${getDosageMeasurement(medicationProfile.schedule.measurement)}`}
          </Text>
        </View>
      </Pressable>
      <DosageAmountInput showInputRef={showDosageAmountInputRef} onSetValue={handleUpdateDosage} />
      <Loader visible={isPending} />
    </React.Fragment>
  );
}
