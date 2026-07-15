import { QueryKey } from "@/constants/query-keys";
import { cancelEventNotification } from "@/helpers/cancel-schedule-event-notifications";
import { createScheduleEventNotification } from "@/helpers/schedule-new-event-notifications";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfileReponse } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateMedicationProfile {
  isActive: boolean;
  recurrenceRule: string;
  doseQuantity: string;
  note: string;
}

type UpdateMedicationProfileMutation = {
  id: string;
  data: Partial<UpdateMedicationProfile>;
};

const updateMedicationProfileMutation = async ({ id, data }: UpdateMedicationProfileMutation) => {
  const updateData = {
    isActive: data.isActive ?? null,
    recurrenceRule: data.recurrenceRule ?? null,
    doseQuantity: data.doseQuantity ?? null,
    note: data.note ?? null,
  };

  const response = await api.put<MedicationProfileReponse>(`medications/${id}`, updateData);
  return response.data;
};

export default function useUpdateMedicationMutation({
  name,
  onSucceed,
}: {
  name: string;
  onSucceed?: () => void;
}) {
  const { notfication, reminderPreferences } = useAppSettingsStore();
  const { showFeedBack } = useFeedBackStore();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMedicationProfileMutation,
    async onSuccess(incomingData, variables) {
      const { data: variableData, id } = variables;

      queryClient.setQueryData(
        [QueryKey.medicationList],
        (existingData: MedicationProfileReponse[]) => {
          return existingData.map((oldData) =>
            oldData.id === incomingData.id ? incomingData : oldData,
          );
        },
      );

      queryClient.setQueryData([QueryKey.medicationDetails, id], incomingData);

      if (variableData.isActive) {
        await createScheduleEventNotification({ ...notfication, ...reminderPreferences });
      } else if (!variableData.isActive) {
        await cancelEventNotification({ medProfileId: id });
      }
      //  we want to cancel and create when the chaxnge recurrence rule
      if (variableData.recurrenceRule) {
        await createScheduleEventNotification({ ...notfication, ...reminderPreferences });
      }
      if (variableData.doseQuantity) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.medicationPack] });
      }

      await queryClient.invalidateQueries({ queryKey: [QueryKey.scheduleEvents] });
      onSucceed && onSucceed();
      showFeedBack({
        title: "Успешно!",
        message: "Данные о Ваших лекарствах обновлены.",
        status: "success",
      });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: "Ошибка сети!",
            message: "Проверьте подключение к интернету.",
            status: "error",
          });
        } else {
          showFeedBack({
            title: "Ошибка!",
            message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
            status: "error",
          });
        }
      }
      console.log("An error occur when performing update from " + name);
    },
  });

  return {
    mutate,
    isPending,
  };
}
