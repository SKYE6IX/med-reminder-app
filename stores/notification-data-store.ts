import { ScheduleEventResponse } from "@/types/medication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UpdatedNotificationData {
  scheduleId: string | undefined;
  scheduleData: ScheduleEventResponse | null;
  setScheduleData: (data: ScheduleEventResponse, id: string) => void;
  clearScheduleData: () => void;
}

export const useNotificationDataStore = create<UpdatedNotificationData>()(
  persist(
    (set) => ({
      scheduleId: undefined,
      scheduleData: null,
      setScheduleData(data, id) {
        set(() => ({ scheduleData: data, scheduleId: id }));
      },

      clearScheduleData() {
        set((state) => ({ ...state, scheduleId: undefined, scheduleData: null }));
      },
    }),
    {
      name: "notification-event-data",
      storage: createJSONStorage(() => ({
        setItem: AsyncStorage.setItem,
        getItem: AsyncStorage.getItem,
        removeItem: AsyncStorage.removeItem,
      })),
    },
  ),
);
