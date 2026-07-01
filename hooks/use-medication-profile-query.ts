import { MedicationProfileReponse } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// Fetch query
const fetchMedicationProfiles = async () => {
  const response = await api.get<MedicationProfileReponse[]>("medications");
  return response.data;
};

export function useMedicationProfileQuery() {
  // Query data list
  const { data, isLoading } = useQuery({
    queryKey: ["medication-profile", "list"],
    queryFn: fetchMedicationProfiles,
    staleTime: 60 * 60 * 1000,
  });

  const count = data?.length ?? 0;

  return {
    isLoading,
    count,
    data,
  };
}
