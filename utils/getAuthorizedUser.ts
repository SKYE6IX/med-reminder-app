import { useUserStore } from "@/stores/user-store";
import { UserResponse } from "@/types/user";
import { api } from "./axiosInstance";

export const getAuthorizedUser = async () => {
  const { data } = await api.get<UserResponse>("/users", {
    id: "user-data",
  });
  useUserStore.getState().setUser(data);
};
