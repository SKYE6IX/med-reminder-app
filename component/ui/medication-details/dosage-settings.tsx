import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import PillIcon from "@/component/icons/pill-icon";
import { getDosageMeasurementLabelKey } from "@/helpers/get-dosage-measurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { useTranslation } from "@/i18next/i18next";
import { MedicationProfileReponse } from "@/types/medication";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DosageAmountInput from "../dosage-picker/dosage-amount-input";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileReponse;
}) {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

  const { openSheet, closeSheet } = useBottomSheet();
  const { isPending, mutate } = useUpdateMedicationMutation({ name: "UPDATE DOSAGE" });

  const handleUpdateDosage = (value: string) => {
    const shouldUpdate = medicationProfile.schedule.dosage !== value;
    if (shouldUpdate && value.length >= 1) {
      mutate({ id: medicationProfile.id, data: { doseQuantity: value } });
    }
  };

  const snapPoint = Platform.OS === "android" ? "50%" : "45%";

  const openDosageSettingSheet = () => {
    openSheet({
      title: t("common.dose_amount_picker_title"),
      snapPointPercent: snapPoint,
      content: (
        <DosageAmountInput
          measurementValue={medicationProfile.schedule.measurement}
          onSetValue={handleUpdateDosage}
          closeSheet={closeSheet}
        />
      ),
    });
  };
  const color = useThemeColor({}, "textPrimary");
  return (
    <React.Fragment>
      <Pressable
        style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
        onPress={openDosageSettingSheet}
      >
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>
            {t("medication_screen.details_dosage_amount_title")}
          </Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <PillIcon color={color} size={16} />
          <Text style={sharedStyles.cardTextContent}>
            {/* @ts-ignore */}
            {`${medicationProfile.schedule.dosage} ${t(`common.dosage_measuremnet.${getDosageMeasurementLabelKey(medicationProfile.schedule.measurement)}`)}`}
          </Text>
        </View>
      </Pressable>
      <Loader visible={isPending} />
    </React.Fragment>
  );
}
