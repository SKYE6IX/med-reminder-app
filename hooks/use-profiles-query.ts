import { QueryKey } from "@/constants/query-keys";
import { ProfileResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchProfiles = async () => {
  const response = await api.get<ProfileResponse[]>("users/profiles");
  return response.data;
};

export function useProfilesQuery() {
  const { data, error, isLoading } = useQuery({
    queryKey: [QueryKey.profiles],
    queryFn: fetchProfiles,
    staleTime: 60 * 60 * 1000,
  });

  const selfProfile = data?.find((p) => p.isSelf);

  const relationProfiles = data?.filter((p) => !p.isSelf);

  return {
    selfProfile,
    relationProfiles: relationProfiles ?? [],
    loading: isLoading,
    error,
  };
}
