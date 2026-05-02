import { UserResponse } from "@/types/user";
import { create } from "zustand";

interface UserStore {
  userData: UserResponse | null;
  setUser: (user: UserResponse) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  userData: null,
  setUser(user) {
    set({ userData: user });
  },
}));
