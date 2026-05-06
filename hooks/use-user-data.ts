import { UserResponse } from "@/types/user";
import { api, AxiosError } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useUserData = () => {
  const { data } = useQuery<UserResponse, AxiosError>({
    queryKey: ["users"],
    queryFn: async () => {
      const resposne = await api.get<UserResponse>("users");
      return resposne.data;
    },
  });
  return { user: data };
};
