import { useBottomSheet } from "@/component/bottom-sheet-provider";
import MedicationPackCard from "@/component/ui/cards/medication-pack-card";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import MedicationPackPicker from "@/component/ui/medication-pack-picker";
import Tabs from "@/component/ui/tabs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, MedicationPackResponse } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TABS_VALUE = "ACTIVE" | "PENDING" | "COMPLETED";

interface RefillMedicationPackForm extends MedicationPackCreation {
  medicationPackId: string;
}

const fetchMedicationPacks = async () => {
  const response = await api.get<MedicationPackResponse[]>("medications/packs");
  return response.data;
};

const refillMedicationPackMutation = async (body: RefillMedicationPackForm) => {
  const response = await api.post<MedicationPackResponse>("medications/packs/refill", body);
  return response.data;
};

const TABS = [
  { label: "Принимаете", value: "ACTIVE" },
  { label: "На очереди", value: "PENDING" },
  { label: "Закончилось", value: "COMPLETED" },
];

export default function MedicationPacks() {
  const inset = useSafeAreaInsets();

  const { openSheet, closeSheet } = useBottomSheet();
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ACTIVE");

  // Query Data
  const { data, isLoading } = useQuery({
    queryKey: ["medication-packs"],
    queryFn: fetchMedicationPacks,
  });

  const filterPacks = useMemo(() => {
    return data?.filter((pack) => pack.status === activeTab);
  }, [activeTab, data]);

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const openAddMedicationPackSheet = ({
    medicationPackId,
    medicationProfileId,
    measurementValue,
  }: {
    medicationPackId: string;
    medicationProfileId: string;
    measurementValue: string;
  }) => {
    openSheet({
      title: "Напоминание о пополнении",
      content: (
        <AddMedicationPackPickerSheet
          key={medicationPackId}
          medicationPackId={medicationPackId}
          medicationProfileId={medicationProfileId}
          measurementValue={measurementValue}
          closeSheet={closeSheet}
        />
      ),
    });
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const top = Platform.OS === "android" ? 10 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }} edges={["top"]}>
      <Text style={[styles.headerTitle, { color }]}>Пополнение лекарств</Text>
      <Loader visible={isLoading} />
      {!isLoading && data && data.length >= 1 && (
        <React.Fragment>
          <View style={styles.tabsWrapper}>
            <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={filterPacks}
            renderItem={({ item }) => (
              <MedicationPackCard
                key={item.id}
                pack={item}
                onRefillButtonPress={() =>
                  openAddMedicationPackSheet({
                    medicationPackId: item.id,
                    medicationProfileId: item.medicationProfileId,
                    measurementValue: item.dosageMeasurement,
                  })
                }
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: inset.bottom + 10 },
            ]}
          />
        </React.Fragment>
      )}
      {!isLoading && data && data.length <= 0 && (
        <View style={styles.noContentWrapper}>
          <Image
            source={require("@/assets/images/pill-bottle.png")}
            style={styles.noContentImage}
          />
          <Text style={[styles.noContentTitle, { color }]}>Ваши запасы лекарств</Text>
          <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
            Здесь появятся запасы и напоминания о пополнении.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const AddMedicationPackPickerSheet = ({
  medicationPackId,
  medicationProfileId,
  measurementValue,
  closeSheet,
}: {
  medicationPackId: string;
  medicationProfileId: string;
  measurementValue: string;
  closeSheet: () => void;
}) => {
  const { showFeedBack } = useFeedBackStore();

  const [medicationPack, setMedicationPack] = useState<RefillMedicationPackForm>({
    medicationPackId,
    medicationProfileId,
    totalQuantity: "",
    reminderDays: 0,
  });

  const amountInPack = medicationPack.totalQuantity ? `${medicationPack.totalQuantity}` : "";
  const reminderDays = medicationPack.reminderDays ? `${medicationPack.reminderDays}` : "";

  const canContinue = useMemo(
    () => Boolean(medicationPack.totalQuantity) && Boolean(medicationPack.reminderDays),
    [medicationPack.reminderDays, medicationPack.totalQuantity],
  );

  const { isPending, mutate } = useMutation({
    mutationFn: refillMedicationPackMutation,
    async onSuccess(data, variables) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["medication-packs"] }),
        queryClient.invalidateQueries({
          queryKey: ["medication-profile", "details", variables.medicationProfileId],
        }),
        queryClient.invalidateQueries({ queryKey: ["medication-profile", "list"] }),
      ]);
      showFeedBack({
        title: "Успешно",
        message: "Пополнение добавлено в напоминание.",
        status: "success",
      });
      closeSheet();
      setMedicationPack((prv) => ({ ...prv, totalQuantity: "", reminderDays: 0 }));
    },

    onError(error) {
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const handleAmountInPackSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, totalQuantity: selectedValue }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, reminderDays: Number(selectedValue) }));
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  return (
    <ScrollView>
      <Loader visible={isPending} />

      <View style={styles.bottomSheetContainer}>
        <Text style={[styles.bottomSheetText, { color }]}>Уведомить до окончания запаса</Text>
        <MedicationPackPicker
          amountInPack={amountInPack}
          refillDaysReminder={reminderDays}
          onAmountInPackSet={handleAmountInPackSet}
          onRefillDaysReminderSet={handleRefillDaysSet}
          measurementValue={measurementValue}
        />

        <CustomButton
          label="Добавить"
          disabled={!canContinue || isPending}
          variant={canContinue ? "filled" : "disabled"}
          textVaraint={canContinue ? "regularText" : "mutedText"}
          onPress={() => mutate(medicationPack)}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },

  noContentWrapper: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentImage: {
    width: 160,
    height: 160,
  },
  noContentTitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  noContentSubtitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  bottomSheetContainer: {
    gap: 32,
  },
  bottomSheetText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
