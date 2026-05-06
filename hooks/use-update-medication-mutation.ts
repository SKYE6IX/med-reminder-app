import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfileResponse } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateMedicationProfile {
  isActive: boolean;
  recurrenceRule: string;
  doseQuantity: number;
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
  const response = await api.put<MedicationProfileResponse>(`medications/${id}`, updateData);
  return response.data;
};

export default function useUpdateMedicationMutation() {
  const { showFeedBack } = useFeedBackStore();
  const { mutate, isPending } = useMutation({
    mutationFn: updateMedicationProfileMutation,
    async onSuccess(data, variables) {
      queryClient.setQueryData(
        ["medication-profile", "list"],
        (existingData: MedicationProfileResponse[]) => {
          return existingData.map((oldData) => (oldData.id === data.id ? data : oldData));
        },
      );

      queryClient.setQueryData(["medication-profile", "details", variables.id], data);
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
