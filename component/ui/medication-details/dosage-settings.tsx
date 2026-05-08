import ArrowRight from "@/component/icons/arrow-right";
import PillIcon from "@/component/icons/pill-icon";
import { getDosageUnit } from "@/helpers/getDosageUnit";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { DosageMeasurement, MedicationProfileResponse } from "@/types/medication";
import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import DosageSettings from "../dosage-settings";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const { isPending, mutate } = useUpdateMedicationMutation();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const [dosageState, setDosageState] = useState({
    amount: medicationProfile.schedule.dosage,
    unit: medicationProfile.schedule.measurement,
  });

  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  const { schedule } = medicationProfile;

  const shouldUpdate =
    dosageState.amount !== schedule.dosage ||
    dosageState.unit.toUpperCase() !== schedule.measurement.toUpperCase();

  // Dosage setting
  const handleOnDosageSettingChange = ({
    amount,
    unit,
  }: Partial<{ amount: number; unit: DosageMeasurement }>) => {
    if (amount) {
      setDosageState((prv) => ({ ...prv, amount }));
    }
  };

  const habdleUpdateDosage = () => {
    mutate({ id: medicationProfile.id, data: { doseQuantity: dosageState.amount } });
    bottomSheetRef.current?.close();
  };

  return (
    <React.Fragment>
      <Pressable
        style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
        onPress={() => bottomSheetRef.current?.open()}
      >
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Доза за прием</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <PillIcon color={color} size={16} />
          <Text style={sharedStyles.cardTextContent}>
            {`${medicationProfile.schedule.dosage} ${getDosageUnit(medicationProfile.schedule.measurement)}`}
          </Text>
        </View>
      </Pressable>

      <BottomSheetWrapper ref={bottomSheetRef} title="Изменить дозировку" snapPointPercent="40%">
        <View style={{ gap: 16 }}>
          <DosageSettings
            dosageAmountState={dosageState.amount}
            dosageUnitState={dosageState.unit}
            onDasgeSettingsChange={handleOnDosageSettingChange}
            showUnitForm={false}
          />
          <CustomButton
            label="Применить"
            onPress={habdleUpdateDosage}
            disabled={!shouldUpdate}
            variant={shouldUpdate ? "filled" : "disabled"}
            textVaraint={shouldUpdate ? "regularText" : "mutedText"}
          />
        </View>
      </BottomSheetWrapper>
      <Loader visible={isPending} />
    </React.Fragment>
  );
}
