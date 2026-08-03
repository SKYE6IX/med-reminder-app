import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import LineChartIcon from "@/component/icons/line-chart-icon";
import { QueryKey } from "@/constants/query-keys";
import { getDosageMeasurementLabelKey } from "@/helpers/get-dosage-measurement";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, MedicationProfileReponse } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { getTimeZone } from "@/utils/luxonUtil";
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
  medicationProfile: MedicationProfileReponse;
  closeSheet: () => void;
};

const addMedicationPackMutation = async (body: MedicationPackCreation) => {
  const response = await api.post<AddMedicationPackReponse>("medications/packs", body);
  return response.data;
};

export default function StockDosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileReponse;
}) {
  const { t } = useTranslation();
  const { openSheet, closeSheet } = useBottomSheet();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const sharedStyles = useSharedStyles();

  const openAddMedicationPack = () => {
    if (isPremiumPlan) {
      openSheet({
        title: t("medication_screen.details_dosage_reserve_sheet_title"),
        content: (
          <AddMedicationPackSheet medicationProfile={medicationProfile} closeSheet={closeSheet} />
        ),
      });
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const labelKey = getDosageMeasurementLabelKey(medicationProfile.schedule.measurement);

  const color = useThemeColor({}, "textPrimary");
  return (
    <React.Fragment>
      {medicationProfile.pack ? (
        <View style={[sharedStyles.card, sharedStyles.detailsGroupItem]}>
          <View style={sharedStyles.cardHeader}>
            <Text style={[sharedStyles.cardTitle]}>
              {t("medication_screen.details_dosage_reserve_title")}
            </Text>
          </View>
          <View style={sharedStyles.cardBody}>
            <LineChartIcon color={color} />
            <Text style={[sharedStyles.cardTextContent, { color }]}>
              {medicationProfile.pack.totalAmountInPack} {/*  @ts-ignore */}{" "}
              {t(`common.dosage_measuremnet.${labelKey}`)}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable
          style={[sharedStyles.card, sharedStyles.detailsGroupItem]}
          onPress={openAddMedicationPack}
        >
          <View style={sharedStyles.cardHeader}>
            <Text style={[sharedStyles.cardTitle]}>
              {t("medication_screen.details_dosage_reserve_title")}
            </Text>
            <ArrowRight color={color} />
          </View>
          <View style={sharedStyles.cardBody}>
            <Text style={[sharedStyles.cardTextContent, { color }]}>
              {t("medication_screen.details_dosage_reserve_add")}
            </Text>
          </View>
        </Pressable>
      )}

      {/* SUBSCRIPTION OFFER */}
      <SubscriptionBanner ref={openBannerRef} />
    </React.Fragment>
  );
}

const AddMedicationPackSheet = ({ medicationProfile, closeSheet }: AddMedicationPackSheetProps) => {
  const { t } = useTranslation();
  const { showFeedBack } = useFeedBackStore();

  const [medicationPack, setMedicationPack] = useState<MedicationPackCreation>({
    medicationProfileId: medicationProfile.id,
    totalQuantity: "",
    reminderDays: 0,
    timeZone: getTimeZone(),
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
        queryClient.invalidateQueries({
          queryKey: [QueryKey.medicationDetails, medicationProfile.id],
        }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.medicationList] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.medicationPack] }),
      ]);
      showFeedBack({
        title: t("feedback.success.reserve_setup.title"),
        message: t("feedback.success.reserve_setup.text"),
        status: "success",
      });
      closeSheet();
      setMedicationPack((prv) => ({ ...prv, totalQuantity: "", reminderDays: 0 }));
    },
    onError() {
      showFeedBack({
        title: t("feedback.error.general.title"),
        message: t("feedback.error.general.text"),
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
        title: t("feedback.error.reserve_setup.title"),
        message: t("feedback.error.reserve_setup.text"),
        status: "error",
      });
      return;
    }
    mutate(medicationPack);
  };

  const color = useThemeColor({}, "textPrimary");
  return (
    <ScrollView contentContainerStyle={styles.bottomSheetContainer}>
      <Text style={[styles.bottomSheetText, { color }]}>
        {t("medication_screen.details_dosage_reserve_sheet_heading")}
      </Text>
      <MedicationPackPicker
        amountInPack={medicationPack.totalQuantity}
        refillDaysReminder={reminderDays}
        onAmountInPackSet={handleAmountInPackSet}
        onRefillDaysReminderSet={handleRefillDaysSet}
        measurementValue={medicationProfile.schedule.measurement}
      />
      <CustomButton
        label={t("common.add")}
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
