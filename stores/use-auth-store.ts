import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  hasCompleteOnboarding: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  completeOnaboarding: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      hasCompleteOnboarding: false,
      isAuthenticated: false,
      setIsAuthenticated(isAuthenticated) {
        set((state) => ({ ...state, isAuthenticated }));
      },
      completeOnaboarding() {
        set((state) => ({ ...state, hasCompleteOnboarding: true }));
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
      partialize: (state) => ({
        hasCompleteOnboarding: state.hasCompleteOnboarding,
      }),
    },
  ),
);
