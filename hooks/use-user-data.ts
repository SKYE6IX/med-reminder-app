import { QueryKey } from "@/constants/query-keys";
import { UserResponse } from "@/types/user";
import { api, AxiosError } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useUserQuery = () => {
  const { data } = useQuery<UserResponse, AxiosError>({
    queryKey: [QueryKey.users],
    queryFn: async () => {
      const resposne = await api.get<UserResponse>("users");
      return resposne.data;
    },
  });
  return { user: data };
};
