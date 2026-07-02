import { QueryKey } from "@/constants/query-keys";
import { api } from "./axiosInstance";
import { queryClient } from "./query-client";

export const getAuthorizedUser = async () => {
  queryClient.fetchQuery({
    queryKey: [QueryKey.users],
    queryFn: async () => {
      const response = await api.get("users");
      return response.data;
    },
    staleTime: Infinity,
  });
};
