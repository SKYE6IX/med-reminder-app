import { useBottomSheet } from "@/component/bottom-sheet-provider";
import { QueryKey } from "@/constants/query-keys";
import { cancelEventNotification } from "@/helpers/cancel-schedule-event-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfileReponse } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";

// Delete medication profile mutation
const deleteMedicationProfileMutation = async (id: string) => {
  const response = await api.delete(`medications/${id}`);
  return response;
};

export default function DeleteMedication({ medicationProfileId }: { medicationProfileId: string }) {
  const { openSheet, closeSheet } = useBottomSheet();
  const { showFeedBack } = useFeedBackStore();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteMedicationProfileMutation,
    async onSuccess(data, variables) {
      queryClient.setQueryData(
        [QueryKey.medicationList],
        (existingData: MedicationProfileReponse[]) =>
          existingData.filter((oldData) => oldData.id !== variables),
      );
      closeSheet();
      router.back();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.scheduleEvents] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.medicationPack] }),
        cancelEventNotification({ medProfileId: medicationProfileId }),
      ]);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
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

  const handleDeleteAction = () => {
    mutate(medicationProfileId);
  };

  const snapPoint = Platform.OS === "android" ? "35%" : "30%";

  const openDeleteMedicationSheet = () => {
    openSheet({
      title: "Удалить это лекарство?",
      snapPointPercent: snapPoint,
      content: <DeleteMedicationSheet deleteAction={handleDeleteAction} closeSheet={closeSheet} />,
    });
  };

  return (
    <React.Fragment>
      <Loader visible={isPending} />
      <CustomButton
        label="Удалить лекарство"
        variant="danger"
        onPress={openDeleteMedicationSheet}
      />
    </React.Fragment>
  );
}

const DeleteMedicationSheet = ({
  deleteAction,
  closeSheet,
}: {
  deleteAction: () => void;
  closeSheet: () => void;
}) => {
  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <View style={styles.deleteActionBox}>
      <Text style={[styles.deleteActionDescription, { color: mutedColor }]}>
        Все данные об этом лекарстве будут удалены.
      </Text>
      <View style={styles.deleteActionBtnWrapper}>
        <CustomButton
          label="Отмена"
          variant="outline"
          textVaraint="tintText"
          onPress={closeSheet}
          style={{ width: "46%" }}
        />
        <CustomButton
          label="Удалить"
          variant="danger"
          onPress={deleteAction}
          style={{ width: "46%" }}
        />
      </View>
    </View>
  );
};

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
