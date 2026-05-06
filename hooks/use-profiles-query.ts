import { ProfileResponse } from "@/types/user";
import { api, AxiosError } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchProfiles = async () => {
  const response = await api.get("users/profiles");
  return response.data;
};

export function useProfilesQuery() {
  const { data, error, isLoading } = useQuery<ProfileResponse[], AxiosError>({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 60 * 60 * 1000,
  });

  return {
    profiles: data ?? [],
    loading: isLoading,
    error,
  };
}
