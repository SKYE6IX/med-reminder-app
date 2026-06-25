import { useBottomSheet } from "@/component/bottom-sheet-provider";
import RefillCard from "@/component/ui/cards/refill-card";
import CustomButton from "@/component/ui/custom-button/custom-button";
import MedicationPackPicker from "@/component/ui/medication-pack-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, RefillMedicationPack } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface RefillMedicationPackForm extends MedicationPackCreation {
  medicationPackId: string;
}

const fetchRefillMedicationPacks = async () => {
  const response = await api.get<RefillMedicationPack[]>("medications/packs/refill");
  return response.data;
};

const refillMedicationPackMutation = async (body: RefillMedicationPackForm) => {
  const response = await api.post<RefillMedicationPack>("medications/packs/refill", body);
  return response.data;
};

export default function RefillPill() {
  const inset = useSafeAreaInsets();

  const { openSheet, closeSheet } = useBottomSheet();

  // Query Data
  const { data, isLoading } = useQuery({
    queryKey: ["medication-refill-packs"],
    queryFn: fetchRefillMedicationPacks,
  });

  const isPacksAvailable = data && data.length >= 1;

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Text style={[styles.headerTitle, { color }]}>Пополнение лекарств</Text>
      {/* <Loader visible={isLoading || isPending} /> */}
      {!isLoading && (
        <>
          {isPacksAvailable ? (
            <FlatList
              style={{ flex: 1 }}
              data={data}
              renderItem={({ item }) => (
                <RefillCard
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
          ) : (
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
        </>
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
  const inset = useSafeAreaInsets();

  const isAndroid = Platform.OS === "android";
  const BOTTOM_SHEET_HEADER_HIEGHT = 24;
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  // Bottom sheet height calculations
  const bottom = isAndroid ? inset.bottom * 2 : inset.bottom;
  const contentHeight = SCREEN_HEIGHT - (BOTTOM_SHEET_HEADER_HIEGHT + inset.top + bottom + 20 * 2);

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
      queryClient.setQueryData(
        ["medication-refill-packs"],
        (existingPacks: RefillMedicationPack[]) => {
          const filterPacks = existingPacks.filter(
            (pack) => pack.id !== variables.medicationPackId,
          );
          return [...filterPacks, data];
        },
      );

      await Promise.all([
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
    <View style={[styles.bottomSheetContainer, { height: contentHeight }]}>
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
        style={{ marginTop: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    paddingBottom: 16,
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
    gap: 16,
  },
  bottomSheetText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
});
