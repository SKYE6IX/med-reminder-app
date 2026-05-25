import { cancelScheduleEventNotifications } from "@/helpers/cancel-schedule-event-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfile } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";

// Delete medication profile mutation
const deleteMedicationProfileMutation = async (id: string) => {
  const response = await api.delete(`medications/${id}`);
  return response;
};

export default function DeleteMedication({ medicationProfileId }: { medicationProfileId: string }) {
  const { showFeedBack } = useFeedBackStore();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const mutedColor = useThemeColor({}, "textMuted");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMedicationProfileMutation,
    async onSuccess(data, variables) {
      queryClient.setQueryData(
        ["medication-profile", "list"],
        (existingData: MedicationProfile[]) =>
          existingData.filter((oldData) => oldData.id !== variables),
      );
      bottomSheetRef.current?.close();
      router.back();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["schedule-events"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-refill-packs"] }),
        cancelScheduleEventNotifications({ medProfileId: medicationProfileId }),
      ]);
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An Axios error occur when try to delete medication -> ", error);
        showFeedBack({
          title: "Ошибка!",
          message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
          status: "error",
        });
      } else {
        console.log("An unknow error occur when try to delete medication -> ", error);
      }
    },
  });

  return (
    <React.Fragment>
      <Loader visible={isPending} />
      <CustomButton
        label="Удалить лекарство"
        variant="danger"
        onPress={() => bottomSheetRef.current?.open()}
      />
      <BottomSheetWrapper
        ref={bottomSheetRef}
        title="Удалить это лекарство?"
        snapPointPercent="30%"
      >
        <View style={styles.deleteActionBox}>
          <Text style={[styles.deleteActionDescription, { color: mutedColor }]}>
            Все данные об этом лекарстве будут удалены.
          </Text>

          <View style={styles.deleteActionBtnWrapper}>
            <CustomButton
              label="Отмена"
              variant="outline"
              textVaraint="mutedText"
              onPress={() => bottomSheetRef.current?.close()}
              style={{ width: "46%" }}
            />
            {/*  */}
            <CustomButton
              label="Удалить"
              variant="danger"
              onPress={() => mutate(medicationProfileId)}
              style={{ width: "46%" }}
            />
          </View>
        </View>
      </BottomSheetWrapper>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  deleteActionBox: {
    gap: 16,
    alignItems: "center",
  },
  deleteActionDescription: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "center",
    width: 300,
  },
  deleteActionBtnWrapper: {
    flexDirection: "row",
    gap: 16,
  },
});
