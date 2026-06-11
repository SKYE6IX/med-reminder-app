import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import RefillCard from "@/component/ui/cards/refill-card";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import MedicationPackPicker from "@/component/ui/medication-pack-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationPackCreation, RefillMedicationPack } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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
  const { showFeedBack } = useFeedBackStore();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const [medicationPack, setMedicationPack] = useState<RefillMedicationPackForm>({
    medicationPackId: "",
    medicationProfileId: "",
    totalQuantity: "",
    reminderDays: 0,
  });

  const amountInPack = medicationPack.totalQuantity ? `${medicationPack.totalQuantity}` : "";
  const reminderDays = medicationPack.reminderDays ? `${medicationPack.reminderDays}` : "";

  const canContinue = useMemo(
    () => Boolean(medicationPack.totalQuantity) && Boolean(medicationPack.reminderDays),
    [medicationPack.reminderDays, medicationPack.totalQuantity],
  );

  // Query Data
  const { data, isLoading } = useQuery({
    queryKey: ["medication-refill-packs"],
    queryFn: fetchRefillMedicationPacks,
  });

  const isPacksAvailable = data && data.length >= 1;

  const handleAmountInPackSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, totalQuantity: selectedValue }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationPack((prv) => ({ ...prv, reminderDays: Number(selectedValue) }));
  };

  const handleOpenBottomSheet = ({
    medicationPackId,
    medicationProfileId,
  }: {
    medicationPackId: string;
    medicationProfileId: string;
  }) => {
    setMedicationPack((prv) => ({ ...prv, medicationPackId, medicationProfileId }));
    bottomSheetRef.current?.open();
  };

  const { isPending, mutate } = useMutation({
    mutationFn: refillMedicationPackMutation,
    async onSuccess(data, variables) {
      // Remove the refill pack from cache and add the newly added one there;
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

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Text style={[styles.headerTitle, { color }]}>Пополнение лекарств</Text>
      <Loader visible={isLoading || isPending} />
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
                    handleOpenBottomSheet({
                      medicationPackId: item.id,
                      medicationProfileId: item.medicationProfileId,
                    })
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.listContentContainer,
                { paddingBottom: insets.bottom + 10 },
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

      {/* Refill Bottom Sheet */}
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
            onPress={() => mutate(medicationPack)}
          />
        </View>
      </BottomSheetWrapper>
    </SafeAreaView>
  );
}

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
