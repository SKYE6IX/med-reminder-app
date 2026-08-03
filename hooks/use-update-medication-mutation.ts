import { QueryKey } from "@/constants/query-keys";
import { cancelMedicationNotifications } from "@/helpers/cancel-medication-notifications";
import { scheduleNewMedicationNotifications } from "@/helpers/schedule-new-event-notifications";
import { useTranslation } from "@/i18next/i18next";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfileReponse } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { getTimeZone } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateMedicationProfile {
  isActive: boolean;
  recurrenceRule: string;
  doseQuantity: string;
  note: string;
  timeZone: string;
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
    timeZone: getTimeZone(),
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
  const { t } = useTranslation();
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
        await scheduleNewMedicationNotifications({ ...notfication, ...reminderPreferences });
      } else if (!variableData.isActive) {
        await cancelMedicationNotifications({ medProfileId: id });
      }
      //  we want to cancel and create when the chaxnge recurrence rule
      if (variableData.recurrenceRule) {
        await scheduleNewMedicationNotifications({ ...notfication, ...reminderPreferences });
      }
      if (variableData.doseQuantity) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.medicationPack] });
      }

      await queryClient.invalidateQueries({ queryKey: [QueryKey.scheduleEvents] });
      onSucceed && onSucceed();
      showFeedBack({
        title: t("feedback.success.update_medication.title"),
        message: t("feedback.success.update_medication.text"),
        status: "success",
      });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else {
          showFeedBack({
            title: t("feedback.error.general.title"),
            message: t("feedback.error.general.text"),
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
