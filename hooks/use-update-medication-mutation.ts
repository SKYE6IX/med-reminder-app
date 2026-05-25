import { cancelScheduleEventNotifications } from "@/helpers/cancel-schedule-event-notifications";
import { createScheduleEventNotification } from "@/helpers/create-schedule-event-notifications";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfile } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateMedicationProfile {
  isActive: boolean;
  recurrenceRule: string;
  doseQuantity: string;
  note: string;
}

const updateMedicationProfileMutation = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<UpdateMedicationProfile>;
}) => {
  const updateData = {
    isActive: data.isActive ?? null,
    recurrenceRule: data.recurrenceRule ?? null,
    doseQuantity: data.doseQuantity ?? null,
    note: data.note ?? null,
  };

  const response = await api.put<MedicationProfile>(`medications/${id}`, updateData);
  return response.data;
};

export default function useUpdateMedicationMutation() {
  const { notfication, reminderPreferences } = useAppSettingsStore();
  const { showFeedBack } = useFeedBackStore();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMedicationProfileMutation,
    async onSuccess(incomingData, variables) {
      const { data: variableData, id } = variables;

      queryClient.setQueryData(
        ["medication-profile", "list"],
        (existingData: MedicationProfile[]) => {
          return existingData.map((oldData) =>
            oldData.id === incomingData.id ? incomingData : oldData,
          );
        },
      );
      queryClient.setQueryData(["medication-profile", "details", id], incomingData);

      // we want to create again when they turn on
      if (variableData.isActive && variableData.isActive) {
        await createScheduleEventNotification({ ...notfication, ...reminderPreferences });
      } else if (variableData.isActive && !variableData.isActive) {
        // We want to cancel all notification when user turn off
        await cancelScheduleEventNotifications({ medProfileId: id });
      }

      //  we want to cancel and create when the change recurrence rule
      if (variableData.recurrenceRule) {
        await cancelScheduleEventNotifications({ medProfileId: id });
        await createScheduleEventNotification({ ...notfication, ...reminderPreferences });
      }

      await queryClient.invalidateQueries({ queryKey: ["schedule-events"] });
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
  return {
    mutate,
    isPending,
  };
}
