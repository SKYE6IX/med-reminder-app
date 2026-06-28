import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import LineChartIcon from "@/component/icons/line-chart-icon";
import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, MedicationProfile } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";
import MedicationPackPicker from "../medication-pack-picker";
import SubscriptionBanner, { SubscriptionBannerRef } from "../subscription-banner";
import { useSharedStyles } from "./use-shared-styles";

interface AddMedicationPackReponse {
  amountInPack: string;
}

type AddMedicationPackSheetProps = {
  medicationProfile: MedicationProfile;
  closeSheet: () => void;
};

const addMedicationPackMutation = async (body: MedicationPackCreation) => {
  const response = await api.post<AddMedicationPackReponse>("medications/packs", body);
  return response.data;
};

export default function StockDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfile;
}) {
  const { openSheet, closeSheet } = useBottomSheet();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const isAmountInPackAvailable = Number(medicationProfile.pack?.totalAmountInPack) >= 1;

  const sharedStyles = useSharedStyles();

  const openAddMedicationPack = () => {
    if (isPremiumPlan) {
      openSheet({
        title: "Напоминание о пополнении",
        content: (
          <AddMedicationPackSheet medicationProfile={medicationProfile} closeSheet={closeSheet} />
        ),
      });
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const color = useThemeColor({}, "textPrimary");
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
              {medicationProfile.pack?.totalAmountInPack}{" "}
              {getDosageMeasurement(medicationProfile.schedule.measurement)}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable
          style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
          onPress={openAddMedicationPack}
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

      {/* SUBSCRIPTION OFFER */}
      <SubscriptionBanner ref={openBannerRef} />
    </React.Fragment>
  );
}

const AddMedicationPackSheet = ({ medicationProfile, closeSheet }: AddMedicationPackSheetProps) => {
  const { showFeedBack } = useFeedBackStore();

  const [medicationPack, setMedicationPack] = useState<MedicationPackCreation>({
    medicationProfileId: medicationProfile.id,
    totalQuantity: "",
    reminderDays: 0,
  });

  const reminderDays = medicationPack.reminderDays ? `${medicationPack.reminderDays}` : "";

  const canContinue = useMemo(
    () => Boolean(medicationPack.totalQuantity) && Boolean(medicationPack.reminderDays),
    [medicationPack.reminderDays, medicationPack.totalQuantity],
  );

  const handleAmountInPackSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, totalQuantity: selectedValue }));
  };
  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, reminderDays: Number(selectedValue) }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: addMedicationPackMutation,
    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["medication-profile", "details"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-profile", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-refill-packs"] }),
      ]);

      showFeedBack({
        title: "Успешно",
        message: "Пополнение добавлено в напоминание.",
        status: "success",
      });

      closeSheet();
      setMedicationPack((prv) => ({ ...prv, totalQuantity: "", reminderDays: 0 }));
    },

    onError() {
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const handleAddMedicationPackMutation = () => {
    if (
      medicationPack.reminderDays <= 0 ||
      Number(medicationPack.totalQuantity) <= Number(medicationProfile.schedule.dosage)
    ) {
      showFeedBack({
        title: "Неверный ввод",
        message: "Пожалуйста, введите все данные о вашей упаковке с лекарствами.",
        status: "error",
      });
      return;
    }

    mutate(medicationPack);
  };

  const color = useThemeColor({}, "textPrimary");

  return (
    <ScrollView contentContainerStyle={styles.bottomSheetContainer}>
      <Text style={[styles.bottomSheetText, { color }]}>Уведомить до окончания запаса</Text>
      <MedicationPackPicker
        amountInPack={medicationPack.totalQuantity}
        refillDaysReminder={reminderDays}
        onAmountInPackSet={handleAmountInPackSet}
        onRefillDaysReminderSet={handleRefillDaysSet}
        measurementValue={medicationProfile.schedule.measurement}
      />

      <CustomButton
        label="Добавить"
        disabled={!canContinue || isPending}
        variant={canContinue ? "filled" : "disabled"}
        textVaraint={canContinue ? "regularText" : "mutedText"}
        onPress={handleAddMedicationPackMutation}
        style={{ marginTop: 32 }}
      />

      <Loader visible={isPending} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    gap: 32,
  },

  bottomSheetText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
