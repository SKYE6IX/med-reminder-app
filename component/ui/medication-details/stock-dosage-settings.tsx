import ArrowRight from "@/component/icons/arrow-right";
import LineChartIcon from "@/component/icons/line-chart-icon";
import { MEDICATION_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, MedicationProfile } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";
import MedicationPackPicker from "../medication-pack-picker";
import { useSharedStyles } from "./use-shared-styles";

interface AddMedicationPackReponse {
  amountInPack: string;
}

const addMedicationPackMutation = async (body: MedicationPackCreation) => {
  const response = await api.post<AddMedicationPackReponse>("medications/packs", body);
  return response.data;
};

export default function StockDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfile;
}) {
  const { showFeedBack } = useFeedBackStore();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const [medicationPack, setMedicationPack] = useState<MedicationPackCreation>({
    medicationProfileId: medicationProfile.id,
    totalQuantity: "",
    reminderDays: 0,
  });

  const isAmountInPackAvailable = Number(medicationProfile.amountInPack) >= 1;
  const amountInPack = medicationPack.totalQuantity ? `${medicationPack.totalQuantity}` : "";
  const reminderDays = medicationPack.reminderDays ? `${medicationPack.reminderDays}` : "";

  const canContinue = useMemo(
    () => Boolean(medicationPack.totalQuantity) && Boolean(medicationPack.reminderDays),
    [medicationPack.reminderDays, medicationPack.totalQuantity],
  );

  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");

  const handleAmountInPackSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, totalQuantity: selectedValue }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, reminderDays: Number(selectedValue) }));
  };

  const unitLabel = () => {
    return MEDICATION_UNITS.find((item) => item.value === medicationProfile.medicationUnit)?.name;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: addMedicationPackMutation,
    async onSuccess(data, variables) {
      queryClient.setQueryData(
        ["medication-profile", "details", variables.medicationProfileId],
        (existingData: MedicationProfile) => ({
          ...existingData,
          amountInPack: data.amountInPack,
        }),
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["medication-profile", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-refill-packs"] }),
      ]);

      showFeedBack({
        title: "Успешно",
        message: "Пополнение добавлено в напоминание.",
        status: "success",
      });

      bottomSheetRef.current?.close();
      setMedicationPack((prv) => ({ ...prv, totalQuantity: "", reminderDays: 0 }));
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when updating medication profile -> ", error);
      } else {
        console.log("An Unknown error occur when updating medication profile -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const handleAddMedicationPack = () => {
    mutate(medicationPack);
  };

  return (
    <React.Fragment>
      {isAmountInPackAvailable ? (
        <View style={[sharedStyles.card, sharedStyles.detailsGroupItem]}>
          <View style={sharedStyles.cardHeader}>
            <Text style={[sharedStyles.cardTitle]}>Запас</Text>
          </View>
          <View style={sharedStyles.cardBody}>
            <LineChartIcon color={color} />
            <Text style={[sharedStyles.cardTextContent, { color }]}>
              {medicationProfile.amountInPack} {unitLabel()}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable
          style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
          onPress={() => bottomSheetRef.current?.open()}
        >
          <View style={sharedStyles.cardHeader}>
            <Text style={[sharedStyles.cardTitle]}>Запас</Text>
            <ArrowRight color={color} />
          </View>
          <View style={sharedStyles.cardBody}>
            <Text style={[sharedStyles.cardTextContent, { color }]}>Добавить</Text>
          </View>
        </Pressable>
      )}

      <Loader visible={isPending} />
      <BottomSheetWrapper ref={bottomSheetRef} title="Напоминание о пополнении">
        <View style={styles.bottomSheetContainer}>
          <Text style={[styles.bottomSheetText, { color }]}>Уведомить до окончания запаса</Text>
          <MedicationPackPicker
            amountInPack={amountInPack}
            refillDaysReminder={reminderDays}
            onAmountInPackSet={handleAmountInPackSet}
            onRefillDaysReminderSet={handleRefillDaysSet}
          />
          <CustomButton
            label="Добавить"
            disabled={!canContinue || isPending}
            variant={canContinue ? "filled" : "disabled"}
            textVaraint={canContinue ? "regularText" : "mutedText"}
            onPress={handleAddMedicationPack}
          />
        </View>
      </BottomSheetWrapper>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    gap: 16,
  },
  bottomSheetText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
